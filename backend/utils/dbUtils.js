import { pool } from "../config/database.js"

const userTableQuery=  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Add password field; using VARCHAR(255) for hashed passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );`

const postTableQuery = `CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );`

const createTable = async(tableName, query)=>{
    try{

        await pool.query(query)
        console.log(`${tableName} table created or already exists`)
    }catch(error){
        console.log(`Error @ ${tableName}`, error)
    }
}

const createAllTable=async()=>{
    try{
        await createTable('users', userTableQuery)
        await createTable('posts', postTableQuery)
        console.log("all tables are created")
    }catch(error){
        console.log("error creating all tables", error);
        throw error;
    }
}

export default createAllTable;