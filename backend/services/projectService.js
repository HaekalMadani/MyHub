import { pool } from "../config/database.js"

export const createProject = async(userId, projectData) => {
    const { projectName, projectDescription, projectTag, projectStatus, projectLinks} = projectData;
    const query = `INSERT INTO projects (user_id, project_name, project_description, project_tag, project_status, project_link) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [userId, projectName, projectDescription, projectTag, projectStatus, projectLinks];
    
    try{
        const [result] = await pool.query(query, values);
        return { success: true, message: "Project created successfully", projectId: result.insertId };
    }catch (error) {
        console.error("Error creating project:", error);
        return { success: false, message: "Failed to create project", error: error };
    }
    
}

export const deleteProject = async (userId, projectId) => {
    const query = `DELETE FROM projects WHERE user_id = ? AND project_id = ?`;
    const values = [userId, projectId];
   
    try{
        const [result] = await pool.query(query, values);
        if (result.affectedRows === 0) {
            return { success: false, message: "Project not found or you do not have permission to delete it" };
        }
        return { success: true, message: "Project deleted successfully" };
    }catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, message: "Failed to delete project", error: error };
    }
}

export const getProjects = async (userId) => {
    const query = `SELECT * FROM projects WHERE user_id =?`;
    const value = [userId];

    try{
        const [rows] = await pool.query(query, value);
        if (rows.length === 0) {
            return { success: false, message: "No projects found" };
        }
        return { success: true, data: rows };
    }catch (error) {
        console.error("Error fetching projects:", error);
        return { success: false, message: "Failed to fetch projects", error: error };
    }
}