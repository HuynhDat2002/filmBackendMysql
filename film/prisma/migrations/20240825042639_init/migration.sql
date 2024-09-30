/*
  Warnings:

  - You are about to drop the column `rating` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `filmId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `TV` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Rating_filmId_key` ON `Rating`;

-- AlterTable
ALTER TABLE `Movie` DROP COLUMN `rating`;

-- AlterTable
ALTER TABLE `Rating` DROP COLUMN `filmId`,
    ADD COLUMN `movieId` VARCHAR(36) NULL,
    ADD COLUMN `tvId` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `TV` DROP COLUMN `rating`;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
