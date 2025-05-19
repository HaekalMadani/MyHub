const express = require('express');
const router = express.Router();
const { handleScanEmails } = require('../controllers/spendingController');
const { getSpendingData } =  require('../controllers/spendingController.js');

router.post('/scan-emails', handleScanEmails);
router.get('/spending', getSpendingData);
module.exports = router;
