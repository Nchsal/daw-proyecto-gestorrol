// backend/src/services/authService.js

/*
Se encarga de registrar usuarios, buscar por email usando Prisma, verificar
contraseñas con bcrypt y generar el token JWT si las credenciales son válidas.
*/

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Falta la variable de entorno obligatoria JWT_SECRET');
  }
  return process.env.JWT_SECRET;
};

export const registerUser = async (email, password) => {
  const existingUser = await prisma.usuario.findUnique({
    where: { email }
  });

  if (existingUser) {
    const error = new Error('Ya existe un usuario registrado con ese correo electrónico.');
    error.status = 409;
    error.title = 'Conflicto de recurso';
    error.type = 'https://api.cifpaviles.es/errors/v1/409';
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return await prisma.usuario.create({
    data: {
      email,
      password: hashedPassword,
      rol: 'user'
    },
    select: {
      id: true,
      email: true,
      rol: true
    }
  });
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