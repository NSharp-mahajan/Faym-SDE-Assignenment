const { body } = require('express-validator');

exports.createUserValidator = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
];
