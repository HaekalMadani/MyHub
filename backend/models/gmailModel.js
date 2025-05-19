import { google } from 'googleapis';
import { pool } from '../config/database.js';
import { decrypt } from '../utils/encryptionUtils.js'; // assumes your updated encrypt/decrypt helpers

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
    throw new Error('No Google refresh token found for this user.');
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

    if (amountMatch) {
      let amount = parseInt(amountMatch[1].replace(/,/g, ''), 10);
      const date = new Date(parseInt(email.data.internalDate)).toISOString().split('T')[0];

      if (!spending[date]) spending[date] = 0;
      spending[date] += amount;
    }
  }

  return spending;
}
