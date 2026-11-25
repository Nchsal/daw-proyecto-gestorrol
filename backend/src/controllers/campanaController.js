// backend/src/controllers/campanaController.js
import {
  obtenerCampanasService,
  crearCampanaService,
  obtenerCampanaPorIdService,
  obtenerCampanaBasicaService,
  actualizarCampanaService,
  eliminarCampanaService
} from '../services/campanaService.js';

const parsearIdCampana = (id, req, res) => {
  const campanaId = Number(id);
  if (!Number.isInteger(campanaId) || campanaId <= 0) {
    res.status(400).json({
      type: "https://api.cifpaviles.es/errors/v1/400",
      title: "Solicitud incorrecta",
      status: 400,
      detail: "El identificador de la campaña debe ser un número entero positivo.",
      instance: req.originalUrl,
      timestamp: new Date().toISOString()
    });
    return null;
  }
  return campanaId;
};

const responderConflictoNombre = (req, res) => {
  return res.status(409).json({
    type: "https://api.cifpaviles.es/errors/v1/409",
    title: "Conflicto de recurso",
    status: 409,
    detail: "Ya existe una campaña registrada con ese nombre.",
    instance: req.originalUrl,
    timestamp: new Date().toISOString()
  });
};

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

    const usuarioId = req.user.id;

    const nuevaCampana = await crearCampanaService({
      nombre: nombre.trim(),
      descripcion,
      sistemaJuego: sistemaJuego || 'D&D 5.5',
      esPublico: esPublico ?? false
    }, usuarioId);

    return res.status(201).json({
      message: "Campaña creada con éxito",
      data: nuevaCampana
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return responderConflictoNombre(req, res);
    }
    next(error);
  }
};

export const obtenerCampanaPorId = async (req, res, next) => {
  try {
    const campanaId = parsearIdCampana(req.params.id, req, res);
    if (!campanaId) return;

    const campana = await obtenerCampanaPorIdService(campanaId);

    if (!campana) {
      return res.status(404).json({
        type: "https://api.cifpaviles.es/errors/not-found",
        title: "Recurso No Encontrado",
        status: 404,
        detail: `La campaña con ID ${campanaId} no existe en el sistema.`,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

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

export const actualizarCampana = async (req, res, next) => {
  try {
    const campanaId = parsearIdCampana(req.params.id, req, res);
    if (!campanaId) return;

    const campanaExistente = await obtenerCampanaBasicaService(campanaId);

    if (!campanaExistente) {
      return res.status(404).json({
        type: "https://api.cifpaviles.es/errors/not-found",
        title: "Recurso No Encontrado",
        status: 404,
        detail: `La campaña con ID ${campanaId} no existe en el sistema.`,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const esAdmin = req.user.rol === 'admin';
    const esPropietario = campanaExistente.usuarioId === req.user.id;

    if (!esAdmin && !esPropietario) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/forbidden",
        title: "Acceso Prohibido (Anti-BOLA)",
        status: 403,
        detail: "No tienes permisos para editar esta campaña porque no te pertenece.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const { nombre, sistemaJuego, descripcion, esPublico } = req.body;
    const datosActualizados = {};

    if (nombre !== undefined) {
      if (typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(422).json({
          type: "https://api.cifpaviles.es/errors/validation-failed",
          title: "Error de Validación",
          status: 422,
          detail: "El campo 'nombre' no puede estar vacío.",
          instance: req.originalUrl,
          timestamp: new Date().toISOString()
        });
      }
      datosActualizados.nombre = nombre.trim();
    }

    if (sistemaJuego !== undefined) {
      datosActualizados.sistemaJuego = sistemaJuego;
    }

    if (descripcion !== undefined) {
      datosActualizados.descripcion = descripcion;
    }

    if (esPublico !== undefined) {
      datosActualizados.esPublico = Boolean(esPublico);
    }

    if (Object.keys(datosActualizados).length === 0) {
      return res.status(400).json({
        type: "https://api.cifpaviles.es/errors/v1/400",
        title: "Solicitud incorrecta",
        status: 400,
        detail: "Debes enviar al menos un campo válido para actualizar la campaña.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const campanaActualizada = await actualizarCampanaService(campanaId, datosActualizados);

    return res.status(200).json({
      message: "Campaña actualizada con éxito",
      data: campanaActualizada
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return responderConflictoNombre(req, res);
    }
    next(error);
  }
};

export const eliminarCampana = async (req, res, next) => {
  try {
    const campanaId = parsearIdCampana(req.params.id, req, res);
    if (!campanaId) return;

    const campanaExistente = await obtenerCampanaBasicaService(campanaId);

    if (!campanaExistente) {
      return res.status(404).json({
        type: "https://api.cifpaviles.es/errors/not-found",
        title: "Recurso No Encontrado",
        status: 404,
        detail: `La campaña con ID ${campanaId} no existe en el sistema.`,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const esAdmin = req.user.rol === 'admin';
    const esPropietario = campanaExistente.usuarioId === req.user.id;

    if (!esAdmin && !esPropietario) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/forbidden",
        title: "Acceso Prohibido (Anti-BOLA)",
        status: 403,
        detail: "No tienes permisos para eliminar esta campaña porque no te pertenece.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    await eliminarCampanaService(campanaId);

    return res.status(200).json({
      message: "Campaña eliminada con éxito"
    });
  } catch (error) {
    next(error);
  }
};
