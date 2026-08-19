const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { validateInvoice } = require('../validations/invoice.validation');
const { protect, authorize } = require('../middleware/auth');

router.post(
  '/',
  protect,
  authorize('admin'),
  validateInvoice,
  invoiceController.create,
);
router.get('/', protect, invoiceController.getAll);
router.get('/:id', protect, invoiceController.getById);
router.put('/:id', protect, authorize('admin'), invoiceController.update);
router.delete('/:id', protect, authorize('admin'), invoiceController.remove);

module.exports = router;
