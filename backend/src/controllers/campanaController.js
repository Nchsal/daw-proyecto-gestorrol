// backend/src/controllers/campanaController.js
import { 
  obtenerCampanasService, 
  crearCampanaService, 
  obtenerCampanaPorIdService 
} from '../services/campanaService.js';

export const obtenerCampanas = async (req, res, next) => {
  try {
    const campanas = await obtenerCampanasService();
    return res.status(200).json({
      message: 'Campañas obtenidas con éxito',
      data: campanas
    });
  } catch (error) {
    next(error);
  }
};

export const crearCampana = async (req, res, next) => {
  try {
    const { nombre, descripcion, sistemaJuego, esPublico } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(422).json({
        type: "https://api.cifpaviles.es/errors/validation-failed",
        title: "Error de Validación",
        status: 422,
        detail: "El campo 'nombre' es obligatorio para crear una campaña.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    // Obtenemos el ID del usuario autenticado a través del token (req.user)
    const usuarioId = req.user.id;

    const nuevaCampana = await crearCampanaService({
      nombre,
      descripcion,
      sistemaJuego: sistemaJuego || 'D&D 5.5',
      esPublico: esPublico ?? false
    }, usuarioId);

    return res.status(201).json({
      message: "Campaña creada con éxito",
      data: nuevaCampana
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerCampanaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const campana = await obtenerCampanaPorIdService(id);

    if (!campana) {
      return res.status(404).json({
        type: "https://api.cifpaviles.es/errors/not-found",
        title: "Recurso No Encontrado",
        status: 404,
        detail: `La campaña con ID ${id} no existe en el sistema.`,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    // 🔒 CONTROL ANTI-BOLA (Resource Ownership)
    // Si el usuario no es admin y la campaña no le pertenece, se bloquea el acceso (403)
    const esAdmin = req.user.rol === 'admin';
    const esPropietario = campana.usuarioId === req.user.id;

    if (!esAdmin && !esPropietario) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/forbidden",
        title: "Acceso Prohibido (Anti-BOLA)",
        status: 403,
        detail: "No tienes permisos para acceder a esta campaña porque no te pertenece.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({ data: campana });
  } catch (error) {
    next(error);
  }
};