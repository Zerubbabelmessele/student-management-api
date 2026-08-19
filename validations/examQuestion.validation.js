const { body, validationResult } = require('express-validator');

const validateExamQuestion = [
  body('examId').isInt().withMessage('Valid examId is required'),
  body('question').notEmpty().withMessage('Question text is required'),
  body('optionA').notEmpty().withMessage('optionA is required'),
  body('optionB').notEmpty().withMessage('optionB is required'),
  body('optionC').notEmpty().withMessage('optionC is required'),
  body('optionD').notEmpty().withMessage('optionD is required'),
  body('marks')
    .isInt({ min: 1 })
    .withMessage('marks must be a positive integer'),

  body('correctAnswer')
    .notEmpty()
    .withMessage('correctAnswer is required')
    .custom((value, { req }) => {
      const validOptions = [
        req.body.optionA,
        req.body.optionB,
        req.body.optionC,
        req.body.optionD,
      ];
      if (!validOptions.includes(value)) {
        throw new Error(
          'correctAnswer must match one of optionA, optionB, optionC, or optionD',
        );
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateExamQuestion };
