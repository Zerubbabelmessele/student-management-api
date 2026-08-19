const express = require('express');

const router = express.Router();

const enrollmentController = require('../controllers/enrollment.controller');

const {
  createEnrollmentValidation,
} = require('../validations/enrollment.validation');

const validate = require('../middleware/validate');

const { protect, authorize } = require('../middleware/auth');

router.post(
  '/',
  protect,
  authorize('admin', 'instructor'),
  createEnrollmentValidation,
  validate,
  enrollmentController.create,
);

router.post(
  '/with-invoice',
  protect,
  authorize('admin', 'instructor'),
  enrollmentController.enrollWithInvoice,
);

router.get('/', protect, enrollmentController.getAll);
router.get('/:id', protect, enrollmentController.getById);
router.put(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  enrollmentController.update,
);
router.delete('/:id', protect, authorize('admin'), enrollmentController.remove);

module.exports = router;
