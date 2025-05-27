const express = require('express');
const router = express.Router();
const { handleScanEmails } = require('../controllers/spendingController');
const { getSpendingData, checkGoogleRefreshToken, addSpendingController, deleteSpendingController } =  require('../controllers/spendingController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

router.post('/scan-emails', handleScanEmails);
router.get('/spending', getSpendingData);
router.get('/spending/check', authMiddleware, checkGoogleRefreshToken)

router.post('/spending', authMiddleware ,addSpendingController);
router.delete('/spending/delete-by-date-index/:id', authMiddleware, deleteSpendingController);
module.exports = router;
