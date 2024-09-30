/*
  Warnings:

  - The primary key for the `UserRatings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `UserRatings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `_RatingToUserRatings` DROP FOREIGN KEY `_RatingToUserRatings_B_fkey`;

-- AlterTable
ALTER TABLE `UserRatings` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `_RatingToUserRatings` ADD CONSTRAINT `_RatingToUserRatings_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserRatings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
