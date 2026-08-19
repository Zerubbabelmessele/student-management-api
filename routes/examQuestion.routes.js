const express = require('express');
const router = express.Router();
const examQuestionController = require('../controllers/examQuestion.controller');
const {
  validateExamQuestion,
} = require('../validations/examQuestion.validation');

const { protect, authorize } = require('../middleware/auth');

router.post(
  '/',
  protect,
  authorize('admin', 'instructor'),
  validateExamQuestion,
  examQuestionController.create,
);
router.get('/', protect, examQuestionController.getAll);
router.get('/:id', protect, examQuestionController.getById);
router.put(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  validateExamQuestion,
  examQuestionController.update,
);
router.delete(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  examQuestionController.remove,
);
module.exports = router;
