const express = require('express');
const router = express.Router();
const { getRates, updateRates } = require('../controllers/ratesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getRates);
router.put('/', authMiddleware, updateRates);

module.exports = router;
