// backend/src/controllers/sesionController.js
import { obtenerCampanaBasicaService } from '../services/campanaService.js';
import {
  obtenerSesionesPorCampanaService,
  obtenerSesionPorIdService,
  crearSesionService,
  actualizarSesionService,
  eliminarSesionService
} from '../services/sesionService.js';

const parsearEnteroPositivo = (valor, nombreCampo, req, res) => {
  const num = Number(valor);
  if (!Number.isInteger(num) || num <= 0) {
    res.status(400).json({
      type: "https://api.cifpaviles.es/errors/v1/400",
      title: "Solicitud incorrecta",
      status: 400,
      detail: `El identificador '${nombreCampo}' debe ser un número entero positivo.`,
      instance: req.originalUrl,
      timestamp: new Date().toISOString()
    });
    return null;
  }
  return num;
};

const tienePermisoSobreCampana = (reqUser, usuarioIdCampana) => {
  return reqUser.rol === 'admin' || usuarioIdCampana === reqUser.id;
};

const parsearFechaValida = (fecha) => {
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha.trim())) {
    const fechaUtc = new Date(`${fecha.trim()}T00:00:00.000Z`);
    return Number.isNaN(fechaUtc.getTime()) ? null : fechaUtc;
  }
  const dateObj = new Date(fecha);
  return Number.isNaN(dateObj.getTime()) ? null : dateObj;
};

const normalizarTextoOpcional = (valor) => {
  if (valor === null) return null;
  if (typeof valor === 'string') return valor;
  if (typeof valor === 'number' || typeof valor === 'boolean') return String(valor);
  return undefined;
};

export const obtenerSesionesPorCampana = async (req, res, next) => {
  try {
    const campanaId = parsearEnteroPositivo(req.params.campanaId, 'campanaId', req, res);
    if (!campanaId) return;

    const campana = await obtenerCampanaBasicaService(campanaId);
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

    if (!tienePermisoSobreCampana(req.user, campana.usuarioId)) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/forbidden",
        title: "Acceso Prohibido (Anti-BOLA)",
        status: 403,
        detail: "No tienes permisos para ver las sesiones de esta campaña.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const sesiones = await obtenerSesionesPorCampanaService(campanaId);
    return res.status(200).json({
      message: "Sesiones obtenidas con éxito",
      data: sesiones
    });
  } catch (error) {
    next(error);
  }
};

