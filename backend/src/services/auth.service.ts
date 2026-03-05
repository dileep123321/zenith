import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/config';
import * as userService from './user.service';
import * as tokenService from './token.service';
import ApiError from '../utils/ApiError';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await (user as any).isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken: string) => {
    try {
        const payload = jwt.verify(refreshToken, config.jwt.secret) as tokenService.TokenPayload;
        const { sub: userId, jti } = payload;

        if (!jti) {
            throw new Error();
        }

        const isValid = await tokenService.verifyRefreshToken(userId, jti);
        if (!isValid) {
            throw new Error();
        }

        const user = await userService.getUserById(userId);
        if (!user) {
            throw new Error();
        }

        // Revoke old token and generate new ones
        await tokenService.revokeRefreshToken(userId, jti);

        const newJti = uuidv4();
        const accessTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
        const refreshTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.refreshExpirationDays * 24 * 60 * 60;

        const accessToken = tokenService.generateToken(user.id, accessTokenExpires, 'access');
        const newRefreshToken = tokenService.generateToken(user.id, refreshTokenExpires, 'refresh', config.jwt.secret, newJti);

        await tokenService.saveRefreshToken(user.id, newJti, refreshTokenExpires);

        return {
            access: {
                token: accessToken,
                expires: new Date(accessTokenExpires * 1000),
            },
            refresh: {
                token: newRefreshToken,
                expires: new Date(refreshTokenExpires * 1000),
            },
        };
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken: string) => {
    try {
        const payload = jwt.verify(refreshToken, config.jwt.secret) as tokenService.TokenPayload;
        const { sub: userId, jti } = payload;
        if (jti) {
            await tokenService.revokeRefreshToken(userId, jti);
        }
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};
