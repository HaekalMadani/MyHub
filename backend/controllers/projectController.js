import { createProject, deleteProject, getProjects } from "../services/projectService.js";

export const createProjectController = async (req, res) => {
    const userId = req.user.id; 
    const projectData = req.body; // Assuming projectData is coming from the request body

    try {
        const response = await createProject(userId, projectData);
        if (response.success) {
            return res.status(201).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Caught unexpected error in createProjectController:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred while creating the project" });
    }
}

export const deleteProjectController = async (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id; 

    try{
        const response = await deleteProject(userId, projectId);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    }catch (error) {
        console.error("Caught unexpected error in deleteProjectController:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred while deleting the project" });
    }
}

export const getProjectsController = async (req, res) => {
    const userId = req.user.id; // Assuming userId is coming from the request object

    try {
        const response = await getProjects(userId);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Caught unexpected error in getProjectsController:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred while fetching projects" });
    }
}