import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = z.object({
    NODE_ENV: z.enum(['production', 'development', 'test']),
    PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
    MONGODB_URL: z.string().describe('MongoDB connection URL'),
    JWT_SECRET: z.string().describe('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: z.string().default('30').transform((val) => parseInt(val, 10)),
    JWT_REFRESH_EXPIRATION_DAYS: z.string().default('30').transform((val) => parseInt(val, 10)),
    REDIS_URL: z.string().describe('Redis connection URL'),
});

const envVars = envVarsSchema.parse(process.env);

export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
    redis: {
        url: envVars.REDIS_URL,
    },
};
