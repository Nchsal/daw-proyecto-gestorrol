// backend/src/middlewares/authGuard.js

/*
Comprueba que la persona que hace la petición está registrada y ha iniciado sesión enviando
un token JWT válido. Si no lo lleva o el token es falso/caducado, se le rechaza con un 401 Unauthorized.
*/

import jwt from 'jsonwebtoken';

const authGuard = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      type: "https://api.cifpaviles.es/errors/v1/500",
      title: "Error de Configuración del Servidor",
      status: 500,
      detail: "No está configurada la clave secreta JWT_SECRET en el entorno.",
      instance: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      type: "https://api.cifpaviles.es/errors/v1/401",
      title: "No autorizado",
      status: 401,
      detail: "No se ha proporcionado un token de acceso válido o la cabecera Authorization está ausente.",
      instance: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      type: "https://api.cifpaviles.es/errors/v1/401",
      title: "Token inválido o expirado",
      status: 401,
      detail: "El token proporcionado no es válido o ha caducado.",
      instance: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  }
};

export default authGuard;