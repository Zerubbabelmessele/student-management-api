const { body } = require('express-validator');

const createEnrollmentValidation = [
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required')
    .bail()
    .isInt()
    .withMessage('Student ID must be an integer'),

  body('courseId')
    .notEmpty()
    .withMessage('Course ID is required')
    .bail()
    .isInt()
    .withMessage('Course ID must be an integer'),
];

module.exports = {
  createEnrollmentValidation,
};
