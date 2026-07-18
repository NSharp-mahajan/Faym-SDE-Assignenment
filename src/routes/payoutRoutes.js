const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payoutController');

// Route mapping for Payouts
router.post('/advance', payoutController.runAdvancePayout);
router.get('/user/:userId', payoutController.getUserPayouts);
router.get('/:id', payoutController.getPayoutById);

module.exports = router;
