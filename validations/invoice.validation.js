const { body, validationResult } = require('express-validator');

const validateInvoice = [
  body('studentId').isInt().withMessage('Valid studentId is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('amount must be a positive number'),
  body('dueDate').isISO8601().withMessage('dueDate must be a valid date'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateInvoice };
