const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { validateAttendance } = require('../validations/attendance.validation');

const { protect, authorize } = require('../middleware/auth');

router.post(
  '/',
  protect,
  authorize('admin', 'instructor'),
  validateAttendance,
  attendanceController.create,
);
router.get('/', protect, attendanceController.getAll);
router.get('/:id', protect, attendanceController.getById);
router.put(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  validateAttendance,
  attendanceController.update,
);
router.delete('/:id', protect, authorize('admin'), attendanceController.remove);

module.exports = router;
