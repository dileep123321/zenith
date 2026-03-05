"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config/config"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth = (...requiredRights) => async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate');
        }
        const token = authHeader.split(' ')[1];
        const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        if (payload.type !== 'access') {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token type');
        }
        const user = await user_model_1.default.findById(payload.sub);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate');
        }
        if (requiredRights.length) {
            const userRole = user.role;
            if (!requiredRights.includes(userRole)) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
            }
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate'));
    }
};
exports.default = auth;
