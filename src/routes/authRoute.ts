import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/users/profile', AuthMiddleware.authenticate, AuthController.getProfile);
//router.get('/users');
export default router;