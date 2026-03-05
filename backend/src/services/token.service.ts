import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/config';
import { redisClient } from '../config/redis';

export interface TokenPayload {
    sub: string;
    iat: number;
    exp: number;
    type: string;
    jti?: string;
}

export const generateToken = (
    userId: string,
    expires: number,
    type: string,
    secret = config.jwt.secret,
    jti = uuidv4()
): string => {
    const payload: TokenPayload = {
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: expires,
        type,
        jti,
    };
    return jwt.sign(payload, secret);
};

export const saveRefreshToken = async (userId: string, jti: string, expires: number): Promise<void> => {
    const key = `session:${userId}:${jti}`;
    const ttl = expires - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
        await redisClient.set(key, 'true', { EX: ttl });
    }
};

export const verifyRefreshToken = async (userId: string, jti: string): Promise<boolean> => {
    const key = `session:${userId}:${jti}`;
    const exists = await redisClient.get(key);
    return !!exists;
};

export const revokeRefreshToken = async (userId: string, jti: string): Promise<void> => {
    const key = `session:${userId}:${jti}`;
    await redisClient.del(key);
};
