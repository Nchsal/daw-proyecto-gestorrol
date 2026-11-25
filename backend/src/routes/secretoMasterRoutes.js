// backend/src/routes/secretoMasterRoutes.js
import { Router } from 'express';
import {
  obtenerSecretosPorCampana,
  crearSecreto,
  obtenerSecretoPorId,
  actualizarSecreto,
  eliminarSecreto
} from '../controllers/secretoMasterController.js';
import authGuard from '../middlewares/authGuard.js';

const router = Router();

// Rutas anidadas por campaña
router.get('/campana/:campanaId', authGuard, obtenerSecretosPorCampana);
router.post('/campana/:campanaId', authGuard, crearSecreto);

// Rutas directas sobre un secreto por ID
router.get('/:id', authGuard, obtenerSecretoPorId);
router.patch('/:id', authGuard, actualizarSecreto);
router.put('/:id', authGuard, actualizarSecreto);
router.delete('/:id', authGuard, eliminarSecreto);

export default router;