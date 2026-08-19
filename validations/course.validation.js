const { body } = require('express-validator');

const createCourseValidation = [
  body('title')
    .notEmpty()
    .withMessage('Course title is required')
    .bail()
    .isLength({ min: 2 })
    .withMessage('Course title must be at least 2 characters'),

  body('code')
    .notEmpty()
    .withMessage('Course code is required')
    .bail()
    .isLength({ min: 2, max: 10 })
    .withMessage('Course code must be between 2 and 10 characters'),

  body('departmentId')
    .notEmpty()
    .withMessage('Department ID is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Department ID must be a positive integer'),
];

module.exports = {
  createCourseValidation,
};
