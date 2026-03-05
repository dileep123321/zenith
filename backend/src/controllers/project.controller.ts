import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as projectService from '../services/project.service';
import ApiError from '../utils/ApiError';

const createProject = catchAsync(async (req: Request, res: Response) => {
    const projectBody = {
        ...req.body,
        ownerId: (req as any).user.id,
    };
    const project = await projectService.createProject(projectBody);
    res.status(httpStatus.CREATED).send(project);
});

const getProjects = catchAsync(async (req: Request, res: Response) => {
    const filter = { ownerId: (req as any).user.id };
    if (req.query.status) {
        (filter as any).status = req.query.status as string;
    }
    const result = await projectService.queryProjects(filter);
    res.send(result);
});

const getProject = catchAsync(async (req: Request, res: Response) => {
    const project = await projectService.getProjectById(req.params.projectId as string);
    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }
    if (project.ownerId.toString() !== (req as any).user.id) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
    res.send(project);
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
    const project = await projectService.updateProjectById(req.params.projectId as string, req.body, (req as any).user.id);
    res.send(project);
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
    await projectService.deleteProjectById(req.params.projectId as string, (req as any).user.id);
    res.status(httpStatus.NO_CONTENT).send();
});

export default {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};
