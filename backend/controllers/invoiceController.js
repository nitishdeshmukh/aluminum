const Invoice = require('../models/Invoice');

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({})
      .sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createInvoice = async (req, res) => {
  try {
    // Relaxed validation
    const {
      customerName,
      width,
      height,
      totalAmount,
      breakdown,
      customItems,
      customerPhone,
      customerAddress
    } = req.body;

    if (!customerName || !width || !height || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Name, Dimensions, and Total Amount are required'
      });
    }

    const invoice = new Invoice({
      customerName,
      customerPhone: customerPhone || '',
      customerAddress: customerAddress || '',
      productName: '3-Track Custom Window', // Default for calculator
      width,
      height,
      quantity: 1,
      totalAmount,
      breakdown,
      customItems: customItems || []
    });

    await invoice.save();

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await Invoice.findByIdAndDelete(id);
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getInvoices, getInvoice, createInvoice, deleteInvoice };
