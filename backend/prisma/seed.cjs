const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando la siembra robusta de datos de prueba (Hito 2)...');

  // 1. Limpieza de datos previa 
  await prisma.asistenciaSesion.deleteMany();
  await prisma.sesionPnj.deleteMany();
  await prisma.secretoMaster.deleteMany();
  await prisma.objetoTrama.deleteMany();
  await prisma.pnj.deleteMany();
  await prisma.localizacion.deleteMany();
  await prisma.sesion.deleteMany();
  await prisma.personaje.deleteMany();
  await prisma.campana.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('🧹 Base de datos limpiada correctamente de forma idempotente.');

  // 2. Hashear contraseñas con bcrypt
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('Admin1234!', saltRounds);
  const userPassword = await bcrypt.hash('User1234!', saltRounds);

  // 3. Crear los usuarios obligatorios y guardarlos en una variable
  const usuarios = await Promise.all([
    prisma.usuario.create({ data: { email: 'admin@cifpaviles.es', password: adminPassword, rol: 'admin' } }),
    prisma.usuario.create({ data: { email: 'user1@cifpaviles.es', password: userPassword, rol: 'user' } }),
    prisma.usuario.create({ data: { email: 'user2@cifpaviles.es', password: userPassword, rol: 'user' } }),
  ]);

  console.log('🔐 Usuarios demo creados (Admin y Clientes con contraseñas hasheadas).');

  // 4. Crear 10 Campañas asociándolas a un usuario propietario
  console.log('🏰 Creando campañas de prueba (10 registros)...');
  const campanasCreadas = [];
  
  for (let i = 1; i <= 10; i++) {
    // Asignamos la campaña cíclicamente a uno de los usuarios creados
    const usuarioPropietario = usuarios[i % usuarios.length];

    const campana = await prisma.campana.create({
      data: {
        usuarioId: usuarioPropietario.id, // <-- NUEVO: Vinculamos la campaña al usuario
        nombre: `Campaña de Fantasía ${i}`,
        sistemaJuego: i % 2 === 0 ? 'D&D 5.5' : 'Call of Cthulhu',
        descripcion: `Descripción detallada de la campaña número ${i} para pruebas del sistema.`,
        fechaInicio: new Date(`2026-0${(i % 9) + 1}-15T00:00:00.000Z`),
        esPublico: i % 3 === 0,
      },
    });
    campanasCreadas.push(campana);
  }

  // 5. Crear Localizaciones 
  console.log('🗺️ Creando localizaciones (12 registros)...');
  const localizacionesCreadas = [];
  for (let i = 1; i <= 12; i++) {
    const loc = await prisma.localizacion.create({
      data: {
        campanaId: campanasCreadas[i % campanasCreadas.length].id,
        nombre: `Localización Principal ${i}`,
        descripcion: `Zona geográfica o mazmorra número ${i} dentro del mundo de juego.`,
      },
    });
    localizacionesCreadas.push(loc);
  }

  // 6. Crear Personajes / PJs
  console.log('⚔️ Creando personajes (12 registros)...');
  const personajesCreados = [];
  const nombresPjs = [
    'Szeth Vallano', 'Lyra Windrunner', 'Thorgar Barbagris', 'Elendor Furia del Alba', 
    'Vespera Shadowmend', 'Kaelen Vane', 'Berenice Kestrel', 'Dorn Ironforge', 
    'Mirena Moonwhisper', 'Zarek Bloodthorn', 'Tariq el Viajero', 'Isolde Brightshield'
  ];

  for (let i = 0; i < nombresPjs.length; i++) {
    const pj = await prisma.personaje.create({
      data: {
        campanaId: campanasCreadas[i % campanasCreadas.length].id,
        nombreJugador: i % 2 === 0 ? 'Nacho' : 'Colaborador Externo',
        nombrePj: nombresPjs[i],
        clase: i % 3 === 0 ? 'Brujo' : i % 3 === 1 ? 'Guerrero' : 'Mago',
        nivel: (i % 5) + 1,
      },
    });
    personajesCreados.push(pj);
  }

  // 7. Crear Sesiones de juego 
  console.log('📜 Creando sesiones (12 registros)...');
  const sesionesCreadas = [];
  for (let i = 1; i <= 12; i++) {
    const sesion = await prisma.sesion.create({
      data: {
        campanaId: campanasCreadas[0].id,
        numeroSesion: i,
        fecha: new Date(`2026-02-${i < 10 ? '0' + i : i}T00:00:00.000Z`),
        resumen: `Resumen de los acontecimientos ocurridos en la sesión número ${i}.`,
        eventosPrincipales: `Combate táctico y resolución de tramas secundarias en la sesión ${i}.`,
      },
    });
    sesionesCreadas.push(sesion);
  }

  // 8. Registrar Asistencia 
  console.log('🤝 Registrando asistencia en tabla M:N (8 filas)...');
  for (let i = 0; i < 8; i++) {
    await prisma.asistenciaSesion.create({
      data: {
        personajeId: personajesCreados[i % personajesCreados.length].id,
        sesionId: sesionesCreadas[i % sesionesCreadas.length].id,
        presente: true,
      },
    });
  }

  console.log('✨ ¡Seeders robustos y modelo de usuarios aplicados con éxito para el Hito 2!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante la siembra de datos robusta:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });