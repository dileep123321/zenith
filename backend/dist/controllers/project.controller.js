"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../utils/catchAsync");
const projectService = __importStar(require("../services/project.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createProject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const projectBody = {
        ...req.body,
        ownerId: req.user.id,
    };
    const project = await projectService.createProject(projectBody);
    res.status(http_status_1.default.CREATED).send(project);
});
const getProjects = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filter = { ownerId: req.user.id };
    if (req.query.status) {
        filter.status = req.query.status;
    }
    const result = await projectService.queryProjects(filter);
    res.send(result);
});
const getProject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const project = await projectService.getProjectById(req.params.projectId);
    if (!project) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Project not found');
    }
    if (project.ownerId.toString() !== req.user.id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
    }
    res.send(project);
});
const updateProject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const project = await projectService.updateProjectById(req.params.projectId, req.body, req.user.id);
    res.send(project);
});
const deleteProject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await projectService.deleteProjectById(req.params.projectId, req.user.id);
    res.status(http_status_1.default.NO_CONTENT).send();
});
exports.default = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};
