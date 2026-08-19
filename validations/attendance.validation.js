const { body, validationResult } = require('express-validator');

const validateAttendance = [
  body('studentId').isInt().withMessage('Valid studentId is required'),
  body('courseId').isInt().withMessage('Valid courseId is required'),
  body('date').isISO8601().withMessage('date must be a valid date'),
  body('status')
    .isIn(['present', 'absent', 'late'])
    .withMessage('status must be present, absent, or late'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateAttendance };
