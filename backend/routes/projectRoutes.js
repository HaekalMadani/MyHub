const express = require('express');
const router = express.Router();
const { createProjectController, deleteProjectController, getProjectsController, editProjectDescController, editProjectTechStackController, editRoadmapController } = require('../controllers/projectController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

router.post('/', authMiddleware ,createProjectController);
router.delete('/delete/:id', authMiddleware ,deleteProjectController);
router.get('/', authMiddleware ,getProjectsController); 
router.put('/:id/description', editProjectDescController)
router.put('/:id/techstack', editProjectTechStackController);
router.put('/:id/roadmap', editRoadmapController)

module.exports = router;