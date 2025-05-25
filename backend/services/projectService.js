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

// ------ project details ---------

export const editProjectDesc = async (projectId, newDesc) => {
    const query = `UPDATE projects SET project_description = ? WHERE project_id =?`
    const value = [newDesc, projectId]

    try{
        const[rows] = await pool.query(query, value);
        if(rows.length === 0){
            return {success: false, message: "No project Found!"}
        }
        return { success: true, message: 'Description changed succesfull' };
    }catch(err){
        return { success: false, message: "Failed to change projects", err };
    }
}

export const editProjectTechStack = async(projectId, stack) => {
    const query = `UPDATE projects SET tech_stack = ? WHERE project_id = ?`
    const newStack = JSON.stringify(stack);
    const value = [newStack, projectId]


    try{
        const[result] = await pool.query(query, value);
        if(result.affectedRows === 0) { 
            return{success: false, message: "No project found with the provided ID!"}
        }

        if (result.changedRows === 0) {
            return { success: true, message: "Tech stack was already up to date (no changes made)." };
        }
        return {success: true, message: 'TechStack changed succesful'}
    }catch(err){
        return { success: false, message: "Failed to change TechStack", err };
    }
}

export const editRoadmap = async(projectId, roadStack) => {
    const query = `UPDATE projects SET roadmap = ? WHERE project_id = ?`
    const stringRoadStack = JSON.stringify(roadStack);
    const value = [stringRoadStack, projectId]

    try{
        const [result] = await pool.query(query, value);
        if(result.affectedRows === 0){
            return {success: false, message: "No project found with the provided ID!"}
        }

        if(result.changedRows === 0){
            return { success: true, message: "Roadmap was already up to date (no changes made)." };
        }
        return {success: true, message: 'Roadmap changed succesful'}
    }catch(err){
        return { success: false, message: "Failed to change roadmap", err };
    }
}

export const createRoadmap = async(projectId, roadmapData) => {
    const { name, is_checked } = roadmapData;
    const insertQuery = `INSERT INTO roadmap_items (project_id, name, is_checked) VALUES (?, ?, ?);`;
    const insertValues = [projectId, name, is_checked];

    try {
        const [insertResult] = await pool.query(insertQuery, insertValues);

        if (insertResult.affectedRows === 1 && insertResult.insertId) {
            const newRoadmapId = insertResult.insertId;

            const selectQuery = `SELECT road_id, name, is_checked FROM roadmap_items WHERE road_id = ?;`;
            const [rows] = await pool.query(selectQuery, [newRoadmapId]);

            if (rows.length > 0) {
                const newRoadmapItem = {
                    road_id: rows[0].road_id,
                    name: rows[0].name,

                    is_checked: Boolean(rows[0].is_checked)
                };
                return { success: true, message: "Roadmap item created successfully", data: newRoadmapItem };
            } else {
                return { success: false, message: "Roadmap item created, but failed to retrieve details." };
            }

        } else {
            return { success: false, message: "Failed to insert roadmap item (no row affected or no ID)." };
        }

    } catch (error) {
        console.error("Database error in createRoadmap:", error); // Log the actual error for debugging
        return { success: false, message: "Failed to create roadmap item due to a server error.", error: error.message };
    }
};

export const deleteRoadmap = async(roadId) => {
    const query = `DELETE FROM roadmap_items WHERE road_id = ?`;
    const values = [roadId];

    try {
        const [result] = await pool.query(query, values);
        if (result.affectedRows === 0){
            return {success: false, message: "Roadmap does not exist or you dont have permission"}
        }
        return {success: true, message: "Roadmap deletion complete"}
    } catch (error) {
        return {success: false, message: "Failed to delete roadmap", error: error}
    }
}

export const getRoadmap = async(projectId) => {
    const query = `SELECT * FROM roadmap_items WHERE project_id = ?`;
    const value = [projectId];

    try {
        const [rows] = await pool.query(query, value);

        const formattedRows = rows.map( row => ({
            ...row,
            is_checked: Boolean(row.is_checked)
        }))


        if (formattedRows.length === 0) {
            return { success: false, message: "No Roadmap/s found" };
        }
        return { success: true, message: "Roadmap/s found", data: formattedRows };
    } catch (error) {
        return { success: false, message: "Failed to fetch projects", error: error };
    }
}

export const updateRoadmap = async(projectId, updateData) => {
    const query = `UPDATE roadmap_items SET is_checked = ? WHERE project_id = ? AND road_id = ?`
    const { road_id, is_checked} = updateData;
    const value = [is_checked, projectId, road_id];

    try {
        const [result] = await pool.query(query, value);
        if(result.affectedRows === 0){
            return {success: false, message: "No project found with the provided ID!"}
        }

        if(result.changedRows === 0){
            return { success: true, message: "Roadmap was already up to date (no changes made)." };
        }
        return {success: true, message: 'Roadmap changed succesful'}
    } catch (error) {
        return { success: false, message: "Failed to update projects", error: error };
    }
}