-- CreateTable
CREATE TABLE `campana` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `sistema_juego` VARCHAR(50) NOT NULL,
    `descripcion` TEXT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `es_publico` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `campana_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personaje` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `campana_id` INTEGER UNSIGNED NOT NULL,
    `nombre_jugador` VARCHAR(80) NOT NULL,
    `nombre_pj` VARCHAR(80) NOT NULL,
    `clase` VARCHAR(50) NOT NULL,
    `nivel` SMALLINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sesion` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `campana_id` INTEGER UNSIGNED NOT NULL,
    `numero_sesion` INTEGER UNSIGNED NOT NULL,
    `fecha` DATE NOT NULL,
    `resumen` TEXT NULL,
    `eventos_principales` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pnj` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `campana_id` INTEGER UNSIGNED NOT NULL,
    `localizacion_id` INTEGER UNSIGNED NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `relacion_pjs` TEXT NULL,
    `descripcion` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `localizacion` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `campana_id` INTEGER UNSIGNED NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `objeto_trama` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `campana_id` INTEGER UNSIGNED NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `propietario_actual` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `secreto_master` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `campana_id` INTEGER UNSIGNED NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `contenido_oculto` TEXT NOT NULL,
    `revelado` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asistencia_sesion` (
    `personaje_id` INTEGER UNSIGNED NOT NULL,
    `sesion_id` INTEGER UNSIGNED NOT NULL,
    `presente` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`personaje_id`, `sesion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sesion_pnj` (
    `sesion_id` INTEGER UNSIGNED NOT NULL,
    `pnj_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`sesion_id`, `pnj_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `personaje` ADD CONSTRAINT `personaje_campana_id_fkey` FOREIGN KEY (`campana_id`) REFERENCES `campana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sesion` ADD CONSTRAINT `sesion_campana_id_fkey` FOREIGN KEY (`campana_id`) REFERENCES `campana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pnj` ADD CONSTRAINT `pnj_campana_id_fkey` FOREIGN KEY (`campana_id`) REFERENCES `campana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pnj` ADD CONSTRAINT `pnj_localizacion_id_fkey` FOREIGN KEY (`localizacion_id`) REFERENCES `localizacion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `localizacion` ADD CONSTRAINT `localizacion_campana_id_fkey` FOREIGN KEY (`campana_id`) REFERENCES `campana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `objeto_trama` ADD CONSTRAINT `objeto_trama_campana_id_fkey` FOREIGN KEY (`campana_id`) REFERENCES `campana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `secreto_master` ADD CONSTRAINT `secreto_master_campana_id_fkey` FOREIGN KEY (`campana_id`) REFERENCES `campana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistencia_sesion` ADD CONSTRAINT `asistencia_sesion_personaje_id_fkey` FOREIGN KEY (`personaje_id`) REFERENCES `personaje`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistencia_sesion` ADD CONSTRAINT `asistencia_sesion_sesion_id_fkey` FOREIGN KEY (`sesion_id`) REFERENCES `sesion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sesion_pnj` ADD CONSTRAINT `sesion_pnj_sesion_id_fkey` FOREIGN KEY (`sesion_id`) REFERENCES `sesion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sesion_pnj` ADD CONSTRAINT `sesion_pnj_pnj_id_fkey` FOREIGN KEY (`pnj_id`) REFERENCES `pnj`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
