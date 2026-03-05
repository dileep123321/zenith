"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectById = exports.updateProjectById = exports.getProjectById = exports.queryProjects = exports.createProject = void 0;
const http_status_1 = __importDefault(require("http-status"));
const project_model_1 = __importDefault(require("../models/project.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Create a project
 * @param {Object} projectBody
 * @returns {Promise<IProject>}
 */
const createProject = async (projectBody) => {
    return project_model_1.default.create(projectBody);
};
exports.createProject = createProject;
/**
 * Query for projects
 * @param {Object} filter - Mongo filter
 * @returns {Promise<IProject[]>}
 */
const queryProjects = async (filter) => {
    return project_model_1.default.find(filter);
};
exports.queryProjects = queryProjects;
/**
 * Get project by id
 * @param {string} id
 * @returns {Promise<IProject | null>}
 */
const getProjectById = async (id) => {
    return project_model_1.default.findById(id);
};
exports.getProjectById = getProjectById;
/**
 * Update project by id
 * @param {string} projectId
 * @param {Object} updateBody
 * @param {string} userId - To verify ownership
 * @returns {Promise<IProject | null>}
 */
const updateProjectById = async (projectId, updateBody, userId) => {
    const project = await (0, exports.getProjectById)(projectId);
    if (!project) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Project not found');
    }
    if (project.ownerId.toString() !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission to update this project');
    }
    Object.assign(project, updateBody);
    await project.save();
    return project;
};
exports.updateProjectById = updateProjectById;
/**
 * Delete project by id
 * @param {string} projectId
 * @param {string} userId - To verify ownership
 * @returns {Promise<IProject | null>}
 */
const deleteProjectById = async (projectId, userId) => {
    const project = await (0, exports.getProjectById)(projectId);
    if (!project) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Project not found');
    }
    if (project.ownerId.toString() !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission to delete this project');
    }
    await project.deleteOne();
    return project;
};
exports.deleteProjectById = deleteProjectById;
