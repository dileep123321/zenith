"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createProject = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(['Planning', 'Active', 'Completed']).default('Planning'),
    }),
});
const getProjects = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.enum(['Planning', 'Active', 'Completed']).optional(),
    }),
});
const getProject = zod_1.z.object({
    params: zod_1.z.object({
        projectId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
});
const updateProject = zod_1.z.object({
    params: zod_1.z.object({
        projectId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(['Planning', 'Active', 'Completed']).optional(),
    }),
});
const deleteProject = zod_1.z.object({
    params: zod_1.z.object({
        projectId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
});
exports.default = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};
