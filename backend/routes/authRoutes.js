const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, redirectToGoogle, handleGoogleCallback, unlinkGoogleAccount } = require('../controllers/authController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');
const {authenticateToken} = require('../middleware/authMiddleware.js');


router.post('/register-user', register);
router.post('/login-user', login);
router.post('/logout', logout);

router.get('/me',authMiddleware, getMe); 

router.get('/google', redirectToGoogle);
router.get('/google/callback', authMiddleware ,handleGoogleCallback);
router.post('/unlink-google', unlinkGoogleAccount);

module.exports = router;