/*
  Warnings:

  - You are about to drop the column `commentId` on the `CommentUser` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `CommentUser_commentId_key` ON `CommentUser`;

-- DropIndex
DROP INDEX `CommentUser_email_key` ON `CommentUser`;

-- AlterTable
ALTER TABLE `CommentUser` DROP COLUMN `commentId`;
