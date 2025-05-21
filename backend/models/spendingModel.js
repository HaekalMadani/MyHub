import { pool } from '../config/database.js';

export async function getSpendingFromDB(userId) {
  const [rows] = await pool.query('SELECT date, amount, merchant FROM spending WHERE user_id = ?', [userId]);
  const spending = {};
  rows.forEach(row => {
    const date = row.date.toISOString().split('T')[0];
    if(!spending[date]){
      spending[date] = [];
    }
    spending[date].push({ amount: row.amount, merchant: row.merchant})
  });
  return spending;
}
