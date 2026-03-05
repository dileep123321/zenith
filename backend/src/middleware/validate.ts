import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const validate = (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.issues.map((issue) => issue.message).join(', ');
            return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        }
        next(error);
    }
};

export default validate;
