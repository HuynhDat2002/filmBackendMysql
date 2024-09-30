-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_comment_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_comment_user_id_fkey` FOREIGN KEY (`comment_user_id`) REFERENCES `CommentUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
