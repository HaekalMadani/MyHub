const { scanEmails } = require('../models/gmailModel');
const { getUserFromToken } = require('../services/authService.js');

async function handleScanEmails(req, res) {
  const { token } = req.body;
  try {
    const spending = await scanEmails(token);
    res.json(spending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to scan emails' });
  }
}

async function getSpendingData(req, res){
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const { success, data, message } = await getUserFromToken(token);
    if (!success) {
      return res.status(401).json({ success: false, message });
    }

    const spending = await scanEmails(data.id);
    res.json(spending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch spending data' });
  }
};

module.exports = { handleScanEmails, getSpendingData };
