/*
  Warnings:

  - You are about to drop the `ActorOnFilm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryOnFilm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountryOnFilm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DirectorOnFilm` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ActorOnFilm` DROP FOREIGN KEY `ActorOnFilm_actorId_fkey`;

-- DropForeignKey
ALTER TABLE `ActorOnFilm` DROP FOREIGN KEY `actor_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `ActorOnFilm` DROP FOREIGN KEY `actor_tvId_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryOnFilm` DROP FOREIGN KEY `CategoryOnFilm_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryOnFilm` DROP FOREIGN KEY `category_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryOnFilm` DROP FOREIGN KEY `category_tvId_fkey`;

-- DropForeignKey
ALTER TABLE `CountryOnFilm` DROP FOREIGN KEY `CountryOnFilm_countryId_fkey`;

-- DropForeignKey
ALTER TABLE `CountryOnFilm` DROP FOREIGN KEY `country_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `CountryOnFilm` DROP FOREIGN KEY `country_tvId_fkey`;

-- DropForeignKey
ALTER TABLE `DirectorOnFilm` DROP FOREIGN KEY `DirectorOnFilm_directorId_fkey`;

-- DropForeignKey
ALTER TABLE `DirectorOnFilm` DROP FOREIGN KEY `director_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `DirectorOnFilm` DROP FOREIGN KEY `director_tvId_fkey`;

-- DropTable
DROP TABLE `ActorOnFilm`;

-- DropTable
DROP TABLE `CategoryOnFilm`;

-- DropTable
DROP TABLE `CountryOnFilm`;

-- DropTable
DROP TABLE `DirectorOnFilm`;

-- CreateTable
CREATE TABLE `ActorOnMovie` (
    `actorId` VARCHAR(36) NOT NULL,
    `movieId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`movieId`, `actorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActorOnTV` (
    `actorId` VARCHAR(36) NOT NULL,
    `tvId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`tvId`, `actorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DirectorOnMovie` (
    `directorId` VARCHAR(36) NOT NULL,
    `movieId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`movieId`, `directorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DirectorOnTV` (
    `directorId` VARCHAR(36) NOT NULL,
    `tvId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`tvId`, `directorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryOnMovie` (
    `categoryId` VARCHAR(36) NOT NULL,
    `movieId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`movieId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryOnTV` (
    `categoryId` VARCHAR(36) NOT NULL,
    `tvId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`tvId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CountryOnMovie` (
    `countryId` VARCHAR(36) NOT NULL,
    `movieId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`movieId`, `countryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CountryOnTV` (
    `countryId` VARCHAR(36) NOT NULL,
    `tvId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`tvId`, `countryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ActorOnMovie` ADD CONSTRAINT `ActorOnMovie_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `Actor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActorOnMovie` ADD CONSTRAINT `ActorOnMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActorOnTV` ADD CONSTRAINT `ActorOnTV_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `Actor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActorOnTV` ADD CONSTRAINT `ActorOnTV_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnMovie` ADD CONSTRAINT `DirectorOnMovie_directorId_fkey` FOREIGN KEY (`directorId`) REFERENCES `Director`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnMovie` ADD CONSTRAINT `DirectorOnMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnTV` ADD CONSTRAINT `DirectorOnTV_directorId_fkey` FOREIGN KEY (`directorId`) REFERENCES `Director`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnTV` ADD CONSTRAINT `DirectorOnTV_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnMovie` ADD CONSTRAINT `CategoryOnMovie_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnMovie` ADD CONSTRAINT `CategoryOnMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnTV` ADD CONSTRAINT `CategoryOnTV_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnTV` ADD CONSTRAINT `CategoryOnTV_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnMovie` ADD CONSTRAINT `CountryOnMovie_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnMovie` ADD CONSTRAINT `CountryOnMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnTV` ADD CONSTRAINT `CountryOnTV_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnTV` ADD CONSTRAINT `CountryOnTV_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
