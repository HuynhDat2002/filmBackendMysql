/*
  Warnings:

  - You are about to drop the column `filmId` on the `ActorOnFilm` table. All the data in the column will be lost.
  - Added the required column `movieId` to the `ActorOnFilm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tvId` to the `ActorOnFilm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ActorOnFilm` DROP FOREIGN KEY `actor_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `ActorOnFilm` DROP FOREIGN KEY `actor_tvId_fkey`;

-- AlterTable
ALTER TABLE `ActorOnFilm` DROP COLUMN `filmId`,
    ADD COLUMN `movieId` VARCHAR(36) NOT NULL,
    ADD COLUMN `tvId` VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `ActorOnFilm` ADD CONSTRAINT `actor_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActorOnFilm` ADD CONSTRAINT `actor_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
