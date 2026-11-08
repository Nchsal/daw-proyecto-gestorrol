// backend/src/controllers/campanaController.js
import { obtenerCampanasService } from '../services/campanaService.js';

export const obtenerCampanas = async (req, res, next) => {
  try {
    // El controlador delega la lógica en el servicio
    const campanas = await obtenerCampanasService();

    // Devuelve el código HTTP canónico 200 OK con los datos
    return res.status(200).json({
      message: 'Campañas obtenidas con éxito',
      data: campanas
    });
  } catch (error) {
    // Si hay un error, lo pasa al middleware global de errores (RFC 9457)
    next(error);
  }
};