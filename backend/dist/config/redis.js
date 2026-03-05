"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("../utils/logger"));
const redisClient = (0, redis_1.createClient)({
    url: config_1.default.redis.url,
});
exports.redisClient = redisClient;
redisClient.on('error', (err) => logger_1.default.error('Redis Client Error', err));
redisClient.on('connect', () => logger_1.default.info('Connected to Redis'));
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};
exports.connectRedis = connectRedis;
