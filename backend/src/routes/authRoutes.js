// backend/src/routes/authRoutes.js

/*
Para que Express escuche las peticiones en /api/v1/auth/login y /api/v1/auth/register
*/

import { Router } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;