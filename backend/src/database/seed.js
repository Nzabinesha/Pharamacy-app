import { initializeDatabase, getDatabase } from './schema.js';

// Insurance types mapping
const insuranceMapping = {
  'Britam': 'Britam',
  'Eden Care Medical': 'Eden Care Medical',
  'Radiant Insurance': 'Radiant Insurance',
  'Military Medical Insurance': 'Military Medical Insurance',
  'Old Mutual Insurance Rwanda': 'Old Mutual Insurance Rwanda',
  'Prime Insurance': 'Prime Insurance',
  'Sanlam Allianz Life Insurance Plc': 'Sanlam Allianz Life Insurance Plc',
  'SAHAM ASSURANCE RWANDA': 'SAHAM ASSURANCE RWANDA',
  'Sonarwa': 'Sonarwa',
  'Medical Insurance Scheme Of University Of Rwanda': 'Medical Insurance Scheme Of University Of Rwanda',
  'Zion Insurance Brokers Ltd': 'Zion Insurance Brokers Ltd'
};

// Pharmacy data
const pharmacies = [
  {
    id: 'ph-001',
    name: 'Adrenaline Pharmacy Ltd',
    sector: 'Remera',
    address: 'Kigali - Remera, Rwanda',
    phone: '+250785636683',
    delivery: true,
    lat: -1.9570,
    lng: 30.1220,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Glucose (5% w/v)', 'Ceftriaxone + Sulbactam', 'Basiliximab', 'Miconazole Nitrate', 
      'Prasugrel', 'Tacrolimus', 'Ranibizumab', 'Ferrous Sulphate', 'Ornidazole',
      'Magnesium Hydroxide / Aluminium Hydroxide / Simethicone', 
      'Sulphamethoxazole & Trimethoprim', 'Clindamycin Phosphate + Tretinoin', 
      'Azithromycin', 'Ciprofloxacin'
    ]
  },
  {
    id: 'ph-002',
    name: 'PHARMACIE PHARMALAB',
    sector: 'Kacyiru',
    address: '25W6+RG9, Kacyiru, Kigali, Rwanda',
    phone: '+250788477537',
    delivery: true,
    lat: -1.9447,
    lng: 30.0614,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-003',
    name: 'Pharmacie Conseil',
    sector: 'Kinyinya',
    address: 'KN 78 St, Kinyinya, Kigali, Rwanda',
    phone: '+250788380066',
    delivery: true,
    lat: -1.9441,
    lng: 30.0619,
    insurance: [
      'Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 
      'Old Mutual Insurance Rwanda', 'Prime Insurance', 'Sanlam Allianz Life Insurance Plc', 
      'SAHAM ASSURANCE RWANDA', 'Sonarwa', 'Medical Insurance Scheme Of University Of Rwanda', 
      'Zion Insurance Brokers Ltd'
    ],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-004',
    name: 'AfriChem Rwanda Ltd',
    sector: 'Gikondo',
    address: 'KN 1 RD 67, Gikondo, Kigali, Rwanda',
    phone: '+250788300784',
    delivery: true,
    description: 'Leading supplier of quality chemical products',
    lat: -1.9570,
    lng: 30.1220,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-005',
    name: 'PHARMACIE CONTINENTALE',
    sector: 'Kimihurura',
    address: 'KG 1 Ave, Kimihurura, Kigali, Rwanda',
    phone: '+250788306878',
    delivery: true,
    description: 'Quality pharmaceuticals and healthcare services in Kigali',
    lat: -1.9480,
    lng: 30.0580,
    insurance: [
      'Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 
      'Old Mutual Insurance Rwanda', 'Prime Insurance', 'Sanlam Allianz Life Insurance Plc', 
      'SAHAM ASSURANCE RWANDA', 'Sonarwa', 'Medical Insurance Scheme Of University Of Rwanda', 
      'Zion Insurance Brokers Ltd'
    ],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-006',
    name: 'Kipharma',
    sector: 'Gisozi',
    address: 'KN 74 Street, Gisozi, Kigali, Rwanda',
    phone: '+250252572944',
    delivery: true,
    lat: -1.9440,
    lng: 30.0620,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-007',
    name: 'Oasis Pharmacy',
    sector: 'Masoro',
    address: '24FM+3P4, Masoro, Kigali, Rwanda',
    phone: '+250781958800',
    delivery: true,
    lat: -1.9450,
    lng: 30.0600,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol'
    ]
  },
  {
    id: 'ph-008',
    name: 'Anik Industries',
    sector: 'Kacyiru',
    address: 'Bp. 211, Kacyiru, Kigali, Rwanda',
    phone: '+250252572164',
    delivery: true,
    description: 'Leading provider of quality industrial products',
    lat: -1.9460,
    lng: 30.0590,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-009',
    name: 'DEPOT PHARMACEUTIQUE',
    sector: 'Kimironko',
    address: 'Kimironko, P.O.Box 2770, Kigali, Rwanda',
    phone: '+250252577571',
    delivery: true,
    description: 'Quality pharmaceuticals and healthcare services provider',
    lat: -1.9440,
    lng: 30.0620,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Hydrochloride', 'Rifampin + Isoniazid', 'Etoricoxib', 'Phloroglucinol + Trimethyl Phloroglucinol', 
      'Zinc Sulfate Monohydrate', 'Magnesium Pidolate', 'Ofloxacin + Ornidazole', 'Metronidazole', 
      'Artesunate', 'Itraconazole', 'Febuxostat', 'Cyproheptadine Hydrochloride + Lysine Hydrochloride',
      'Artemether + Lumefantrine', 'Atorvastatin + Ezetimibe',
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-010',
    name: 'BIOPHARMACIA',
    sector: 'Kacyiru',
    address: 'Kacyiru, P.O.Box 2513, Kigali, Rwanda',
    phone: '+250252504086',
    delivery: true,
    description: 'Innovative solutions for healthcare and pharmaceuticals',
    lat: -1.9435,
    lng: 30.0615,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-011',
    name: 'Unipharma Kipharma',
    sector: 'Remera',
    address: 'KN 74 Street, Remera, Kigali, Rwanda',
    phone: '+250252572944',
    delivery: true,
    lat: -1.9440,
    lng: 30.0620,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Hydrochloride', 'Rifampin + Isoniazid', 'Etoricoxib', 'Phloroglucinol + Trimethyl Phloroglucinol', 
      'Zinc Sulfate Monohydrate', 'Magnesium Pidolate', 'Ofloxacin + Ornidazole', 'Metronidazole', 
      'Artesunate', 'Itraconazole', 'Febuxostat', 'Cyproheptadine Hydrochloride + Lysine Hydrochloride',
      'Artemether + Lumefantrine', 'Atorvastatin + Ezetimibe'
    ]
  },
  {
    id: 'ph-012',
    name: 'Lifecare',
    sector: 'Kimironko',
    address: 'Bp. 5000, Kimironko, Kigali, Rwanda',
    phone: '+250252501313',
    delivery: true,
    lat: -1.9470,
    lng: 30.0580,
    insurance: [
      'Sanlam Allianz Life Insurance Plc', 'SAHAM ASSURANCE RWANDA', 'Sonarwa', 
      'Medical Insurance Scheme Of University Of Rwanda', 'Zion Insurance Brokers Ltd'
    ],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-013',
    name: 'Conseil Pharmacy',
    sector: 'Remera',
    address: 'Bp. 1072, Remera, Kigali, Rwanda',
    phone: '+250252572374',
    delivery: true,
    lat: -1.9455,
    lng: 30.0595,
    insurance: [
      'Sanlam Allianz Life Insurance Plc', 'SAHAM ASSURANCE RWANDA', 'Sonarwa', 
      'Medical Insurance Scheme Of University Of Rwanda', 'Zion Insurance Brokers Ltd'
    ],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-014',
    name: 'DEPOT PHARMACEUTIQUE ET MATERIEL MEDICAL KALISIMBI',
    sector: 'Ndera',
    address: 'Ndera, P.O.Box 4526, Kigali, Rwanda',
    phone: '+250252202549',
    delivery: true,
    description: 'Quality pharmaceuticals and medical supplies distributor',
    lat: -1.9430,
    lng: 30.0610,
    insurance: [
      'Sanlam Allianz Life Insurance Plc', 'SAHAM ASSURANCE RWANDA', 'Sonarwa', 
      'Medical Insurance Scheme Of University Of Rwanda', 'Zion Insurance Brokers Ltd'
    ],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-015',
    name: 'Moderne',
    sector: 'Nyamirambo',
    address: 'Nyamirambo, Kigali, Rwanda',
    phone: '+250788000000',
    delivery: true,
    lat: -1.9420,
    lng: 30.0600,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-016',
    name: 'Opa Pharmacy',
    sector: 'Remera',
    address: 'Remera, Kigali, Rwanda',
    phone: '+250788000001',
    delivery: true,
    lat: -1.9560,
    lng: 30.1210,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  },
  {
    id: 'ph-017',
    name: "Sara's Pharmacy",
    sector: 'Kimironko',
    address: 'Kimironko, Kigali, Rwanda',
    phone: '+250788000002',
    delivery: true,
    lat: -1.9465,
    lng: 30.0585,
    insurance: ['Britam', 'Eden Care Medical', 'Radiant Insurance', 'Military Medical Insurance', 'Old Mutual Insurance Rwanda', 'Prime Insurance'],
    stocks: [
      'Cyclobenzaprine Hydrochloride', 'Azithromycin (suspension)', 'Secnidazole', 
      'Omeprazole', 'Levonorgestrel', 'Erythromycin', 'Paracetamol', 'Methyldopa', 
      'Ibuprofen', 'Linagliptin', 'Bisoprolol Fumarate', 'Clobetasol Propionate', 
      'Tramadol Hydrochloride', 'Methocarbamol + Paracetamol', 'Deflazacort', 
      'Nebivolol Hydrochlorothiazide', 'Budesonide'
    ]
  }
];

