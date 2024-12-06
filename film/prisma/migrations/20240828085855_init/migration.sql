/*
  Warnings:

  - You are about to drop the `_RatingToUserRatings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_RatingToUserRatings` DROP FOREIGN KEY `_RatingToUserRatings_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RatingToUserRatings` DROP FOREIGN KEY `_RatingToUserRatings_B_fkey`;

-- DropTable
DROP TABLE `_RatingToUserRatings`;

-- CreateTable
CREATE TABLE `User_Rating` (
    `userRatingId` VARCHAR(36) NOT NULL,
    `ratingId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`ratingId`, `userRatingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User_Rating` ADD CONSTRAINT `User_Rating_userRatingId_fkey` FOREIGN KEY (`userRatingId`) REFERENCES `UserRatings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Rating` ADD CONSTRAINT `User_Rating_ratingId_fkey` FOREIGN KEY (`ratingId`) REFERENCES `Rating`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
