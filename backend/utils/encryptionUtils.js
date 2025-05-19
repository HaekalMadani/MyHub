import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ENCRYPTION_KEY = Buffer.from(process.env.REFRESH_TOKEN_SECRET, 'hex'); // 32 bytes for aes-256
const IV_LENGTH = 16; // AES block size

export function encrypt(text) {
    if (typeof text !== 'string' || !text.trim()) {
      console.error('encrypt() received invalid text:', text);
      throw new Error('Text to encrypt must be a non-empty string.');
    }
  
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }
  

  export function decrypt(text) {
    if (typeof text !== 'string' || !text.includes(':')) {
      console.error('decrypt() received invalid text:', text);
      throw new Error('Encrypted text is not in the expected "iv:encrypted" format.');
    }
  
    const [ivHex, encryptedData] = text.split(':');
    if (!ivHex || !encryptedData) {
      console.error('decrypt() split failed. ivHex:', ivHex, 'encryptedData:', encryptedData);
      throw new Error('Invalid encrypted data format.');
    }
  
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedData, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'binary', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }