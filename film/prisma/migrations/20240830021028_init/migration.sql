-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `comment_movieId` VARCHAR(36) NULL,
    ADD COLUMN `comment_tvId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_comment_movieId_fkey` FOREIGN KEY (`comment_movieId`) REFERENCES `Movie`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_comment_tvId_fkey` FOREIGN KEY (`comment_tvId`) REFERENCES `TV`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
