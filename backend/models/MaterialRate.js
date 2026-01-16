const mongoose = require('mongoose');

const materialRateSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MaterialRate', materialRateSchema);
