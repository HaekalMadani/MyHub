const express = require('express');
const router = express.Router();
const { handleScanEmails } = require('../controllers/spendingController');

router.post('/scan-emails', handleScanEmails);

module.exports = router;
