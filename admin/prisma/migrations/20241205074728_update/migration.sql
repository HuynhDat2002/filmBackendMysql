/*
  Warnings:

  - You are about to drop the column `userAgent` on the `UserAgent` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserAgent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[agent]` on the table `UserAgent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `agent` to the `UserAgent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `UserAgent` DROP FOREIGN KEY `UserAgent_userId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `failedLogin` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `timeLock` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `UserAgent` DROP COLUMN `userAgent`,
    DROP COLUMN `userId`,
    ADD COLUMN `agent` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `UserOnAgent` (
    `userId` VARCHAR(36) NOT NULL,
    `agentId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`userId`, `agentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `UserAgent_agent_key` ON `UserAgent`(`agent`);

-- AddForeignKey
ALTER TABLE `UserOnAgent` ADD CONSTRAINT `UserOnAgent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOnAgent` ADD CONSTRAINT `UserOnAgent_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `UserAgent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
