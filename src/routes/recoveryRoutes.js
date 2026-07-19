const express = require('express');
const router = express.Router();
const recoveryController = require('../controllers/recoveryController');

router.patch('/:withdrawalId/status', recoveryController.updateWithdrawalStatus);
router.get('/user/:userId', recoveryController.getRecoveryHistoryByUser);

module.exports = router;
