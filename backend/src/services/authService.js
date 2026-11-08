// backend/src/services/authService.js

/*
Se encarga de buscar al usuario por su email usando Prisma, verificar su contraseña con bcrypt
y generar el token JWT si las credenciales son correctas.
*/

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_temporal_gestor_rol';

export const loginUser = async (email, password) => {
  // 1. Buscar el usuario en la base de datos
  const user = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Credenciales inválidas'); // Será capturado como error de autenticación
  }

  // 2. Verificar la contraseña con bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  // 3. Generar el token JWT incluyendo los datos clave (id, rol, email)
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      rol: user.rol 
    },
    JWT_SECRET,
    { expiresIn: '8h' } // El token caduca en 8 horas
  );

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    }
  };
};