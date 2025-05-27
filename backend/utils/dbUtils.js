const { pool } = require("../config/database.js");


const userTableQuery=  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Add password field; using VARCHAR(255) for hashed passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );`

const postTableQuery = `CREATE TABLE IF NOT EXISTS projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_tag TEXT NOT NULL,
    project_description TEXT NOT NULL,
    project_status ENUM('Finished', 'in Development') DEFAULT 'in Development',
    project_link TEXT NOT NULL,
    tech_stack JSON,
    roadmap JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);`

const spendingTableQuery = `CREATE TABLE IF NOT EXISTS spending (
    user_id INT NOT NULL,
    spending_id INT AUTO_INCREMENT PRIMARY KEY,
    amount INT NOT NULL,
    merchant TEXT,
    date DATE NOT NULL,
    message_id VARCHAR(255) UNIQUE,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`

const roadmapTableQuery = `CREATE TABLE IF NOT EXISTS roadmap_items (
    project_id INT NOT NULL,
    road_id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    is_checked BOOLEAN NOT NULL DEFAULT 0,
    
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
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
        await createTable('project', postTableQuery)
        await createTable('Spending', spendingTableQuery)
        await createTable('project_roadmap', roadmapTableQuery)
        console.log("all tables are created")
    }catch(error){
        console.log("error creating all tables", error);
        throw error;
    }
}

export default createAllTable;