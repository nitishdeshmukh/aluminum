const mongoose = require('mongoose');
const MaterialRate = require('../models/MaterialRate');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const defaultRates = [
  { key: 'alu_color', value: 410, label: 'Aluminum Color (Rs/kg)' },
  { key: 'alu_silver', value: 360, label: 'Aluminum Silver (Rs/kg)' },
  { key: 'glass', value: 45, label: 'Glass (Rs/sqft)' },
  { key: 'glass_rubber', value: 10, label: 'Glass Rubber (Rs/ft)' },
  { key: 'track_rubber', value: 80, label: 'Track Rubber (Rs/window)' },
  { key: 'mosquito_net', value: 10, label: 'Mosquito Net (Rs/sqft)' },
  { key: 'u_channel', value: 100, label: 'U-Channel (Rs/window)' },
  { key: 'screw', value: 80, label: 'Screw (Rs/window)' },
  { key: 'lock', value: 170, label: 'Lock (Rs/unit)' },
  { key: 'bearing', value: 10, label: 'Bearing (Rs/unit)' },
  { key: 'labour_min', value: 350, label: 'Labour Minimum (Rs)' },
  { key: 'labour_sqft', value: 24, label: 'Labour (Rs/sqft)' }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await MaterialRate.deleteMany({});
    await Admin.deleteMany({});

    // Seed material rates
    for (const rate of defaultRates) {
      await MaterialRate.findOneAndUpdate(
        { key: rate.key },
        rate,
        { upsert: true }
      );
    }
    console.log('Material rates seeded successfully');

    // Seed default admin
    const defaultAdminPassword = await bcrypt.hash('admin123', 12);
    const defaultAdmin = new Admin({
      username: 'admin',
      passwordHash: defaultAdminPassword
    });
    await defaultAdmin.save();
    console.log('Default admin user created (username: admin, password: admin123)');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
