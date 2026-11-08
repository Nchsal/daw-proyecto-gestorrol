// backend/src/routes/authRoutes.js

/*
Para que Express escuche las peticiones en /api/v1/auth/login
*/

import { Router } from 'express';
import { login } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);

export default router;