/*
  Warnings:

  - You are about to drop the column `filmId` on the `CategoryOnFilm` table. All the data in the column will be lost.
  - You are about to drop the column `filmId` on the `CountryOnFilm` table. All the data in the column will be lost.
  - You are about to drop the column `filmId` on the `DirectorOnFilm` table. All the data in the column will be lost.
  - Added the required column `movieId` to the `CategoryOnFilm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tvId` to the `CategoryOnFilm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movieId` to the `CountryOnFilm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tvId` to the `CountryOnFilm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movieId` to the `DirectorOnFilm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tvId` to the `DirectorOnFilm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CategoryOnFilm` DROP FOREIGN KEY `category_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryOnFilm` DROP FOREIGN KEY `category_tvId_fkey`;

-- DropForeignKey
ALTER TABLE `CountryOnFilm` DROP FOREIGN KEY `country_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `CountryOnFilm` DROP FOREIGN KEY `country_tvId_fkey`;

-- DropForeignKey
ALTER TABLE `DirectorOnFilm` DROP FOREIGN KEY `director_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `DirectorOnFilm` DROP FOREIGN KEY `director_tvId_fkey`;

-- AlterTable
ALTER TABLE `CategoryOnFilm` DROP COLUMN `filmId`,
    ADD COLUMN `movieId` VARCHAR(36) NOT NULL,
    ADD COLUMN `tvId` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `CountryOnFilm` DROP COLUMN `filmId`,
    ADD COLUMN `movieId` VARCHAR(36) NOT NULL,
    ADD COLUMN `tvId` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `DirectorOnFilm` DROP COLUMN `filmId`,
    ADD COLUMN `movieId` VARCHAR(36) NOT NULL,
    ADD COLUMN `tvId` VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `DirectorOnFilm` ADD CONSTRAINT `director_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnFilm` ADD CONSTRAINT `director_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnFilm` ADD CONSTRAINT `category_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnFilm` ADD CONSTRAINT `category_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnFilm` ADD CONSTRAINT `country_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnFilm` ADD CONSTRAINT `country_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
