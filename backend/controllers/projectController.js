const {
  createProject,
  deleteProject,
  getProjects,
  editProjectDesc,
  editProjectTechStack,
  editRoadmap,
  createRoadmap,
  deleteRoadmap,
  getRoadmap,
  updateRoadmap
} = require("../services/projectService.js");


const createProjectController = async (req, res) => {
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

const deleteProjectController = async (req, res) => {
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

const getProjectsController = async (req, res) => {
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

const editProjectDescController = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    try{
        const response = await editProjectDesc(id, description);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    }catch(err){
        console.error("Caught unexpected error in editdescController:", err);
        return res.status(500).json({ success: false, message: "An internal server error occurred while changing description" });
    }
}

const editProjectTechStackController = async (req, res) => {
    const { id } = req.params;
    const { newStack } = req.body;

    try{
        const response = await editProjectTechStack(id, newStack);
        if(response.success){
            return res.status(200).json(response);
        }else {
            return res.status(400).json(response);
        }
    }catch(err){
        console.error("Caught unexpected error in editTechStackController:", err);
        return res.status(500).json({ success: false, message: "An internal server error occurred while changing Tech Stack" });
    }
}

const editRoadmapController = async (req, res) => {
    const {id} = req.params;
    const { roadmap } = req.body;

    try{
        const response = await editRoadmap(id, roadmap)
        if(response.success){
            return res.status(200).json(response);
        }else{
            return res.status(400).json(response);
        }
    }catch(err){
        console.error("Caught unexpected error in editRoadmapController:", err);
        return res.status(500).json({ success: false, message: "An internal server error occurred while changing Roadmap" });
    }
}

const createRoadmapController = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try{
        const response = await createRoadmap(id, data)
        if(response.success){
            return res.status(200).json(response);
        }else{
            return res.status(400).json(response);
        }
    }catch(err){
        console.error("Caught unexpected error in createRoadmapController:", err);
        return res.status(500).json({ success: false, message: "An internal server error occurred while creating Roadmap" });
    }
}

const deleteRoadmapController = async(req, res) => {
    const { id } = req.params;


    try {
        const response = await deleteRoadmap(id);
        if(response.success){
            return res.status(200).json(response);
        }else{
            return res.status(400).json(response);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "An internal server error occurred while deleting Roadmap" });
    }
}

const getRoadmapController = async(req, res) => {
    const { id } = req.params;

    try {
        const response = await getRoadmap(id)
        if(response.success){
            return res.status(200).json(response);
        }else{
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Caught unexpected error in getroadmapController:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred while getting Roadmap", error: error });
    }
}

const updateRoadmapController = async(req, res) => {
    const data = req.body;
    const { id } = req.params;

    try {
        const response = await updateRoadmap(id, data)
        if(response.success){
            return res.status(200).json(response);
        }else{
            return res.status(400).json(response);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "An internal server error occurred while updating Roadmap", error: error });
    }

}

module.exports = {createProjectController, deleteProjectController, getProjectsController, editProjectDescController, editProjectTechStackController, editRoadmapController, createRoadmapController, deleteRoadmapController, getRoadmapController, updateRoadmapController}