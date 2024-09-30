/*
  Warnings:

  - You are about to alter the column `ratingAverage` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Rating` MODIFY `ratingAverage` DOUBLE NOT NULL DEFAULT 0;
