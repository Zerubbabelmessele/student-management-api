const { body } = require('express-validator');

const createDepartmentValidation = [
  body('name')
    .notEmpty()
    .withMessage('Department name is required')
    .bail()
    .isLength({ min: 2 })
    .withMessage('Department name must be at least 2 characters'),

  body('code')
    .notEmpty()
    .withMessage('Department code is required')
    .bail()
    .isLength({ min: 2, max: 10 })
    .withMessage('Department code must be between 2 and 10 characters'),
];

module.exports = {
  createDepartmentValidation,
};