// Helper function to extract medicine name and strength
function parseMedicine(medicineName) {
  const parts = medicineName.split('(');
  const name = parts[0].trim();
  const strength = parts[1] ? parts[1].replace(')', '').trim() : null;
  
  // Check if prescription required (common prescription medicines)
  const prescriptionMeds = [
    'Ceftriaxone', 'Basiliximab', 'Tacrolimus', 'Ranibizumab', 
    'Levonorgestrel', 'Tramadol', 'Clobetasol', 'Azithromycin',
    'Ciprofloxacin', 'Ornidazole', 'Secnidazole', 'Clindamycin'
  ];
  const requiresPrescription = prescriptionMeds.some(med => 
    medicineName.toLowerCase().includes(med.toLowerCase())
  );
  
  return { name, strength, requiresPrescription };
}

// Generate random price between 500 and 5000 RWF
function randomPrice() {
  return Math.floor(Math.random() * 4500) + 500;
}

// Generate random quantity between 0 and 100
function randomQuantity() {
  return Math.floor(Math.random() * 101);
}

export function seedDatabase() {
  console.log('🌱 Starting database seed...');
  const db = initializeDatabase();
  
  // Clear existing data
  db.exec('DELETE FROM pharmacy_stocks');
  db.exec('DELETE FROM pharmacy_insurance');
  db.exec('DELETE FROM pharmacy_stocks');
  db.exec('DELETE FROM pharmacies');
  db.exec('DELETE FROM medicines');
  db.exec('DELETE FROM insurance_types');

  // Insert insurance types
  console.log('📋 Inserting insurance types...');
  const insertInsurance = db.prepare('INSERT OR IGNORE INTO insurance_types (name) VALUES (?)');
  const insuranceNames = Object.values(insuranceMapping);
  insuranceNames.forEach(name => insertInsurance.run(name));

  // Get insurance IDs
  const getInsuranceId = db.prepare('SELECT id FROM insurance_types WHERE name = ?');
  const insuranceMap = new Map();
  insuranceNames.forEach(name => {
    const row = getInsuranceId.get(name);
    if (row) insuranceMap.set(name, row.id);
  });

  // Insert pharmacies
  console.log('🏥 Inserting pharmacies...');
  const insertPharmacy = db.prepare(`
    INSERT INTO pharmacies (id, name, sector, address, phone, delivery, lat, lng, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  pharmacies.forEach(pharmacy => {
    insertPharmacy.run(
      pharmacy.id,
      pharmacy.name,
      pharmacy.sector,
      pharmacy.address,
      pharmacy.phone,
      pharmacy.delivery ? 1 : 0,
      pharmacy.lat,
      pharmacy.lng,
      pharmacy.description || null
    );
  });

  // Link pharmacies to insurance
  console.log('🔗 Linking pharmacies to insurance...');
  const insertPharmacyInsurance = db.prepare(`
    INSERT INTO pharmacy_insurance (pharmacy_id, insurance_id)
    VALUES (?, ?)
  `);

  pharmacies.forEach(pharmacy => {
    pharmacy.insurance.forEach(insuranceName => {
      const insuranceId = insuranceMap.get(insuranceName);
      if (insuranceId) {
        insertPharmacyInsurance.run(pharmacy.id, insuranceId);
      }
    });
  });

  // Collect all unique medicines
  const allMedicines = new Set();
  pharmacies.forEach(pharmacy => {
    pharmacy.stocks.forEach(medicine => {
      const parsed = parseMedicine(medicine);
      allMedicines.add(JSON.stringify({ name: parsed.name, strength: parsed.strength, requiresPrescription: parsed.requiresPrescription }));
    });
  });

  // Insert medicines
  console.log('💊 Inserting medicines...');
  const insertMedicine = db.prepare(`
    INSERT INTO medicines (name, strength, requires_prescription)
    VALUES (?, ?, ?)
  `);

  const medicineMap = new Map();
  allMedicines.forEach(medStr => {
    const med = JSON.parse(medStr);
    const result = insertMedicine.run(med.name, med.strength, med.requiresPrescription ? 1 : 0);
    medicineMap.set(`${med.name}${med.strength ? `(${med.strength})` : ''}`, result.lastInsertRowid);
  });

  // Insert pharmacy stocks
  console.log('📦 Inserting pharmacy stocks...');
  const insertStock = db.prepare(`
    INSERT INTO pharmacy_stocks (pharmacy_id, medicine_id, price_rwf, quantity)
    VALUES (?, ?, ?, ?)
  `);

  pharmacies.forEach(pharmacy => {
    pharmacy.stocks.forEach(medicineName => {
      const parsed = parseMedicine(medicineName);
      const key = `${parsed.name}${parsed.strength ? `(${parsed.strength})` : ''}`;
      const medicineId = medicineMap.get(key);
      
      if (medicineId) {
        // Check if stock already exists for this pharmacy
        const existing = db.prepare('SELECT id FROM pharmacy_stocks WHERE pharmacy_id = ? AND medicine_id = ?').get(pharmacy.id, medicineId);
        if (!existing) {
          insertStock.run(pharmacy.id, medicineId, randomPrice(), randomQuantity());
        }
      }
    });
  });

  db.close();
  console.log('✅ Database seeded successfully!');
}

// Run seed if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.includes('seed.js');

if (isMainModule || process.argv[1]?.includes('seed.js')) {
  seedDatabase();
}
