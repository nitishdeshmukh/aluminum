const MaterialRate = require('../models/MaterialRate');

const getRates = async (req, res) => {
  try {
    const rates = await MaterialRate.find({});
    const ratesObject = {};

    rates.forEach(rate => {
      ratesObject[rate.key] = rate.value;
    });

    res.json({ success: true, data: ratesObject });
  } catch (error) {
    console.error('Get rates error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateRates = async (req, res) => {
  try {
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      await MaterialRate.findOneAndUpdate(
        { key },
        { value, label: getLabelForKey(key) },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, message: 'Rates updated successfully' });
  } catch (error) {
    console.error('Update rates error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

function getLabelForKey(key) {
  const labels = {
    'alu_color': 'Aluminum Color (Rs/kg)',
    'alu_silver': 'Aluminum Silver (Rs/kg)',
    'glass': 'Glass (Rs/sqft)',
    'glass_rubber': 'Glass Rubber (Rs/ft)',
    'mosquito_net': 'Mosquito Net (Rs/sqft)',

    'u_channel_screw_fixed': 'Hardware Base Cost (Corner/Lock Screws)',
    'u_channel_screw_rate': 'Hardware Linear Rate (Rs/ft of Perimeter)',

    'lock': 'Lock (Rs/unit)',
    'bearing': 'Bearings Set (Rs/window)',

    'labour_min': 'Labour Minimum (Rs)',
    'labour_sqft': 'Labour (Rs/sqft)'
  };
  return labels[key] || key;
}

module.exports = { getRates, updateRates };
