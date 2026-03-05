import { z } from 'zod';

const createProject = z.object({
    body: z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(['Planning', 'Active', 'Completed']).default('Planning'),
    }),
});

const getProjects = z.object({
    query: z.object({
        status: z.enum(['Planning', 'Active', 'Completed']).optional(),
    }),
});

const getProject = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
});

const updateProject = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.enum(['Planning', 'Active', 'Completed']).optional(),
    }),
});

const deleteProject = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
});

export default {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};
