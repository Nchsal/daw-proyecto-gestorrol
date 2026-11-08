// backend/src/middlewares/authGuard.js

/*
Comprueba que la persona que hace la petición está registrada y ha iniciado sesión enviando
un token JWT válido. Si no lo lleva o el token es falso/caducado, se le rechaza con un 401 Unauthorized.
*/

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_temporal_gestor_rol';

const authGuard = (req, res, next) => {
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
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, rol, email, ... }
    next();
  } catch (error) {
    return res.status(403, {
      type: "https://api.cifpaviles.es/errors/v1/403",
      title: "Token inválido o expirado",
      status: 403,
      detail: "El token proporcionado no es válido o ha caducado.",
      instance: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  }
};

export default authGuard;