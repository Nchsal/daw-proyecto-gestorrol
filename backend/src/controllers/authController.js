// backend/src/controllers/authController.js

/*
Recibe los datos del cuerpo de la petición (req.body), llama al servicio y devuelve
la respuesta en formato JSON o maneja el error de forma adecuada.
*/

import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        type: "https://api.cifpaviles.es/errors/v1/400",
        title: "Solicitud incorrecta",
        status: 400,
        detail: "Se requiere el campo 'email' y el campo 'password' para registrarse.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const emailLimpio = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailLimpio) || String(password).length < 8) {
      return res.status(422).json({
        type: "https://api.cifpaviles.es/errors/validation-failed",
        title: "Error de Validación",
        status: 422,
        detail: "El correo electrónico debe tener un formato válido y la contraseña debe tener al menos 8 caracteres.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const nuevoUsuario = await registerUser(emailLimpio, String(password));

    return res.status(201).json({
      message: "Usuario registrado con éxito",
      data: nuevoUsuario
    });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({
        type: error.type || "https://api.cifpaviles.es/errors/v1/409",
        title: error.title || "Conflicto de recurso",
        status: 409,
        detail: error.message,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validación básica de entrada
    if (!email || !password) {
      return res.status(400).json({
        type: "https://api.cifpaviles.es/errors/v1/400",
        title: "Solicitud incorrecta",
        status: 400,
        detail: "Se requiere el campo 'email' y el campo 'password' para iniciar sesión.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    const resultado = await loginUser(email, password);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      data: resultado
    });

  } catch (error) {
    // Si el error viene del servicio por credenciales incorrectas, devolvemos un 401 estructurado
    if (error.message === 'Credenciales inválidas') {
      return res.status(401).json({
        type: "https://api.cifpaviles.es/errors/v1/401",
        title: "No autorizado",
        status: 401,
        detail: "El correo electrónico o la contraseña son incorrectos.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }

    // Si es otro fallo inesperado, lo derivamos al middleware global de errores
    next(error);
  }
};