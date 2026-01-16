const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true,
    default: ''
  },
  customerAddress: {
    type: String,
    trim: true,
    default: ''
  },
  // We make productId optional because this might be a custom calculation
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  productName: {
    type: String,
    required: true,
    default: 'Custom Estimate'
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  // Flattened total
  totalAmount: {
    type: Number,
    required: true
  },
  // Store the full calculation breakdown (JSON)
  breakdown: {
    type: Object,
    required: false
  },
  customItems: {
    type: Array, // For the extra charges/discounts
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
