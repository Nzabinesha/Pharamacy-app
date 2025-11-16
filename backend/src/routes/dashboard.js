import express from 'express';
import { authenticateToken, requirePharmacy } from '../middleware/auth.js';
import { 
  getPharmacyStock, 
  updateStock,
  addStock,
  deleteStock,
  getAllMedicines,
  getPharmacyOrders, 
  getOrderDetails,
  updateOrderStatus,
  updatePrescriptionStatus,
  getPharmacyInsurance,
  getAllInsuranceTypes,
  addInsurancePartner,
  removeInsurancePartner,
  getPharmacyIdFromUser
} from '../services/dashboardService.js';

export const dashboardRouter = express.Router();

// All routes require authentication and pharmacy role
dashboardRouter.use(authenticateToken);
dashboardRouter.use(requirePharmacy);

// GET /api/dashboard/stock - Get pharmacy stock
dashboardRouter.get('/stock', (req, res) => {
  try {
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy. Please contact support.' 
      });
    }
    
    const stock = getPharmacyStock(pharmacyId);
    res.json(stock);
  } catch (error) {
    console.error('Error getting stock:', error);
    res.status(500).json({ error: 'Failed to get stock', message: error.message });
  }
});

// POST /api/dashboard/stock - Add new stock
dashboardRouter.post('/stock', (req, res) => {
  try {
    const { medicineId, quantity, priceRWF } = req.body;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    if (!medicineId || quantity === undefined || priceRWF === undefined) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'medicineId, quantity, and priceRWF are required' 
      });
    }
    
    const stock = addStock(pharmacyId, parseInt(medicineId), quantity, priceRWF);
    res.json(stock);
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: 'Failed to add stock', message: error.message });
  }
});

// PUT /api/dashboard/stock/:medicineId - Update stock
dashboardRouter.put('/stock/:medicineId', (req, res) => {
  try {
    const { medicineId } = req.params;
    const { quantity, priceRWF } = req.body;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    if (quantity === undefined || priceRWF === undefined) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Quantity and priceRWF are required' 
      });
    }
    
    const stock = updateStock(pharmacyId, parseInt(medicineId), quantity, priceRWF);
    res.json(stock);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock', message: error.message });
  }
});

// DELETE /api/dashboard/stock/:medicineId - Delete stock
dashboardRouter.delete('/stock/:medicineId', (req, res) => {
  try {
    const { medicineId } = req.params;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    const stock = deleteStock(pharmacyId, parseInt(medicineId));
    res.json(stock);
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ error: 'Failed to delete stock', message: error.message });
  }
});

// GET /api/dashboard/medicines - Get all available medicines
dashboardRouter.get('/medicines', (req, res) => {
  try {
    const medicines = getAllMedicines();
    res.json(medicines);
  } catch (error) {
    console.error('Error getting medicines:', error);
    res.status(500).json({ error: 'Failed to get medicines', message: error.message });
  }
});

// GET /api/dashboard/orders - Get pharmacy orders
dashboardRouter.get('/orders', (req, res) => {
  try {
    const { status } = req.query;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    const orders = getPharmacyOrders(pharmacyId, status || null);
    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: 'Failed to get orders', message: error.message });
  }
});

// PUT /api/dashboard/orders/:orderId/status - Update order status
dashboardRouter.put('/orders/:orderId/status', (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    if (!status) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Status is required' 
      });
    }
    
    const orders = updateOrderStatus(pharmacyId, orderId, status);
    res.json(orders);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status', message: error.message });
  }
});

// GET /api/dashboard/orders/:orderId - Get order details
dashboardRouter.get('/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    const order = getOrderDetails(pharmacyId, orderId);
    res.json(order);
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({ error: 'Failed to get order details', message: error.message });
  }
});

// PUT /api/dashboard/orders/:orderId/prescription - Update prescription status
dashboardRouter.put('/orders/:orderId/prescription', (req, res) => {
  try {
    const { orderId } = req.params;
    const { prescriptionStatus } = req.body;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    if (!prescriptionStatus) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Prescription status is required' 
      });
    }
    
    const orders = updatePrescriptionStatus(pharmacyId, orderId, prescriptionStatus);
    res.json(orders);
  } catch (error) {
    console.error('Error updating prescription status:', error);
    res.status(500).json({ error: 'Failed to update prescription status', message: error.message });
  }
});

// GET /api/dashboard/insurance - Get pharmacy insurance partners
dashboardRouter.get('/insurance', (req, res) => {
  try {
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    const insurance = getPharmacyInsurance(pharmacyId);
    res.json(insurance);
  } catch (error) {
    console.error('Error getting insurance:', error);
    res.status(500).json({ error: 'Failed to get insurance', message: error.message });
  }
});

// GET /api/dashboard/insurance/available - Get all available insurance types
dashboardRouter.get('/insurance/available', (req, res) => {
  try {
    const insuranceTypes = getAllInsuranceTypes();
    res.json(insuranceTypes);
  } catch (error) {
    console.error('Error getting insurance types:', error);
    res.status(500).json({ error: 'Failed to get insurance types', message: error.message });
  }
});

// POST /api/dashboard/insurance - Add insurance partner
dashboardRouter.post('/insurance', (req, res) => {
  try {
    const { insuranceId } = req.body;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    if (!insuranceId) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'insuranceId is required' 
      });
    }
    
    const insurance = addInsurancePartner(pharmacyId, parseInt(insuranceId));
    res.json(insurance);
  } catch (error) {
    console.error('Error adding insurance:', error);
    res.status(500).json({ error: 'Failed to add insurance', message: error.message });
  }
});

// DELETE /api/dashboard/insurance/:insuranceId - Remove insurance partner
dashboardRouter.delete('/insurance/:insuranceId', (req, res) => {
  try {
    const { insuranceId } = req.params;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    const insurance = removeInsurancePartner(pharmacyId, parseInt(insuranceId));
    res.json(insurance);
  } catch (error) {
    console.error('Error removing insurance:', error);
    res.status(500).json({ error: 'Failed to remove insurance', message: error.message });
  }
});
