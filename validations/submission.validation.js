const { body, validationResult } = require('express-validator');

const validateSubmission = [
  body('assignmentId').isInt().withMessage('Valid assignmentId is required'),
  body('studentId').isInt().withMessage('Valid studentId is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateSubmission };
