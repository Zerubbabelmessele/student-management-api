// routes/payment.routes.js
const express = require('express');
const router = express.Router();
const { initializePayment } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth');

router.post('/invoices/:id/pay', protect, initializePayment);

module.exports = router;
