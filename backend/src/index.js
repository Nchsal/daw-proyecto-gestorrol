// backend/src/index.js
import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import campanaRoutes from './routes/campanaRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/campanas', campanaRoutes);

// Ruta de comprobación de estado
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Servidor funcionando correctamente para el Gestor de Rol",
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba para verificar el formato de errores RFC 9457
app.get('/api/v1/test-error', (req, res, next) => {
  const error = {
    status: 422,
    title: "Error de Validación de Parámetros",
    message: "El campo introducido no cumple las restricciones semánticas.",
    errors: [
      { field: "nombre", message: "El campo es obligatorio." }
    ]
  };
  next(error);
});

// Middleware global de manejo de errores
app.use(errorHandler);

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});