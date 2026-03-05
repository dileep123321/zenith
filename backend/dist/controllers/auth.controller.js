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
const http_status_1 = __importDefault(require("http-status"));
const uuid_1 = require("uuid");
const catchAsync_1 = require("../utils/catchAsync");
const authService = __importStar(require("../services/auth.service"));
const userService = __importStar(require("../services/user.service"));
const tokenService = __importStar(require("../services/token.service"));
const config_1 = __importDefault(require("../config/config"));
const register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await userService.createUser(req.body);
    const jti = (0, uuid_1.v4)();
    const accessTokenExpires = Math.floor(Date.now() / 1000) + config_1.default.jwt.accessExpirationMinutes * 60;
    const refreshTokenExpires = Math.floor(Date.now() / 1000) + config_1.default.jwt.refreshExpirationDays * 24 * 60 * 60;
    const accessToken = tokenService.generateToken(user.id, accessTokenExpires, 'access');
    const refreshToken = tokenService.generateToken(user.id, refreshTokenExpires, 'refresh', config_1.default.jwt.secret, jti);
    await tokenService.saveRefreshToken(user.id, jti, refreshTokenExpires);
    res.status(http_status_1.default.CREATED).send({
        user,
        tokens: {
            access: {
                token: accessToken,
                expires: new Date(accessTokenExpires * 1000),
            },
            refresh: {
                token: refreshToken,
                expires: new Date(refreshTokenExpires * 1000),
            },
        },
    });
});
const login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const jti = (0, uuid_1.v4)();
    const accessTokenExpires = Math.floor(Date.now() / 1000) + config_1.default.jwt.accessExpirationMinutes * 60;
    const refreshTokenExpires = Math.floor(Date.now() / 1000) + config_1.default.jwt.refreshExpirationDays * 24 * 60 * 60;
    const accessToken = tokenService.generateToken(user.id, accessTokenExpires, 'access');
    const refreshToken = tokenService.generateToken(user.id, refreshTokenExpires, 'refresh', config_1.default.jwt.secret, jti);
    await tokenService.saveRefreshToken(user.id, jti, refreshTokenExpires);
    res.send({
        user,
        tokens: {
            access: {
                token: accessToken,
                expires: new Date(accessTokenExpires * 1000),
            },
            refresh: {
                token: refreshToken,
                expires: new Date(refreshTokenExpires * 1000),
            },
        },
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(http_status_1.default.NO_CONTENT).send();
});
const refreshTokens = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
});
exports.default = {
    register,
    login,
    logout,
    refreshTokens,
};
