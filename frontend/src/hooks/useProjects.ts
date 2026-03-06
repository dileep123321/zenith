'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export interface Project {
    _id: string;
    name: string;
    description?: string;
    status: 'Planning' | 'Active' | 'Completed';
    createdAt: string;
}

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = async (data: any) => {
        try {
            const response = await api.post('/projects', data);
            setProjects((prev) => [response.data, ...prev]);
            return response.data;
        } catch (err: any) {
            throw err.response?.data?.message || 'Failed to create project';
        }
    };

    const updateProject = async (id: string, data: any) => {
        try {
            const response = await api.patch(`/projects/${id}`, data);
            setProjects((prev) => prev.map((p) => (p._id === id ? response.data : p)));
            return response.data;
        } catch (err: any) {
            throw err.response?.data?.message || 'Failed to update project';
        }
    };

    const deleteProject = async (id: string) => {
        try {
            await api.delete(`/projects/${id}`);
            setProjects((prev) => prev.filter((p) => (p._id !== id)));
        } catch (err: any) {
            throw err.response?.data?.message || 'Failed to delete project';
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return {
        projects,
        loading,
        error,
        refresh: fetchProjects,
        createProject,
        updateProject,
        deleteProject,
    };
};
