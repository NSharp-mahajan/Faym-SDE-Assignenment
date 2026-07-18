const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');
const { createWithdrawalValidator } = require('../validators/withdrawalValidator');
const validate = require('../middleware/validate');

// Route mapping for Withdrawals
router.post('/', createWithdrawalValidator, validate, withdrawalController.withdraw);
router.get('/:userId', withdrawalController.getUserWithdrawals);

module.exports = router;
