const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

async function scanEmails(accessToken) {
  const auth = new google.auth.OAuth2(
    '920552388273-3mpplef4rn62argnl485o7bostdvhrgm.apps.googleusercontent.com',
    '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',
    'http://localhost:5173'
  );
  
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth });

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'subject:"Sony Bank"',
    maxResults: 50,
  });

  if (!res.data.messages) return {};

  const spending = {};

  for (const msg of res.data.messages) {
    const email = await gmail.users.messages.get({ userId: 'me', id: msg.id });
    const payload = email.data.payload;

    const text = extractBody(payload);
    const amountMatch = text.match(/(\d{1,3}(,\d{3})*|\d+)\s*円/);
    if (amountMatch) {
      let amount = parseInt(amountMatch[1].replace(/,/g, ''), 10);
      const date = new Date(parseInt(email.data.internalDate)).toISOString().split('T')[0];

      if (!spending[date]) spending[date] = 0;
      spending[date] += amount;
    }
  }

  return spending;
}

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

app.post('/scan-emails', async (req, res) => {
  const { token } = req.body;
  const spending = await scanEmails(token);
  res.json(spending);
});

app.listen(4000, () => console.log('Backend server running on http://localhost:4000'));
