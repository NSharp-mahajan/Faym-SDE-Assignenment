const { body } = require('express-validator');

exports.createWithdrawalValidator = [
  body('userId').isMongoId().withMessage('A valid userId is required'),
];
