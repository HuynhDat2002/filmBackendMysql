/*
  Warnings:

  - A unique constraint covering the columns `[filmId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Rating_filmId_key` ON `Rating`(`filmId`);
