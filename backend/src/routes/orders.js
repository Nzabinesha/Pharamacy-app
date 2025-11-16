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
      // Try multiple matching strategies
      let stock = null;
      
      // Extract numeric ID from "med-123" format if present
      let numericMedicineId = null;
      if (item.medicineId) {
        const match = item.medicineId.toString().match(/(\d+)$/);
        if (match) {
          numericMedicineId = parseInt(match[1]);
        } else if (!isNaN(parseInt(item.medicineId))) {
          numericMedicineId = parseInt(item.medicineId);
        }
      }
      
      // First, try by medicineId (numeric ID from database)
      if (numericMedicineId) {
        stock = db.prepare(`
          SELECT ps.price_rwf, ps.quantity, m.id as medicine_id, m.name as medicine_name
          FROM pharmacy_stocks ps
          JOIN medicines m ON ps.medicine_id = m.id
          WHERE ps.pharmacy_id = ? AND m.id = ?
        `).get(pharmacyId, numericMedicineId);
      }
      
      // If not found, try by name (case-insensitive, flexible matching)
      if (!stock && item.name) {
        // Clean the name for matching (remove extra spaces, normalize)
        const cleanName = item.name.trim().replace(/\s+/g, ' ');
        
        // Extract base name and strength if present (e.g., "Glucose 5% w/v" -> "Glucose" and "5% w/v")
        const nameParts = cleanName.split(/\s+(?=\d|%)/); // Split on space before numbers or %
        const baseName = nameParts[0]?.trim() || cleanName;
        const strengthPart = nameParts[1]?.trim() || '';
        
        // Try exact match first (case-insensitive)
        stock = db.prepare(`
          SELECT ps.price_rwf, ps.quantity, m.id as medicine_id, m.name as medicine_name
          FROM pharmacy_stocks ps
          JOIN medicines m ON ps.medicine_id = m.id
          WHERE ps.pharmacy_id = ? AND LOWER(TRIM(m.name)) = LOWER(?)
        `).get(pharmacyId, cleanName);
        
        // If not found, try matching base name only
        if (!stock && baseName) {
          stock = db.prepare(`
            SELECT ps.price_rwf, ps.quantity, m.id as medicine_id, m.name as medicine_name
            FROM pharmacy_stocks ps
            JOIN medicines m ON ps.medicine_id = m.id
            WHERE ps.pharmacy_id = ? AND LOWER(TRIM(m.name)) = LOWER(?)
          `).get(pharmacyId, baseName);
        }
        
        // If still not found, try matching with strength included (various formats)
        if (!stock) {
          stock = db.prepare(`
            SELECT ps.price_rwf, ps.quantity, m.id as medicine_id, m.name as medicine_name
            FROM pharmacy_stocks ps
            JOIN medicines m ON ps.medicine_id = m.id
            WHERE ps.pharmacy_id = ? AND (
              LOWER(TRIM(m.name || ' ' || COALESCE(m.strength, ''))) = LOWER(?) OR
              LOWER(TRIM(m.name || ' (' || COALESCE(m.strength, '') || ')')) = LOWER(?) OR
              LOWER(TRIM(COALESCE(m.strength, '') || ' ' || m.name)) = LOWER(?)
            )
            LIMIT 1
          `).get(pharmacyId, cleanName, cleanName, cleanName);
        }
        
        // If still not found, try flexible partial match (remove special chars)
        if (!stock) {
          // Normalize: remove special characters for fuzzy matching
          const normalize = (str) => str.replace(/[()%]/g, '').trim().toLowerCase();
          const normalizedSearch = normalize(cleanName);
          
          // Get all stocks for this pharmacy and match manually (more flexible)
          const allStocks = db.prepare(`
            SELECT ps.price_rwf, ps.quantity, m.id as medicine_id, m.name as medicine_name, m.strength
            FROM pharmacy_stocks ps
            JOIN medicines m ON ps.medicine_id = m.id
            WHERE ps.pharmacy_id = ?
          `).all(pharmacyId);
          
          // Find best match
          for (const s of allStocks) {
            const dbName = normalize(s.medicine_name || '');
            const dbFull = normalize((s.medicine_name || '') + ' ' + (s.strength || ''));
            const dbFullParen = normalize((s.medicine_name || '') + ' (' + (s.strength || '') + ')');
            
            if (dbName === normalizedSearch || 
                dbFull === normalizedSearch || 
                dbFullParen === normalizedSearch ||
                dbName.includes(normalizedSearch) || 
                normalizedSearch.includes(dbName) ||
                (baseName && dbName === normalize(baseName))) {
              stock = s;
              break;
            }
          }
        }
      }
      
      if (!stock) {
        // Debug: Log available medicines for this pharmacy
        const availableMedicines = db.prepare(`
          SELECT m.id, m.name, m.strength, ps.quantity
          FROM pharmacy_stocks ps
          JOIN medicines m ON ps.medicine_id = m.id
          WHERE ps.pharmacy_id = ?
        `).all(pharmacyId);
        
        console.error(`[Order Error] Medicine not found:`, {
          searched: item.name,
          medicineId: item.medicineId,
          pharmacyId: pharmacyId,
          available: availableMedicines.map(m => `${m.name} ${m.strength || ''}`.trim())
        });
        
        return res.status(400).json({ 
          error: 'Invalid item', 
          message: `Medicine "${item.name}" not found in pharmacy stock. Please verify the medicine is available at this pharmacy.` 
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

// GET /api/orders - Get user's orders
ordersRouter.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const db = getDb();
    
    // Get all orders for this user (by email)
    const orders = db.prepare(`
      SELECT 
        o.id,
        o.pharmacy_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.total_rwf,
        o.status,
        o.prescription_status,
        o.prescription_file,
        o.delivery,
        o.delivery_address,
        o.created_at,
        o.updated_at,
        p.name as pharmacy_name,
        p.phone as pharmacy_phone,
        p.address as pharmacy_address
      FROM orders o
      JOIN pharmacies p ON o.pharmacy_id = p.id
      WHERE o.customer_email = ?
      ORDER BY o.created_at DESC
    `).all(user.email);
    
    // Get order items for each order
    const ordersWithItems = orders.map(order => {
      const items = db.prepare(`
        SELECT 
          oi.quantity,
          oi.price_rwf,
          m.name as medicine_name,
          m.strength as medicine_strength
        FROM order_items oi
        JOIN medicines m ON oi.medicine_id = m.id
        WHERE oi.order_id = ?
      `).all(order.id);
      
      return {
        id: order.id,
        pharmacyId: order.pharmacy_id,
        pharmacyName: order.pharmacy_name,
        pharmacyPhone: order.pharmacy_phone,
        pharmacyAddress: order.pharmacy_address,
        items: items.map(item => ({
          name: item.medicine_name,
          strength: item.medicine_strength || undefined,
          quantity: item.quantity,
          priceRWF: item.price_rwf,
          total: item.price_rwf * item.quantity
        })),
        totalRWF: order.total_rwf,
        status: order.status,
        prescriptionStatus: order.prescription_status,
        prescriptionFile: order.prescription_file,
        delivery: order.delivery === 1,
        deliveryAddress: order.delivery_address,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      };
    });
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ 
      error: 'Failed to get orders', 
      message: error.message 
    });
  }
});
