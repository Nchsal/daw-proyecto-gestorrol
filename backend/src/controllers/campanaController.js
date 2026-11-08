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

export const crearCampana = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    
    // Simulación de validación para el error 422
    if (!nombre || nombre.trim() === '') {
      return res.status(422).json({
        type: "https://api.cifpaviles.es/errors/validation-failed",
        title: "Error de Validación",
        status: 422,
        detail: "El campo 'nombre' es obligatorio para crear una campaña.",
        instance: "/api/v1/campanas",
        timestamp: new Date().toISOString()
      });
    }

    // Simulación de creación exitosa (201 Created)
    return res.status(201).json({
      message: "Campaña creada con éxito",
      data: { id: 99, nombre, descripcion }
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerCampanaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Simulamos que no se encuentra si el ID es 9999
    const campanaEncontrada = id === '9999' ? null : { id: Number(id), nombre: "Campaña de Prueba" };

    if (!campanaEncontrada) {
      return res.status(404).json({
        type: "https://api.cifpaviles.es/errors/not-found",
        title: "Recurso No Encontrado",
        status: 404,
        detail: `La campaña con ID ${id} no existe en el sistema.`,
        instance: `/api/v1/campanas/${id}`,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({ data: campanaEncontrada });
  } catch (error) {
    next(error);
  }
};