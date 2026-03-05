import { z } from 'zod';

const register = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string(),
        lastName: z.string(),
    }),
});

const login = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

const logout = z.object({
    body: z.object({
        refreshToken: z.string(),
    }),
});

const refreshTokens = z.object({
    body: z.object({
        refreshToken: z.string(),
    }),
});

export default {
    register,
    login,
    logout,
    refreshTokens,
};
