'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '../services/api';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get('accessToken');
            if (token) {
                try {
                    // In a real app, you might want a /me endpoint
                    // For now, we'll just check if the token exists and maybe decode it
                    // Or fetch the user information from a dedicated endpoint
                    // For this example, we'll assume the user is still valid if the token is there
                    // and we might have stored user info in localStorage or fetched it
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                } catch (error) {
                    console.error('Auth check failed', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { user, tokens } = response.data;

            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));

            Cookies.set('accessToken', tokens.access.token, { expires: new Date(tokens.access.expires) });
            Cookies.set('refreshToken', tokens.refresh.token, { expires: new Date(tokens.refresh.expires) });

            router.push('/dashboard');
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData: any) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { user, tokens } = response.data;

            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));

            Cookies.set('accessToken', tokens.access.token, { expires: new Date(tokens.access.expires) });
            Cookies.set('refreshToken', tokens.refresh.token, { expires: new Date(tokens.refresh.expires) });

            router.push('/dashboard');
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
