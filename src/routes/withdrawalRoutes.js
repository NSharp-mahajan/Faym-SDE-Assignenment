const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');

router.post('/', withdrawalController.createWithdrawal);
router.get('/:id', withdrawalController.getWithdrawalById);

module.exports = router;
