import { pool } from "../config/database.js"

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