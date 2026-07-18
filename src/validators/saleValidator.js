const { body } = require('express-validator');

exports.createSaleValidator = [
  body('userId').isMongoId().withMessage('A valid userId is required'),
  body('earnings').isFloat({ min: 0 }).withMessage('Earnings must be greater than or equal to 0'),
];

exports.reconcileSaleValidator = [
  body('status').isIn(['Approved', 'Rejected']).withMessage('Status must be Approved or Rejected'),
];
