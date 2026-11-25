// backend/src/routes/campanaRoutes.js
import { Router } from 'express';
import {
  obtenerCampanas,
  crearCampana,
  obtenerCampanaPorId,
  actualizarCampana,
  eliminarCampana
} from '../controllers/campanaController.js';
import roleGuard from '../middlewares/roleGuard.js';
import authGuard from '../middlewares/authGuard.js';

const router = Router();

// GET Listar campañas (200 OK)
router.get('/', authGuard, obtenerCampanas);

// POST Crear campaña (201 Created / 422 Unprocessable)
router.post('/', authGuard, crearCampana);

// GET Ruta exclusiva de administrador para probar el 403 Forbidden
router.get('/admin/panel', authGuard, roleGuard(['admin']), (req, res) => {
  res.status(200).json({ message: "Bienvenido al panel de administración" });
});

// GET Buscar por ID (200 OK / 403 Forbidden / 404 Not Found)
router.get('/:id', authGuard, obtenerCampanaPorId);

// PATCH / PUT Actualizar campaña por ID (200 OK / 400 / 403 / 404 / 422)
router.patch('/:id', authGuard, actualizarCampana);
router.put('/:id', authGuard, actualizarCampana);

// DELETE Eliminar campaña por ID (200 OK / 403 Forbidden / 404 Not Found)
router.delete('/:id', authGuard, eliminarCampana);

export default router;