const express = require('express');

const router = express.Router();

const departmentController = require('../controllers/department.controller');

const validate = require('../middleware/validate');

const {
  createDepartmentValidation,
} = require('../validations/department.validation');

const { protect, authorize } = require('../middleware/auth');

router.post(
  '/',
  protect,
  authorize('admin'),
  createDepartmentValidation,
  validate,
  departmentController.create,
);

router.get('/', protect, departmentController.getAll);

router.get('/:id', protect, departmentController.getById);

router.put('/:id', protect, authorize('admin'), departmentController.update);

router.delete('/:id', protect, authorize('admin'), departmentController.remove);

module.exports = router;
