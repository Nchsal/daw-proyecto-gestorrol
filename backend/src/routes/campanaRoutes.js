// backend/src/routes/campanaRoutes.js
import { Router } from 'express';
import { obtenerCampanas } from '../controllers/campanaController.js';
import  authGuard  from '../middlewares/authGuard.js';

const router = Router();

// Ruta protegida: exige token válido para ver las campañas
router.get('/', authGuard, obtenerCampanas);

export default router;