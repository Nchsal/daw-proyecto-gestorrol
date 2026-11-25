// backend/src/services/sesionService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerSesionesPorCampanaService = async (campanaId) => {
  return await prisma.sesion.findMany({
    where: { campanaId: Number(campanaId) },
    orderBy: { id: 'asc' },
  });
};

export const obtenerSesionPorIdService = async (id) => {
  return await prisma.sesion.findUnique({
    where: { id: Number(id) },
    include: {
      campana: {
        select: {
          id: true,
          nombre: true,
          usuarioId: true,
        },
      },
    },
  });
};

export const crearSesionService = async (campanaId, data) => {
  return await prisma.sesion.create({
    data: {
      ...data,
      campanaId: Number(campanaId),
    },
  });
};

export const actualizarSesionService = async (id, data) => {
  return await prisma.sesion.update({
    where: { id: Number(id) },
    data,
    include: {
      campana: {
        select: {
          id: true,
          nombre: true,
          usuarioId: true,
        },
      },
    },
  });
};

export const eliminarSesionService = async (id) => {
  return await prisma.sesion.delete({
    where: { id: Number(id) },
  });
};