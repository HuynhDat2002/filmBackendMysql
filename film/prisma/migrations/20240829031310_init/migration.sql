-- DropForeignKey
ALTER TABLE `User_Rating` DROP FOREIGN KEY `User_Rating_userRatingId_fkey`;

-- AddForeignKey
ALTER TABLE `User_Rating` ADD CONSTRAINT `User_Rating_userRatingId_fkey` FOREIGN KEY (`userRatingId`) REFERENCES `UserRatings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
