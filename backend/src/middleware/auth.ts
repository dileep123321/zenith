import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../config/config';
import ApiError from '../utils/ApiError';
import User from '../models/user.model';
import { TokenPayload } from '../services/token.service';

const auth = (...requiredRights: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;

        if (payload.type !== 'access') {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
        }

        const user = await User.findById(payload.sub);
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
        }

        if (requiredRights.length) {
            const userRole = (user as any).role;
            if (!requiredRights.includes(userRole)) {
                throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
            }
        }

        (req as any).user = user;
        next();
    } catch (error) {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
};

export default auth;
