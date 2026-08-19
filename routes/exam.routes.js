const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');
const { validateExam } = require('../validations/exam.validation');

const { protect, authorize } = require('../middleware/auth');

router.post(
  '/',
  protect,
  authorize('admin', 'instructor'),
  validateExam,
  examController.create,
);
router.get('/', protect, examController.getAll);
router.get('/:id', protect, examController.getById);
router.put(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  validateExam,
  examController.update,
);
router.delete(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  examController.remove,
);

module.exports = router;
