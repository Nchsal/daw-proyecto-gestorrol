// backend/src/services/secretoMasterService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerSecretosPorCampanaService = async (campanaId) => {
  return await prisma.secretoMaster.findMany({
    where: { campanaId: Number(campanaId) },
    orderBy: { id: 'asc' },
  });
};

export const obtenerSecretoPorIdService = async (id) => {
  return await prisma.secretoMaster.findUnique({
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

export const crearSecretoService = async (campanaId, data) => {
  return await prisma.secretoMaster.create({
    data: {
      ...data,
      campanaId: Number(campanaId),
    },
  });
};

export const actualizarSecretoService = async (id, data) => {
  return await prisma.secretoMaster.update({
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

export const eliminarSecretoService = async (id) => {
  return await prisma.secretoMaster.delete({
    where: { id: Number(id) },
  });
};