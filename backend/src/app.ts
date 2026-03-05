import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorConverter, errorHandler } from './middleware/error';
import ApiError from './utils/ApiError';
import logger from './utils/logger';
import routes from './routes';

dotenv.config();

const app = express();

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(httpStatus.OK).send('OK');
});

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
