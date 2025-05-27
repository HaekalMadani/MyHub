const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit:10,
    queueLimit: 0,
    waitForConnections: true,
    connectTimeout: 10000
});

const checkConnection=async()=>{
    try {
        const connection = await pool.getConnection();
        console.log("connection database successful");
        connection.release();
    }catch(error){
        console.log("connection database failed");
        throw error;
    }
}

export {pool, checkConnection}