export const crearSesion = async (req, res, next) => {
  try {
    const campanaId = parsearEnteroPositivo(req.params.campanaId, 'campanaId', req, res);
    if (!campanaId) return;

    const campana = await obtenerCampanaBasicaService(campanaId);
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

    if (!tienePermisoSobreCampana(req.user, campana.usuarioId)) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/forbidden",
        title: "Acceso Prohibido (Anti-BOLA)",
        status: 403,
        detail: "No tienes permisos para crear sesiones en esta campaña.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const { numeroSesion, fecha, resumen, eventosPrincipales } = req.body;
    const numSesion = Number(numeroSesion);

    if (!Number.isInteger(numSesion) || numSesion <= 0 || !fecha) {
      return res.status(422).json({
        type: "https://api.cifpaviles.es/errors/validation-failed",
        title: "Error de Validación",
        status: 422,
        detail: "Los campos 'numeroSesion' (entero positivo) y 'fecha' son obligatorios para crear una sesión.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const fechaParseada = parsearFechaValida(fecha);
    if (!fechaParseada) {
      return res.status(422).json({
        type: "https://api.cifpaviles.es/errors/validation-failed",
        title: "Error de Validación",
        status: 422,
        detail: "El campo 'fecha' no tiene un formato de fecha válido.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const resumenNormalizado = resumen !== undefined ? normalizarTextoOpcional(resumen) : undefined;
    const eventosNormalizados = eventosPrincipales !== undefined ? normalizarTextoOpcional(eventosPrincipales) : undefined;

    if ((resumen !== undefined && resumenNormalizado === undefined) ||
        (eventosPrincipales !== undefined && eventosNormalizados === undefined)) {
      return res.status(422).json({
        type: "https://api.cifpaviles.es/errors/validation-failed",
        title: "Error de Validación",
        status: 422,
        detail: "Los campos 'resumen' y 'eventosPrincipales' deben ser texto si se proporcionan.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const datosSesion = {
      numeroSesion: numSesion,
      fecha: fechaParseada,
      ...(resumenNormalizado !== undefined && { resumen: resumenNormalizado }),
      ...(eventosNormalizados !== undefined && { eventosPrincipales: eventosNormalizados }),
    };

    const nuevaSesion = await crearSesionService(campanaId, datosSesion);

    return res.status(201).json({
      message: "Sesión creada con éxito",
      data: nuevaSesion
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerSesionPorId = async (req, res, next) => {
  try {
    const sesionId = parsearEnteroPositivo(req.params.id, 'id', req, res);
    if (!sesionId) return;

    const sesion = await obtenerSesionPorIdService(sesionId);
    if (!sesion) {
      return res.status(404).json({
        type: "https://api.cifpaviles.es/errors/not-found",
        title: "Recurso No Encontrado",
        status: 404,
        detail: `La sesión con ID ${sesionId} no existe en el sistema.`,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    if (!tienePermisoSobreCampana(req.user, sesion.campana.usuarioId)) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/forbidden",
        title: "Acceso Prohibido (Anti-BOLA)",
        status: 403,
        detail: "No tienes permisos para acceder a esta sesión.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({ data: sesion });
  } catch (error) {
    next(error);
  }
};

export const actualizarSesion = async (req, res, next) => {
  try {
    const sesionId = parsearEnteroPositivo(req.params.id, 'id', req, res);
    if (!sesionId) return;

    const sesionExistente = await obtenerSesionPorIdService(sesionId);
    if (!sesionExistente) {
      return res.status(404).json({
        type: "https://api.cifpaviles.es/errors/not-found",
        title: "Recurso No Encontrado",
        status: 404,
        detail: `La sesión con ID ${sesionId} no existe en el sistema.`,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    if (!tienePermisoSobreCampana(req.user, sesionExistente.campana.usuarioId)) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/forbidden",
        title: "Acceso Prohibido (Anti-BOLA)",
        status: 403,
        detail: "No tienes permisos para editar esta sesión.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const { numeroSesion, fecha, resumen, eventosPrincipales } = req.body;
    const datosActualizados = {};

    if (numeroSesion !== undefined) {
      const numSesion = Number(numeroSesion);
      if (!Number.isInteger(numSesion) || numSesion <= 0) {
        return res.status(422).json({
          type: "https://api.cifpaviles.es/errors/validation-failed",
          title: "Error de Validación",
          status: 422,
          detail: "El campo 'numeroSesion' debe ser un número entero positivo.",
          instance: req.originalUrl,
          timestamp: new Date().toISOString()
        });
      }
      datosActualizados.numeroSesion = numSesion;
    }

    if (fecha !== undefined) {
      const fechaParseada = parsearFechaValida(fecha);
      if (!fechaParseada) {
        return res.status(422).json({
          type: "https://api.cifpaviles.es/errors/validation-failed",
          title: "Error de Validación",
          status: 422,
          detail: "El campo 'fecha' no tiene un formato de fecha válido.",
          instance: req.originalUrl,
          timestamp: new Date().toISOString()
        });
      }
      datosActualizados.fecha = fechaParseada;
    }

    if (resumen !== undefined) {
      const resumenNormalizado = normalizarTextoOpcional(resumen);
      if (resumenNormalizado === undefined) {
        return res.status(422).json({
          type: "https://api.cifpaviles.es/errors/validation-failed",
          title: "Error de Validación",
          status: 422,
          detail: "El campo 'resumen' debe ser texto si se proporciona.",
          instance: req.originalUrl,
          timestamp: new Date().toISOString()
        });
      }
      datosActualizados.resumen = resumenNormalizado;
    }

    if (eventosPrincipales !== undefined) {
      const eventosNormalizados = normalizarTextoOpcional(eventosPrincipales);
      if (eventosNormalizados === undefined) {
        return res.status(422).json({
          type: "https://api.cifpaviles.es/errors/validation-failed",
          title: "Error de Validación",
          status: 422,
          detail: "El campo 'eventosPrincipales' debe ser texto si se proporciona.",
          instance: req.originalUrl,
          timestamp: new Date().toISOString()
        });
      }
      datosActualizados.eventosPrincipales = eventosNormalizados;
    }

    if (Object.keys(datosActualizados).length === 0) {
      return res.status(400).json({
        type: "https://api.cifpaviles.es/errors/v1/400",
        title: "Solicitud incorrecta",
        status: 400,
        detail: "Debes enviar al menos un campo válido para actualizar la sesión.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const sesionActualizada = await actualizarSesionService(sesionId, datosActualizados);

    return res.status(200).json({
      message: "Sesión actualizada con éxito",
      data: sesionActualizada
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarSesion = async (req, res, next) => {
  try {
    const sesionId = parsearEnteroPositivo(req.params.id, 'id', req, res);
    if (!sesionId) return;

    const sesionExistente = await obtenerSesionPorIdService(sesionId);
    if (!sesionExistente) {
      return res.status(404).json({
        type: "https://api.cifpaviles.es/errors/not-found",
        title: "Recurso No Encontrado",
        status: 404,
        detail: `La sesión con ID ${sesionId} no existe en el sistema.`,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    if (!tienePermisoSobreCampana(req.user, sesionExistente.campana.usuarioId)) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/forbidden",
        title: "Acceso Prohibido (Anti-BOLA)",
        status: 403,
        detail: "No tienes permisos para eliminar esta sesión.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    await eliminarSesionService(sesionId);

    return res.status(200).json({
      message: "Sesión eliminada con éxito"
    });
  } catch (error) {
    next(error);
  }
};