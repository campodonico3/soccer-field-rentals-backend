import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/user/:id', AuthMiddleware.authenticate, AuthController.getUserById);

export default router;