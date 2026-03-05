import express from 'express';
import validate from '../middleware/validate';
import authValidator from '../validators/auth.validator';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', validate(authValidator.register), authController.register);
router.post('/login', validate(authValidator.login), authController.login);
router.post('/logout', validate(authValidator.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidator.refreshTokens), authController.refreshTokens);

export default router;
