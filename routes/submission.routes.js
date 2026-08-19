const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const uploadSubmission = require('../middleware/uploadSubmission');
const { validateSubmission } = require('../validations/submission.validation');

const { protect, authorize } = require('../middleware/auth');

router.post(
  '/',
  protect,
  authorize('admin', 'instructor'),
  uploadSubmission.single('file'),
  validateSubmission,
  submissionController.create,
);
router.get('/', protect, submissionController.getAll);
router.get('/:id', protect, submissionController.getById);
router.put(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  submissionController.update,
);
router.delete('/:id', protect, authorize('admin'), submissionController.remove);

module.exports = router;
