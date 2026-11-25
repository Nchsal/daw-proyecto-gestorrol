// backend/src/services/authService.js

/*
Se encarga de buscar al usuario por su email usando Prisma, verificar su contraseña con bcrypt
y generar el token JWT si las credenciales son correctas.
*/

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Falta la variable de entorno obligatoria JWT_SECRET');
  }
  return process.env.JWT_SECRET;
};

export const loginUser = async (email, password) => {
  const jwtSecret = getJwtSecret();

  const user = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol: user.rol
    },
    jwtSecret,
    { expiresIn: '2h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      rol: user.rol
    }
  };
};