const express = require('express');
const router = express.Router();
const { createProjectController, deleteProjectController, getProjectsController } = require('../controllers/projectController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

router.post('/', authMiddleware ,createProjectController);
router.delete('/delete/:id', authMiddleware ,deleteProjectController);
router.get('/', authMiddleware ,getProjectsController); 

module.exports = router;