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
    include: { usuario: true } // Opcional: para ver datos del creador si se requiere
  });
};