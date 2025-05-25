const express = require('express');
const router = express.Router();
const { createProjectController, deleteProjectController, getProjectsController, editProjectDescController, editProjectTechStackController, editRoadmapController, createRoadmapController } = require('../controllers/projectController.js');
const { deleteRoadmapController, getRoadmapController, updateRoadmapController } = require('../controllers/projectController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

router.post('/', authMiddleware ,createProjectController);
router.delete('/delete/:id', authMiddleware ,deleteProjectController);
router.get('/', authMiddleware ,getProjectsController); 

router.put('/:id/description', editProjectDescController);

router.put('/:id/techstack', editProjectTechStackController);

router.post('/:id/roadmap', createRoadmapController)
router.delete('/:id/roadmap', deleteRoadmapController)
router.get('/:id/roadmap', getRoadmapController)
router.put('/:id/roadmap' ,updateRoadmapController)

module.exports = router;