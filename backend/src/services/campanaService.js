// backend/src/services/campanaService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerCampanasService = async () => {
  return await prisma.campana.findMany();
};

export const crearCampanaService = async (data, userId) => {
  return await prisma.campana.create({
    data: {
      ...data,
      usuarioId: Number(userId), // Vinculación directa con el propietario (Anti-BOLA)
    },
  });
};

export const obtenerCampanaPorIdService = async (id) => {
  return await prisma.campana.findUnique({
    where: { id: Number(id) },
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          rol: true,
        },
      },
    },
  });
};

export const obtenerCampanaBasicaService = async (id) => {
  return await prisma.campana.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      usuarioId: true,
      nombre: true,
    },
  });
};

export const actualizarCampanaService = async (id, data) => {
  return await prisma.campana.update({
    where: { id: Number(id) },
    data,
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          rol: true,
        },
      },
    },
  });
};

export const eliminarCampanaService = async (id) => {
  return await prisma.campana.delete({
    where: { id: Number(id) },
  });
};