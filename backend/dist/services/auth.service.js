"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshAuth = exports.loginUserWithEmailAndPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config/config"));
const userService = __importStar(require("./user.service"));
const tokenService = __importStar(require("./token.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
};
exports.loginUserWithEmailAndPassword = loginUserWithEmailAndPassword;
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt.secret);
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
        const newJti = (0, uuid_1.v4)();
        const accessTokenExpires = Math.floor(Date.now() / 1000) + config_1.default.jwt.accessExpirationMinutes * 60;
        const refreshTokenExpires = Math.floor(Date.now() / 1000) + config_1.default.jwt.refreshExpirationDays * 24 * 60 * 60;
        const accessToken = tokenService.generateToken(user.id, accessTokenExpires, 'access');
        const newRefreshToken = tokenService.generateToken(user.id, refreshTokenExpires, 'refresh', config_1.default.jwt.secret, newJti);
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
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate');
    }
};
exports.refreshAuth = refreshAuth;
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt.secret);
        const { sub: userId, jti } = payload;
        if (jti) {
            await tokenService.revokeRefreshToken(userId, jti);
        }
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate');
    }
};
exports.logout = logout;
