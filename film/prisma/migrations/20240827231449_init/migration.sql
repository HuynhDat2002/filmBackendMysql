/*
  Warnings:

  - You are about to drop the column `ratingFilmId` on the `UserRatings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserRatings` DROP FOREIGN KEY `UserRatings_ratingFilmId_fkey`;

-- AlterTable
ALTER TABLE `UserRatings` DROP COLUMN `ratingFilmId`;

-- CreateTable
CREATE TABLE `_RatingToUserRatings` (
    `A` VARCHAR(36) NOT NULL,
    `B` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `_RatingToUserRatings_AB_unique`(`A`, `B`),
    INDEX `_RatingToUserRatings_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_RatingToUserRatings` ADD CONSTRAINT `_RatingToUserRatings_A_fkey` FOREIGN KEY (`A`) REFERENCES `Rating`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RatingToUserRatings` ADD CONSTRAINT `_RatingToUserRatings_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserRatings`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
