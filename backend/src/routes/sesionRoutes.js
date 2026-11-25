// backend/src/routes/sesionRoutes.js
import { Router } from 'express';
import {
  obtenerSesionesPorCampana,
  crearSesion,
  obtenerSesionPorId,
  actualizarSesion,
  eliminarSesion
} from '../controllers/sesionController.js';
import authGuard from '../middlewares/authGuard.js';

const router = Router();

// Rutas anidadas por campaña
router.get('/campana/:campanaId', authGuard, obtenerSesionesPorCampana);
router.post('/campana/:campanaId', authGuard, crearSesion);

// Rutas directas sobre una sesión por ID
router.get('/:id', authGuard, obtenerSesionPorId);
router.patch('/:id', authGuard, actualizarSesion);
router.put('/:id', authGuard, actualizarSesion);
router.delete('/:id', authGuard, eliminarSesion);

export default router;