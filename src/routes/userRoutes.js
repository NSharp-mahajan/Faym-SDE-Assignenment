const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { createUserValidator } = require('../validators/userValidator');
const validate = require('../middleware/validate');

// Route mapping for Users
router.post('/', createUserValidator, validate, userController.createUser);
router.get('/:id', userController.getUser);

module.exports = router;
