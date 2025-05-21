const { scanEmails } = require('../models/gmailModel');
const { getUserFromToken } = require('../services/authService.js');
const { getSpendingFromDB} = require('../models/spendingModel.js')
const { getGoogleRefeshToken } = require('../services/spendingService.js')

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

    const spending = await getSpendingFromDB(data.id);
    res.json(spending);

    scanEmails(data.id)
    .then(() => console.log('Background Gmail scan completed'))
    .catch(err => console.error('Error scanning Gmail in background:', err));
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch spending data' });
  }
};

async function checkGoogleRefreshToken(req, res) {
  const userId = req.user.id;
  try{
    const response = await getGoogleRefeshToken(userId)
    if(response.success){
      return res.status(200).json(response);
    }else
      return res.status(400).json(response);

  }catch(error){
    console.log(error)
    return res.status(500).json({ success: false, message: "An internal server error occurred while fetching Google Refresh Token" });
  }
}

module.exports = { handleScanEmails, getSpendingData, checkGoogleRefreshToken };
