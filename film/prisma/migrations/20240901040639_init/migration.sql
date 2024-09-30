/*
  Warnings:

  - The primary key for the `CommentUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `comment_user_id` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `CommentUser` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `CommentUser` DROP FOREIGN KEY `CommentUser_commentId_fkey`;

-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `comment_user_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `CommentUser` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_comment_user_id_fkey` FOREIGN KEY (`comment_user_id`) REFERENCES `CommentUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
