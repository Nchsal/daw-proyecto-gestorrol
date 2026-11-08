/*
  Warnings:

  - Added the required column `usuario_id` to the `campana` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `campana` ADD COLUMN `usuario_id` INTEGER UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `campana` ADD CONSTRAINT `campana_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
