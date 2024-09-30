/*
  Warnings:

  - You are about to drop the column `name` on the `UserRatings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserRatings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `UserRatings` DROP COLUMN `name`;

-- CreateIndex
CREATE UNIQUE INDEX `UserRatings_userId_key` ON `UserRatings`(`userId`);
