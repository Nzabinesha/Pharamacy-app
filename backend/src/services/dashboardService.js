import { getDb } from '../database/db.js';

export function getPharmacyStock(pharmacyId) {
  const db = getDb();
  
  const stocks = db.prepare(`
    SELECT 
      ps.id as stockId,
      m.id as medicineId,
      m.name as name,
      m.strength as strength,
      m.requires_prescription as requiresPrescription,
      ps.price_rwf as priceRWF,
      ps.quantity as quantity
    FROM pharmacy_stocks ps
    JOIN medicines m ON ps.medicine_id = m.id
    WHERE ps.pharmacy_id = ?
    ORDER BY m.name
  `).all(pharmacyId);
  
  return stocks.map(stock => ({
    id: `med-${stock.medicineId}`,
    stockId: stock.stockId,
    medicineId: stock.medicineId,
    name: stock.name,
    strength: stock.strength || undefined,
    priceRWF: stock.priceRWF,
    requiresPrescription: stock.requiresPrescription === 1,
    quantity: stock.quantity
  }));
}

export function updateStock(pharmacyId, medicineId, quantity, priceRWF) {
  const db = getDb();
  
  // Check if stock exists
  const stock = db.prepare(`
    SELECT id FROM pharmacy_stocks 
    WHERE pharmacy_id = ? AND medicine_id = ?
  `).get(pharmacyId, medicineId);
  
  if (!stock) {
    throw new Error('Stock not found');
  }
  
  // Update stock
  db.prepare(`
    UPDATE pharmacy_stocks 
    SET quantity = ?, price_rwf = ?
    WHERE pharmacy_id = ? AND medicine_id = ?
  `).run(quantity, priceRWF, pharmacyId, medicineId);
  
  return getPharmacyStock(pharmacyId);
}

export function getPharmacyOrders(pharmacyId, status = null) {
  const db = getDb();
  
  let query = `
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
      GROUP_CONCAT(
        m.name || ' (' || oi.quantity || 'x)'
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN medicines m ON oi.medicine_id = m.id
    WHERE o.pharmacy_id = ?
  `;
  
  const params = [pharmacyId];
  
  if (status) {
    query += ' AND o.status = ?';
    params.push(status);
  }
  
  query += ' GROUP BY o.id ORDER BY o.created_at DESC';
  
  const orders = db.prepare(query).all(...params);
  
  // Get order items for each order
  return orders.map(order => {
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
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      items: items.map(item => 
        `${item.medicine_name}${item.medicine_strength ? ` ${item.medicine_strength}` : ''} x ${item.quantity}`
      ),
      itemDetails: items,
      total: order.total_rwf,
      status: order.status,
      prescriptionStatus: order.prescription_status,
      prescriptionFile: order.prescription_file,
      delivery: order.delivery === 1,
      address: order.delivery_address,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };
  });
}

export function updateOrderStatus(pharmacyId, orderId, status) {
  const db = getDb();
  
  // Verify order belongs to pharmacy
  const order = db.prepare('SELECT id FROM orders WHERE id = ? AND pharmacy_id = ?').get(orderId, pharmacyId);
  if (!order) {
    throw new Error('Order not found');
  }
  
  // Update order status
  db.prepare(`
    UPDATE orders 
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND pharmacy_id = ?
  `).run(status, orderId, pharmacyId);
  
  return getPharmacyOrders(pharmacyId);
}

export function updatePrescriptionStatus(pharmacyId, orderId, prescriptionStatus) {
  const db = getDb();
  
  // Verify order belongs to pharmacy
  const order = db.prepare('SELECT id FROM orders WHERE id = ? AND pharmacy_id = ?').get(orderId, pharmacyId);
  if (!order) {
    throw new Error('Order not found');
  }
  
  // Update prescription status
  db.prepare(`
    UPDATE orders 
    SET prescription_status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND pharmacy_id = ?
  `).run(prescriptionStatus, orderId, pharmacyId);
  
  return getPharmacyOrders(pharmacyId);
}

export function getPharmacyIdFromUser(userId) {
  const db = getDb();
  const user = db.prepare('SELECT pharmacy_id FROM users WHERE id = ?').get(userId);
  return user?.pharmacy_id || null;
}

