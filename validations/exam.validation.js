const { body, validationResult } = require('express-validator');

const validateExam = [
  body('title').notEmpty().withMessage('Title is required'),
  body('courseId').isInt().withMessage('Valid courseId is required'),
  body('startTime').isISO8601().withMessage('startTime must be a valid date'),
  body('endTime')
    .isISO8601()
    .withMessage('endTime must be a valid date')
    .custom((endTime, { req }) => {
      if (new Date(endTime) <= new Date(req.body.startTime)) {
        throw new Error('endTime must be after startTime');
      }
      return true;
    }),
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

module.exports = { validateExam };
