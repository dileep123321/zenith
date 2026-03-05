import httpStatus from 'http-status';
import Project, { IProject } from '../models/project.model';
import ApiError from '../utils/ApiError';

/**
 * Create a project
 * @param {Object} projectBody
 * @returns {Promise<IProject>}
 */
export const createProject = async (projectBody: any): Promise<IProject> => {
    return Project.create(projectBody);
};

/**
 * Query for projects
 * @param {Object} filter - Mongo filter
 * @returns {Promise<IProject[]>}
 */
export const queryProjects = async (filter: any): Promise<IProject[]> => {
    return Project.find(filter);
};

/**
 * Get project by id
 * @param {string} id
 * @returns {Promise<IProject | null>}
 */
export const getProjectById = async (id: string): Promise<IProject | null> => {
    return Project.findById(id);
};

/**
 * Update project by id
 * @param {string} projectId
 * @param {Object} updateBody
 * @param {string} userId - To verify ownership
 * @returns {Promise<IProject | null>}
 */
export const updateProjectById = async (projectId: string, updateBody: any, userId: string): Promise<IProject | null> => {
    const project = await getProjectById(projectId);
    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }
    if (project.ownerId.toString() !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update this project');
    }
    Object.assign(project, updateBody);
    await project.save();
    return project;
};

/**
 * Delete project by id
 * @param {string} projectId
 * @param {string} userId - To verify ownership
 * @returns {Promise<IProject | null>}
 */
export const deleteProjectById = async (projectId: string, userId: string): Promise<IProject | null> => {
    const project = await getProjectById(projectId);
    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }
    if (project.ownerId.toString() !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this project');
    }
    await project.deleteOne();
    return project;
};
