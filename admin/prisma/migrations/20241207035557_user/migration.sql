-- DropForeignKey
ALTER TABLE `KeyTokens` DROP FOREIGN KEY `KeyTokens_userId_fkey`;

-- DropForeignKey
ALTER TABLE `RefreshTokenUsed` DROP FOREIGN KEY `RefreshTokenUsed_userId_fkey`;

-- AddForeignKey
ALTER TABLE `KeyTokens` ADD CONSTRAINT `KeyTokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshTokenUsed` ADD CONSTRAINT `RefreshTokenUsed_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
