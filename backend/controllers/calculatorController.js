const { calculateWindowPrice } = require('../utils/calculations');
const MaterialRate = require('../models/MaterialRate');

const calculate = async (req, res) => {
  try {
    const { width, height, finishType, selectedItems } = req.body;

    if (!width || !height || !finishType || !selectedItems) {
      return res.status(400).json({ 
        success: false, 
        message: 'Width, height, finishType, and selectedItems are required' 
      });
    }

    if (width <= 0 || height <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Width and height must be positive numbers' 
      });
    }

    const rates = await MaterialRate.find({});
    const ratesObject = {};
    
    rates.forEach(rate => {
      ratesObject[rate.key] = rate.value;
    });

    const result = calculateWindowPrice(width, height, finishType, ratesObject, selectedItems);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Calculate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { calculate };
