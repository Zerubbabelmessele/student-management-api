const { body } = require('express-validator');

const createStudentValidation = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .bail()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters'),

  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .bail()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('departmentId')
    .notEmpty()
    .withMessage('Department ID is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Department ID must be a positive integer'),
];

module.exports = {
  createStudentValidation,
};