export function addStock(pharmacyId, medicineId, quantity, priceRWF) {
  const db = getDb();
  
  // Check if stock already exists
  const existing = db.prepare(`
    SELECT id FROM pharmacy_stocks 
    WHERE pharmacy_id = ? AND medicine_id = ?
  `).get(pharmacyId, medicineId);
  
  if (existing) {
    throw new Error('Stock already exists for this medicine');
  }
  
  // Insert new stock
  db.prepare(`
    INSERT INTO pharmacy_stocks (pharmacy_id, medicine_id, quantity, price_rwf)
    VALUES (?, ?, ?, ?)
  `).run(pharmacyId, medicineId, quantity, priceRWF);
  
  return getPharmacyStock(pharmacyId);
}

export function deleteStock(pharmacyId, medicineId) {
  const db = getDb();
  
  // Verify stock exists and belongs to pharmacy
  const stock = db.prepare(`
    SELECT id FROM pharmacy_stocks 
    WHERE pharmacy_id = ? AND medicine_id = ?
  `).get(pharmacyId, medicineId);
  
  if (!stock) {
    throw new Error('Stock not found');
  }
  
  // Delete stock
  db.prepare(`
    DELETE FROM pharmacy_stocks 
    WHERE pharmacy_id = ? AND medicine_id = ?
  `).run(pharmacyId, medicineId);
  
  return getPharmacyStock(pharmacyId);
}

export function getAllMedicines() {
  const db = getDb();
  return db.prepare(`
    SELECT id, name, strength, requires_prescription as requiresPrescription
    FROM medicines
    ORDER BY name
  `).all();
}

export function getPharmacyInsurance(pharmacyId) {
  const db = getDb();
  const insurances = db.prepare(`
    SELECT 
      it.id,
      it.name
    FROM pharmacy_insurance pi
    JOIN insurance_types it ON pi.insurance_id = it.id
    WHERE pi.pharmacy_id = ?
    ORDER BY it.name
  `).all(pharmacyId);
  
  return insurances;
}

export function getAllInsuranceTypes() {
  const db = getDb();
  return db.prepare(`
    SELECT id, name
    FROM insurance_types
    ORDER BY name
  `).all();
}

export function addInsurancePartner(pharmacyId, insuranceId) {
  const db = getDb();
  
  // Check if already exists
  const existing = db.prepare(`
    SELECT id FROM pharmacy_insurance 
    WHERE pharmacy_id = ? AND insurance_id = ?
  `).get(pharmacyId, insuranceId);
  
  if (existing) {
    throw new Error('Insurance partner already added');
  }
  
  // Add insurance partner
  db.prepare(`
    INSERT INTO pharmacy_insurance (pharmacy_id, insurance_id)
    VALUES (?, ?)
  `).run(pharmacyId, insuranceId);
  
  return getPharmacyInsurance(pharmacyId);
}

export function removeInsurancePartner(pharmacyId, insuranceId) {
  const db = getDb();
  
  // Verify exists
  const existing = db.prepare(`
    SELECT id FROM pharmacy_insurance 
    WHERE pharmacy_id = ? AND insurance_id = ?
  `).get(pharmacyId, insuranceId);
  
  if (!existing) {
    throw new Error('Insurance partner not found');
  }
  
  // Remove insurance partner
  db.prepare(`
    DELETE FROM pharmacy_insurance 
    WHERE pharmacy_id = ? AND insurance_id = ?
  `).run(pharmacyId, insuranceId);
  
  return getPharmacyInsurance(pharmacyId);
}

export function getOrderDetails(pharmacyId, orderId) {
  const db = getDb();
  
  const order = db.prepare(`
    SELECT 
      o.*,
      GROUP_CONCAT(
        m.name || ' (' || oi.quantity || 'x)'
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN medicines m ON oi.medicine_id = m.id
    WHERE o.id = ? AND o.pharmacy_id = ?
    GROUP BY o.id
  `).get(orderId, pharmacyId);
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  const items = db.prepare(`
    SELECT 
      oi.quantity,
      oi.price_rwf,
      m.name as medicine_name,
      m.strength as medicine_strength
    FROM order_items oi
    JOIN medicines m ON oi.medicine_id = m.id
    WHERE oi.order_id = ?
  `).all(orderId);
  
  return {
    id: order.id,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone,
    items: items.map(item => 
      `${item.medicine_name}${item.medicine_strength ? ` ${item.medicine_strength}` : ''} x ${item.quantity}`
    ),
    itemDetails: items,
    total: order.total_rwf,
    status: order.status,
    prescriptionStatus: order.prescription_status,
    prescriptionFile: order.prescription_file,
    delivery: order.delivery === 1,
    address: order.delivery_address,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  };
}
