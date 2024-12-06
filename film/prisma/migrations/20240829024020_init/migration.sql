/*
  Warnings:

  - You are about to drop the column `rating` on the `UserRatings` table. All the data in the column will be lost.
  - Added the required column `name` to the `UserRatings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingNumber` to the `User_Rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserRatings` DROP COLUMN `rating`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User_Rating` ADD COLUMN `ratingNumber` INTEGER NOT NULL;
