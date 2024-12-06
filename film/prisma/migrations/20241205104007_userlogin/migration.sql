/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserLogin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UserLogin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserLogin` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserLogin_userId_key` ON `UserLogin`(`userId`);
