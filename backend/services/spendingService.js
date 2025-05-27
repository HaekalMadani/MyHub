const { pool } = require("../config/database.js");


export const getGoogleRefeshToken = async (userId) => {
    const query = 'SELECT * FROM users WHERE id = ?'
    const value = [userId]

    try{
        const [rows] = await pool.query(query, value);
        if(rows.length === 0){
            return {success: false, message: 'User not found!'}
        }

        const user = rows[0];

        if (user.google_refresh_token === null) {
            return { success: false, message: 'Refresh Token is NOT Present!' };
        } else {
            return { success: true, message: 'Refresh Token Present!' };
        }
    }catch(error){
        console.log ("Something wrong in checking google refesh token existence: ", error)
    }
}

export const addSpending = async(userId, spendingData) => {
    const query = 'INSERT INTO spending (user_id, amount, merchant, date) VALUES (? , ? , ? , ?)'
    const {amount, merchant, date} = spendingData
    const values = [ userId, amount, merchant, date ]

    try {
        const [result] = await pool.query(query, values);
        return {success: true, message: 'Spending Entry Added', spendingId: result.insertId}
    } catch (error) {
        return {success: false, message: 'Spending Entry Failed to add', error: error}
    }
}

export const deleteSpending = async(userId, spendingId) => {
    const query = 'DELETE FROM spending WHERE user_id = ? AND spending_id = ?'
    const values = [userId, spendingId]

    try {
        const [result] = await pool.query(query, values);
        return {success: true, message: 'Spending Entry Deleted', spendingId: result.insertId}
    } catch (error) {
        return {success: false, message: 'Spending Entry Failed to delete', error: error}
    }
}