const express = require('express');

const router = express.Router();

const courseController = require('../controllers/course.controller');

const validate = require('../middleware/validate');

const { createCourseValidation } = require('../validations/course.validation');

const { protect, authorize } = require('../middleware/auth');

router.post(
  '/',
  protect,
  authorize('admin'),
  createCourseValidation,
  validate,
  courseController.create,
);
router.get('/', protect, courseController.getAll);
router.get('/:id', protect, courseController.getById);
router.put('/:id', protect, authorize('admin'), courseController.update);
router.delete('/:id', protect, authorize('admin'), courseController.remove);

module.exports = router;
