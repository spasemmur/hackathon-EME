const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// На самом деле путь будет /api/auth/register
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;