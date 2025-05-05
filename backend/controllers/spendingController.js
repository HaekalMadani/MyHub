const { scanEmails } = require('../models/gmailModel');

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

module.exports = { handleScanEmails };
