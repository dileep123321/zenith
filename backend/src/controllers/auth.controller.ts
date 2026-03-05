import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { catchAsync } from '../utils/catchAsync';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';
import * as tokenService from '../services/token.service';
import config from '../config/config';

const register = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    const jti = uuidv4();
    const accessTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
    const refreshTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.refreshExpirationDays * 24 * 60 * 60;

    const accessToken = tokenService.generateToken(user.id, accessTokenExpires, 'access');
    const refreshToken = tokenService.generateToken(user.id, refreshTokenExpires, 'refresh', config.jwt.secret, jti);

    await tokenService.saveRefreshToken(user.id, jti, refreshTokenExpires);

    res.status(httpStatus.CREATED).send({
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

const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);

    const jti = uuidv4();
    const accessTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
    const refreshTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.refreshExpirationDays * 24 * 60 * 60;

    const accessToken = tokenService.generateToken(user.id, accessTokenExpires, 'access');
    const refreshToken = tokenService.generateToken(user.id, refreshTokenExpires, 'refresh', config.jwt.secret, jti);

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

const logout = catchAsync(async (req: Request, res: Response) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
});

export default {
    register,
    login,
    logout,
    refreshTokens,
};
