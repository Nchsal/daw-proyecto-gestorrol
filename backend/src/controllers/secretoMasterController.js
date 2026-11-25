// backend/src/controllers/secretoMasterController.js
import { obtenerCampanaBasicaService } from '../services/campanaService.js';
import {
  obtenerSecretosPorCampanaService,
  obtenerSecretoPorIdService,
  crearSecretoService,
  actualizarSecretoService,
  eliminarSecretoService
} from '../services/secretoMasterService.js';

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

export const obtenerSecretosPorCampana = async (req, res, next) => {
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
        detail: "No tienes permisos para consultar los secretos de esta campaña.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const secretos = await obtenerSecretosPorCampanaService(campanaId);
    return res.status(200).json({
      message: "Secretos obtenidos con éxito",
      data: secretos
    });
  } catch (error) {
    next(error);
  }
};

export const crearSecreto = async (req, res, next) => {
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
        detail: "No tienes permisos para crear secretos en esta campaña.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const { titulo, contenidoOculto, revelado } = req.body;

    if (
      !titulo || typeof titulo !== 'string' || titulo.trim() === '' ||
      !contenidoOculto || typeof contenidoOculto !== 'string' || contenidoOculto.trim() === ''
    ) {
      return res.status(422).json({
        type: "https://api.cifpaviles.es/errors/validation-failed",
        title: "Error de Validación",
        status: 422,
        detail: "Los campos 'titulo' y 'contenidoOculto' son obligatorios para crear un secreto.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    if (revelado !== undefined && typeof revelado !== 'boolean') {
      return res.status(422).json({
        type: "https://api.cifpaviles.es/errors/validation-failed",
        title: "Error de Validación",
        status: 422,
        detail: "El campo 'revelado' debe ser un valor booleano (true o false).",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const datosSecreto = {
      titulo: titulo.trim(),
      contenidoOculto: contenidoOculto.trim(),
      ...(revelado !== undefined && { revelado }),
    };

    const nuevoSecreto = await crearSecretoService(campanaId, datosSecreto);

    return res.status(201).json({
      message: "Secreto creado con éxito",
      data: nuevoSecreto
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerSecretoPorId = async (req, res, next) => {
  try {
    const secretoId = parsearEnteroPositivo(req.params.id, 'id', req, res);
    if (!secretoId) return;

    const secreto = await obtenerSecretoPorIdService(secretoId);
    if (!secreto) {
      return res.status(404).json({
        type: "https://api.cifpaviles.es/errors/not-found",
        title: "Recurso No Encontrado",
        status: 404,
        detail: `El secreto con ID ${secretoId} no existe en el sistema.`,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    if (!tienePermisoSobreCampana(req.user, secreto.campana.usuarioId)) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/forbidden",
        title: "Acceso Prohibido (Anti-BOLA)",
        status: 403,
        detail: "No tienes permisos para acceder a este secreto.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({ data: secreto });
  } catch (error) {
    next(error);
  }
};

export const actualizarSecreto = async (req, res, next) => {
  try {
    const secretoId = parsearEnteroPositivo(req.params.id, 'id', req, res);
    if (!secretoId) return;

    const secretoExistente = await obtenerSecretoPorIdService(secretoId);
    if (!secretoExistente) {
      return res.status(404).json({
        type: "https://api.cifpaviles.es/errors/not-found",
        title: "Recurso No Encontrado",
        status: 404,
        detail: `El secreto con ID ${secretoId} no existe en el sistema.`,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    if (!tienePermisoSobreCampana(req.user, secretoExistente.campana.usuarioId)) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/forbidden",
        title: "Acceso Prohibido (Anti-BOLA)",
        status: 403,
        detail: "No tienes permisos para editar este secreto.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const { titulo, contenidoOculto, revelado } = req.body;
    const datosActualizados = {};

    if (titulo !== undefined) {
      if (typeof titulo !== 'string' || titulo.trim() === '') {
        return res.status(422).json({
          type: "https://api.cifpaviles.es/errors/validation-failed",
          title: "Error de Validación",
          status: 422,
          detail: "El campo 'titulo' no puede estar vacío.",
          instance: req.originalUrl,
          timestamp: new Date().toISOString()
        });
      }
      datosActualizados.titulo = titulo.trim();
    }

    if (contenidoOculto !== undefined) {
      if (typeof contenidoOculto !== 'string' || contenidoOculto.trim() === '') {
        return res.status(422).json({
          type: "https://api.cifpaviles.es/errors/validation-failed",
          title: "Error de Validación",
          status: 422,
          detail: "El campo 'contenidoOculto' no puede estar vacío.",
          instance: req.originalUrl,
          timestamp: new Date().toISOString()
        });
      }
      datosActualizados.contenidoOculto = contenidoOculto.trim();
    }

    if (revelado !== undefined) {
      if (typeof revelado !== 'boolean') {
        return res.status(422).json({
          type: "https://api.cifpaviles.es/errors/validation-failed",
          title: "Error de Validación",
          status: 422,
          detail: "El campo 'revelado' debe ser un valor booleano (true o false).",
          instance: req.originalUrl,
          timestamp: new Date().toISOString()
        });
      }
      datosActualizados.revelado = revelado;
    }

    if (Object.keys(datosActualizados).length === 0) {
      return res.status(400).json({
        type: "https://api.cifpaviles.es/errors/v1/400",
        title: "Solicitud incorrecta",
        status: 400,
        detail: "Debes enviar al menos un campo válido para actualizar el secreto.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const secretoActualizado = await actualizarSecretoService(secretoId, datosActualizados);

    return res.status(200).json({
      message: "Secreto actualizado con éxito",
      data: secretoActualizado
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarSecreto = async (req, res, next) => {
  try {
    const secretoId = parsearEnteroPositivo(req.params.id, 'id', req, res);
    if (!secretoId) return;

    const secretoExistente = await obtenerSecretoPorIdService(secretoId);
    if (!secretoExistente) {
      return res.status(404).json({
        type: "https://api.cifpaviles.es/errors/not-found",
        title: "Recurso No Encontrado",
        status: 404,
        detail: `El secreto con ID ${secretoId} no existe en el sistema.`,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    if (!tienePermisoSobreCampana(req.user, secretoExistente.campana.usuarioId)) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/forbidden",
        title: "Acceso Prohibido (Anti-BOLA)",
        status: 403,
        detail: "No tienes permisos para eliminar este secreto.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    await eliminarSecretoService(secretoId);

    return res.status(200).json({
      message: "Secreto eliminado con éxito"
    });
  } catch (error) {
    next(error);
  }
};