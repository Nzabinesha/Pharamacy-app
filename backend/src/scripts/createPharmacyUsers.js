import { getDb } from '../database/db.js';
import bcrypt from 'bcryptjs';

/**
 * Script to create pharmacy user accounts for all pharmacies in the database
 * Usage: node src/scripts/createPharmacyUsers.js
 * 
 * This creates a default user account for each pharmacy with:
 * - Email: pharmacy-name@medifinder.local (lowercase, spaces replaced with hyphens)
 * - Password: pharmacy123 (should be changed after first login)
 * - Role: pharmacy
 * - Linked to the pharmacy record
 */

async function createPharmacyUsers() {
  const db = getDb();
  
  console.log('🏥 Creating pharmacy user accounts...\n');
  
  // Get all pharmacies without linked users
  const pharmacies = db.prepare(`
    SELECT p.id, p.name, p.phone
    FROM pharmacies p
    LEFT JOIN users u ON p.id = u.pharmacy_id
    WHERE u.id IS NULL
  `).all();
  
  if (pharmacies.length === 0) {
    console.log('✅ All pharmacies already have user accounts.');
    return;
  }
  
  console.log(`Found ${pharmacies.length} pharmacy(ies) without user accounts:\n`);
  
  const defaultPassword = 'pharmacy123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  
  let created = 0;
  
  for (const pharmacy of pharmacies) {
    // Generate email from pharmacy name
    const email = `${pharmacy.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}@medifinder.local`;
    
    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      console.log(`⚠️  Email ${email} already exists, skipping ${pharmacy.name}`);
      continue;
    }
    
    // Create user ID
    const userId = `pharmacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Insert user
    db.prepare(`
      INSERT INTO users (id, email, name, phone, password, role, pharmacy_id)
      VALUES (?, ?, ?, ?, ?, 'pharmacy', ?)
    `).run(userId, email, pharmacy.name, pharmacy.phone || null, hashedPassword, pharmacy.id);
    
    console.log(`✅ Created account for: ${pharmacy.name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${defaultPassword} (please change after first login)`);
    console.log(`   Linked to pharmacy: ${pharmacy.id}\n`);
    created++;
  }
  
  console.log(`\n✅ Created ${created} out of ${pharmacies.length} pharmacy user account(s).`);
  console.log('\n📝 Default credentials:');
  console.log('   Email: pharmacy-name@medifinder.local');
  console.log('   Password: pharmacy123');
  console.log('\n⚠️  Please change passwords after first login!');
}

// Run if executed directly
if (import.meta.url.endsWith('createPharmacyUsers.js')) {
  createPharmacyUsers().catch(console.error);
}

export { createPharmacyUsers };

