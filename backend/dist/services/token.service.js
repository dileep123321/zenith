"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeRefreshToken = exports.verifyRefreshToken = exports.saveRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config/config"));
const redis_1 = require("../config/redis");
const generateToken = (userId, expires, type, secret = config_1.default.jwt.secret, jti = (0, uuid_1.v4)()) => {
    const payload = {
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: expires,
        type,
        jti,
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
exports.generateToken = generateToken;
const saveRefreshToken = async (userId, jti, expires) => {
    const key = `session:${userId}:${jti}`;
    const ttl = expires - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
        await redis_1.redisClient.set(key, 'true', { EX: ttl });
    }
};
exports.saveRefreshToken = saveRefreshToken;
const verifyRefreshToken = async (userId, jti) => {
    const key = `session:${userId}:${jti}`;
    const exists = await redis_1.redisClient.get(key);
    return !!exists;
};
exports.verifyRefreshToken = verifyRefreshToken;
const revokeRefreshToken = async (userId, jti) => {
    const key = `session:${userId}:${jti}`;
    await redis_1.redisClient.del(key);
};
exports.revokeRefreshToken = revokeRefreshToken;
