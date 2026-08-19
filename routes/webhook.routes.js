const express = require('express');
const router = express.Router();
const { handleChapaWebhook } = require('../controllers/webhook.controller');

// No protect middleware — Chapa calls this directly, not a logged-in user
router.post('/chapa', handleChapaWebhook);

module.exports = router;
