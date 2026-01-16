const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const MaterialRate = require('./models/MaterialRate');
const Admin = require('./models/Admin');
const Category = require('./models/Category');

const defaultRates = [
    // Aluminum Rates
    { key: 'alu_color', value: 410, label: 'Aluminum Color (Rs/kg)' },
    { key: 'alu_silver', value: 360, label: 'Aluminum Silver (Rs/kg)' },

    // Glass & Rubber
    { key: 'glass', value: 45, label: 'Glass (Rs/sqft)' },
    { key: 'glass_rubber', value: 10, label: 'Glass Rubber (Rs/ft)' },
    { key: 'mosquito_net', value: 20, label: 'Mosquito Net (Rs/sqft)' }, // Derived: 10rs for 0.5sqft -> 20/sqft

    // Hardware - Fixed Sets (User specified)
    { key: 'u_channel_fixed', value: 100, label: 'U-Channel Set Cost (Rs)' },
    { key: 'screw_fixed', value: 80, label: 'Screw Set Cost (Rs)' },

    // Hardware - Fixed per window
    { key: 'lock', value: 170, label: 'Lock (Rs/unit)' },
    { key: 'bearing', value: 60, label: 'Bearings Set (Rs/window)' },

    // Labor
    { key: 'labour_min', value: 350, label: 'Labour Minimum (Rs)' },
    { key: 'labour_sqft', value: 24, label: 'Labour Rate (Rs/sqft)' }
];

const seedDatabase = async () => {
    try {
        console.log('Checking for default rates...');
        // 1. Seed Rates
        for (const rate of defaultRates) {
            // Upsert rates to ensure new keys are added even if DB exists
            // We use findOneAndUpdate with upsert
            await MaterialRate.findOneAndUpdate(
                { key: rate.key },
                {
                    $setOnInsert: { key: rate.key, label: rate.label },
                    $set: { value: rate.value } // Only update value if we want to force defaults, or setOnInsert to keep user edits?
                    // User said "ye sab add kro", implying "apply these values". So we force update.
                },
                { upsert: true, new: true }
            );
        }
        console.log('Rates synced with latest configuration.');

        // 2. Seed Admin
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            console.log('Seeding default admin...');
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('admin123', salt);

            await Admin.create({
                username: 'admin',
                passwordHash
            });
            console.log('Default admin seeded (admin/admin123).');
        }

        // 3. Seed Categories
        const categoryCount = await Category.countDocuments();
        if (categoryCount === 0) {
            console.log('Seeding default categories...');
            const defaultCategories = ['Window', 'Door', 'Partition', 'Glass Work'];
            for (const name of defaultCategories) {
                await Category.create({ name });
            }
            console.log('Categories seeded.');
        }

    } catch (error) {
        console.error('Seeding error:', error);
    }
};

module.exports = seedDatabase;
