"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const envVarsSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['production', 'development', 'test']),
    PORT: zod_1.z.string().default('5000').transform((val) => parseInt(val, 10)),
    MONGODB_URL: zod_1.z.string().describe('MongoDB connection URL'),
    JWT_SECRET: zod_1.z.string().describe('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: zod_1.z.string().default('30').transform((val) => parseInt(val, 10)),
    JWT_REFRESH_EXPIRATION_DAYS: zod_1.z.string().default('30').transform((val) => parseInt(val, 10)),
    REDIS_URL: zod_1.z.string().describe('Redis connection URL'),
});
const envVars = envVarsSchema.parse(process.env);
exports.default = {
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
