const { google } = require('googleapis');
const { pool } = require('../config/database.js');
const { decrypt } = require('../utils/encryptionUtils.js');
const { toHalfWidth } = require('../utils/extraUtils.js');
const { AuthError } = require('../error/authError.js');


function extractBody(payload) {
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain') {
        return Buffer.from(part.body.data, 'base64').toString('utf8');
      }
    }
  } else if (payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf8');
  }
  return '';
}

export async function scanEmails(userId) {
  // 1. Get user's refresh token from DB
  const [[user]] = await pool.query('SELECT google_refresh_token FROM users WHERE id = ?', [userId]);
  if (!user || !user.google_refresh_token) {
    // If no token exists at all
    throw new AuthError('No Google refresh token found for this user.', 'NO_REFRESH_TOKEN');
  }

  // 2. Decrypt only if format looks encrypted (has colon)
  let refreshToken;
  const token = user.google_refresh_token;

  if (token.includes(':')) {
    console.log('Decrypting token...');
    refreshToken = decrypt(token);
  } else {
    console.log('Token is already plaintext.');
    refreshToken = token;
  }

  // 3. Initialize OAuth2 client
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  auth.setCredentials({ refresh_token: refreshToken });

  const gmail = google.gmail({ version: 'v1', auth });

  try {
    // 4. Search emails with subject "Sony Bank"
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'subject:"Sony Bank"',
      maxResults: 50,
    });

    if (!res.data.messages) return {};

    const spending = {};

    // 5. Loop through and parse emails
    for (const msg of res.data.messages) {
      const email = await gmail.users.messages.get({ userId: 'me', id: msg.id });
      const text = extractBody(email.data.payload);
      const amountMatch = text.match(/(\d{1,3}(,\d{3})*|\d+)\s*(円|Yen)/);
      const merchantMatch = text.match(/Merchant:\s*(.+)/i);
      const emailId = msg.id;

      if (amountMatch) {
        let amount = parseInt(amountMatch[1].replace(/,/g, ''), 10);
        const date = new Date(parseInt(email.data.internalDate)).toISOString().split('T')[0];

        let merchant = 'Unknown';
        if (merchantMatch) {
          const fullMerchant = toHalfWidth(merchantMatch[1].trim());
          merchant = fullMerchant.split(' ')[0];
        }

        if (!spending[date]) {
          spending[date] = { amount: 0, merchant: merchant };
        }
        spending[date].amount += amount;

        try {
          await pool.query(
            'INSERT INTO spending (user_id, amount, merchant, date, message_id) VALUES (?, ?, ?, ?, ?)',
            [userId, amount, merchant, date, emailId]
          );
        } catch (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            continue;
          } else {
            throw err;
          }
        }
      }
    }

    return spending;
  } catch (err) {
    console.error('Error scanning emails:', err);
    // Check for GaxiosError specifically
    if (err.response && err.response.data && err.response.data.error === 'invalid_grant' && err.response.data.error_description === 'Token has been expired or revoked.') {
      // **Crucial: Clear the invalid token from the database**
      // This prevents repeated attempts with the same invalid token.
      await pool.query('UPDATE users SET google_refresh_token = NULL WHERE id = ?', [userId]);

      throw new AuthError('Google refresh token invalid or revoked. User needs to re-authenticate.', 'GOOGLE_AUTH_REQUIRED');
    } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
        // Handle network errors if Google's API can't be reached
        throw new AuthError('Could not connect to Google services. Please check your internet connection or try again later.', 'NETWORK_ERROR');
    }
    // Re-throw any other unexpected errors
    throw err;
  }
}