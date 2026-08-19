const express = require('express');

const router = express.Router();

const studentController = require('../controllers/student.controller');

const {
  createStudentValidation,
} = require('../validations/student.validation');

const validate = require('../middleware/validate');

const upload = require('../middleware/upload');

const { protect, authorize } = require('../middleware/auth');

router.post(
  '/',
  protect,
  authorize('admin', 'instructor'),
  upload.single('photo'),
  createStudentValidation,
  validate,
  studentController.create,
);
router.get('/', protect, studentController.getAll);
router.get('/:id', protect, studentController.getById);
router.put(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  studentController.update,
);
router.delete('/:id', protect, authorize('admin'), studentController.remove);

module.exports = router;
