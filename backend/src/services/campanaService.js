// backend/src/services/campanaService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerCampanasService = async () => {
  // Consulta a la base de datos mediante Prisma (Capa de Persistencia)
  return await prisma.campana.findMany();
};