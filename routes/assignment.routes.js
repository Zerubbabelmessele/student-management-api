const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const { validateAssignment } = require('../validations/assignment.validation');

const { protect, authorize } = require('../middleware/auth');

router.post(
  '/',
  protect,
  authorize('admin', 'instructor'),
  validateAssignment,
  assignmentController.create,
);
router.get('/', protect, assignmentController.getAll);
router.get('/:id', protect, assignmentController.getById);
router.put(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  validateAssignment,
  assignmentController.update,
);
router.delete(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  assignmentController.remove,
);

module.exports = router;
