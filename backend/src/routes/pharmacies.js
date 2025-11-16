import express from 'express';
import { searchPharmacies, getPharmacyById } from '../services/pharmacyService.js';
import { getDb } from '../database/db.js';

export const pharmaciesRouter = express.Router();

// GET /api/pharmacies - Search pharmacies
pharmaciesRouter.get('/', (req, res) => {
  try {
    const { q, loc, insurance } = req.query;
    const results = searchPharmacies({ q, loc, insurance });
    res.json(results);
  } catch (error) {
    console.error('Error searching pharmacies:', error);
    res.status(500).json({ error: 'Failed to search pharmacies', message: error.message });
  }
});

// GET /api/pharmacies/list/all - Get all pharmacies (for linking during signup)
// Must come before /:id route
pharmaciesRouter.get('/list/all', (req, res) => {
  try {
    const db = getDb();
    const pharmacies = db.prepare(`
      SELECT id, name, sector, phone
      FROM pharmacies
      ORDER BY name
    `).all();
    res.json(pharmacies);
  } catch (error) {
    console.error('Error getting pharmacies list:', error);
    res.status(500).json({ error: 'Failed to get pharmacies', message: error.message });
  }
});

// GET /api/pharmacies/:id - Get single pharmacy
pharmaciesRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = getPharmacyById(id);

    if (!pharmacy) {
      return res.status(404).json({ error: 'Pharmacy not found' });
    }

    res.json(pharmacy);
  } catch (error) {
    console.error('Error getting pharmacy:', error);
    res.status(500).json({ error: 'Failed to get pharmacy', message: error.message });
  }
});
