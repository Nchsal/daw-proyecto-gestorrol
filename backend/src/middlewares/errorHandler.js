// backend/src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log interno para depuración en consola

  const status = err.status || 500;
  const title = err.title || (status === 500 ? "Error Interno del Servidor" : "Error en la Petición");
  
  // Estructura oficial RFC 9457 (API Problem Details)
  const problemDetails = {
    type: err.type || `https://api.cifpaviles.es/errors/v1/${status}`,
    title: title,
    status: status,
    detail: err.message || "Ocurrió un error inesperado en el servidor.",
    instance: req.originalUrl,
    timestamp: new Date().toISOString(),
    errors: err.errors || [] // Para errores de validación por campos (ej. Zod)
  };

  res.status(status).json(problemDetails);
};

export default errorHandler;