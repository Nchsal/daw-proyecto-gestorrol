// backend/src/controllers/authController.js

/*
Recibe los datos del cuerpo de la petición (req.body), llama al servicio y devuelve
la respuesta en formato JSON o maneja el error de forma adecuada.
*/

import { loginUser } from '../services/authService.js';

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