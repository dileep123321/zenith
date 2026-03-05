import express from 'express';
import auth from '../middleware/auth';
import validate from '../middleware/validate';
import projectValidator from '../validators/project.validator';
import projectController from '../controllers/project.controller';

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(projectValidator.createProject), projectController.createProject)
    .get(auth(), validate(projectValidator.getProjects), projectController.getProjects);

router
    .route('/:projectId')
    .get(auth(), validate(projectValidator.getProject), projectController.getProject)
    .patch(auth(), validate(projectValidator.updateProject), projectController.updateProject)
    .delete(auth(), validate(projectValidator.deleteProject), projectController.deleteProject);

export default router;
