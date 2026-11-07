const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando la siembra de datos de prueba...');

  // 1. Limpiar datos existentes de forma idempotente
  await prisma.asistenciaSesion.deleteMany();
  await prisma.sesionPnj.deleteMany();
  await prisma.secretoMaster.deleteMany();
  await prisma.objetoTrama.deleteMany();
  await prisma.pnj.deleteMany();
  await prisma.localizacion.deleteMany();
  await prisma.sesion.deleteMany();
  await prisma.personaje.deleteMany();
  await prisma.campana.deleteMany();

  console.log('🧹 Base de datos limpiada correctamente.');

  // 2. Crear una Campaña de prueba
  const campanaPrincipal = await prisma.campana.create({
    data: {
      nombre: 'La Maldición de Strahd',
      sistemaJuego: 'D&D 5.5', // Corregido: sin guion bajo
      descripcion: 'Campaña de terror gótico en las brumas de Barovia.',
      fechaInicio: new Date('2026-01-15T00:00:00.000Z'),
      esPublico: true,
    },
  });

  console.log(`🏰 Campaña creada: ${campanaPrincipal.nombre}`);

  // 3. Crear Localizaciones asociadas
  await prisma.localizacion.create({
    data: {
      campanaId: campanaPrincipal.id, // Corregido: campanaId según tu schema
      nombre: 'Pueblo de Barovia',
      descripcion: 'Un poblado lúgubre envuelto en una niebla perpetua.',
    },
  });

  // 4. Crear Personajes (PJs)
  const pj1 = await prisma.personaje.create({
    data: {
      campanaId: campanaPrincipal.id, // Corregido: campanaId
      nombreJugador: 'Nacho',         // Corregido: nombreJugador
      nombrePj: 'Szeth Vallano',      // Corregido: nombrePj
      clase: 'Brujo (Gran Antiguo)',
      nivel: 3,
    },
  });

  // 5. Crear Sesiones
  const sesion1 = await prisma.sesion.create({
    data: {
      campanaId: campanaPrincipal.id, // Corregido: campanaId
      numeroSesion: 1,                // Corregido: numeroSesion
      fecha: new Date('2026-01-20T00:00:00.000Z'),
      resumen: 'Los aventureros llegaron a Barovia y conocieron al burgomaestre.',
      eventosPrincipales: 'Primer encuentro con los Vistani en las afueras.', // Corregido
    },
  });

  // 6. Registrar Asistencia
  await prisma.asistenciaSesion.create({
    data: {
      personajeId: pj1.id,  // Corregido: personajeId
      sesionId: sesion1.id, // Corregido: sesionId
      presente: true,
    },
  });

  console.log('✨ ¡Seeders aplicados con éxito!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante la siembra de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });