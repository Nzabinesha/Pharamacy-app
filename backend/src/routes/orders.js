import express from 'express';
import { getDb } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

export const ordersRouter = express.Router();

// POST /api/orders - Create a new order
ordersRouter.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      pharmacyId, 
      items, 
      delivery, 
      deliveryAddress,
      prescriptionFile 
    } = req.body;

    // Validation
    if (!pharmacyId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Pharmacy ID and items are required' 
      });
    }

    const db = getDb();
    
    // Calculate total
    let totalRwf = 0;
    const orderItems = [];
    
    for (const item of items) {
      // Get medicine price from pharmacy stock
      const stock = db.prepare(`
        SELECT ps.price_rwf, ps.quantity, m.id as medicine_id
        FROM pharmacy_stocks ps
        JOIN medicines m ON ps.medicine_id = m.id
        WHERE ps.pharmacy_id = ? AND (m.name LIKE ? OR ps.id = ?)
        LIMIT 1
      `).get(pharmacyId, `%${item.name}%`, item.medicineId);
      
      if (!stock) {
        return res.status(400).json({ 
          error: 'Invalid item', 
          message: `Medicine ${item.name} not found in pharmacy stock` 
        });
      }
      
      if (stock.quantity < item.quantity) {
        return res.status(400).json({ 
          error: 'Insufficient stock', 
          message: `Only ${stock.quantity} available for ${item.name}` 
        });
      }
      
      const itemTotal = stock.price_rwf * item.quantity;
      totalRwf += itemTotal;
      
      orderItems.push({
        medicineId: stock.medicine_id,
        quantity: item.quantity,
        priceRwf: stock.price_rwf
      });
    }

    // Check if prescription is required
    const requiresPrescription = db.prepare(`
      SELECT COUNT(*) as count
      FROM pharmacy_stocks ps
      JOIN medicines m ON ps.medicine_id = m.id
      WHERE ps.pharmacy_id = ? AND m.requires_prescription = 1
      AND m.id IN (${orderItems.map(() => '?').join(',')})
    `).get(pharmacyId, ...orderItems.map(i => i.medicineId));
    
    const needsPrescription = requiresPrescription.count > 0;
    const prescriptionStatus = needsPrescription 
      ? (prescriptionFile ? 'pending' : 'pending')
      : null;

    // Create order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get user info
    const user = req.user;
    const customerName = user?.name || 'Guest';
    const customerEmail = user?.email || null;
    const customerPhone = user?.phone || null;

    // Insert order
    db.prepare(`
      INSERT INTO orders (
        id, pharmacy_id, customer_name, customer_email, customer_phone,
        total_rwf, status, prescription_status, prescription_file,
        delivery, delivery_address
      )
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
    `).run(
      orderId,
      pharmacyId,
      customerName,
      customerEmail,
      customerPhone,
      totalRwf,
      prescriptionStatus,
      prescriptionFile || null,
      delivery ? 1 : 0,
      deliveryAddress || null
    );

    // Insert order items
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, medicine_id, quantity, price_rwf)
      VALUES (?, ?, ?, ?)
    `);

    for (const item of orderItems) {
      insertItem.run(orderId, item.medicineId, item.quantity, item.priceRwf);
    }

    res.status(201).json({
      id: orderId,
      message: 'Order created successfully',
      prescriptionStatus: prescriptionStatus
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order', 
      message: error.message 
    });
  }
});
