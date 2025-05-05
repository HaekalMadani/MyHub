const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

router.post('/register-user', register);
router.post('/login-user', login);
router.post('/logout', logout);

router.get('/me',authMiddleware, getMe); // CREATE MIDDLEWARE AUTH LATER and replace auth wit it

module.exports = router;