// backend/src/middlewares/roleGuard.js

/*
Una vez que el authGuard ya ha demostrado quién es el usuario y ha dejado sus datos en req.user,
este segundo guard mira su rol (por ejemplo, si es un usuario normal o un administrador) para decidir
si tiene permiso para ejecutar esa acción concreta. Si un usuario normal intenta entrar en una ruta
exclusiva de admin, se le bloquea con un 403 Forbidden.
*/

const roleGuard = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        type: "https://api.cifpaviles.es/errors/v1/403",
        title: "Acceso Prohibido",
        status: 403,
        detail: "No tienes los permisos necesarios para acceder a este recurso.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }
    next();
  };
};

export default roleGuard;