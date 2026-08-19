const { body, validationResult } = require('express-validator');

const validateAssignment = [
  body('title').notEmpty().withMessage('Title is required'),
  body('courseId').isInt().withMessage('Valid courseId is required'),
  body('dueDate').isISO8601().withMessage('dueDate must be a valid date'),
  body('totalMarks')
    .isInt({ min: 1 })
    .withMessage('totalMarks must be a positive integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateAssignment };
