const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', authController.register); // public, always instructor
router.post('/login', authController.login);
router.post(
  '/create-admin',
  protect,
  authorize('admin'),
  authController.createAdmin,
); // admin-only

module.exports = router;
