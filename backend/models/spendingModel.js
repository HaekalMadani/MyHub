const { pool } = require('../config/database.js');


async function getSpendingFromDB(userId) {
  const [rows] = await pool.query('SELECT spending_id, date, amount, merchant FROM spending WHERE user_id = ?', [userId]);
  const spending = {};
  rows.forEach(row => {
    const date = row.date.toISOString().split('T')[0];
    if(!spending[date]){
      spending[date] = [];
    }
    spending[date].push({id: row.spending_id, amount: row.amount, merchant: row.merchant})
  });
  return spending;
}

module.exports = getSpendingFromDB