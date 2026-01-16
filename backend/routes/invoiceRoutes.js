const express = require('express');
const router = express.Router();
const { getInvoices, getInvoice, createInvoice } = require('../controllers/invoiceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getInvoices);
router.get('/:id', authMiddleware, getInvoice);
router.post('/', authMiddleware, createInvoice);

module.exports = router;
