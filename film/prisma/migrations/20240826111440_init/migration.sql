-- DropForeignKey
ALTER TABLE `ActorOnMovie` DROP FOREIGN KEY `ActorOnMovie_actorId_fkey`;

-- DropForeignKey
ALTER TABLE `ActorOnMovie` DROP FOREIGN KEY `ActorOnMovie_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `ActorOnTV` DROP FOREIGN KEY `ActorOnTV_actorId_fkey`;

-- DropForeignKey
ALTER TABLE `ActorOnTV` DROP FOREIGN KEY `ActorOnTV_tvId_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryOnMovie` DROP FOREIGN KEY `CategoryOnMovie_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryOnMovie` DROP FOREIGN KEY `CategoryOnMovie_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryOnTV` DROP FOREIGN KEY `CategoryOnTV_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryOnTV` DROP FOREIGN KEY `CategoryOnTV_tvId_fkey`;

-- DropForeignKey
ALTER TABLE `CommentUser` DROP FOREIGN KEY `CommentUser_commentId_fkey`;

-- DropForeignKey
ALTER TABLE `CountryOnMovie` DROP FOREIGN KEY `CountryOnMovie_countryId_fkey`;

-- DropForeignKey
ALTER TABLE `CountryOnMovie` DROP FOREIGN KEY `CountryOnMovie_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `CountryOnTV` DROP FOREIGN KEY `CountryOnTV_countryId_fkey`;

-- DropForeignKey
ALTER TABLE `CountryOnTV` DROP FOREIGN KEY `CountryOnTV_tvId_fkey`;

-- DropForeignKey
ALTER TABLE `DirectorOnMovie` DROP FOREIGN KEY `DirectorOnMovie_directorId_fkey`;

-- DropForeignKey
ALTER TABLE `DirectorOnMovie` DROP FOREIGN KEY `DirectorOnMovie_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `DirectorOnTV` DROP FOREIGN KEY `DirectorOnTV_directorId_fkey`;

-- DropForeignKey
ALTER TABLE `DirectorOnTV` DROP FOREIGN KEY `DirectorOnTV_tvId_fkey`;

-- DropForeignKey
ALTER TABLE `Episodes` DROP FOREIGN KEY `Episodes_tvId_fkey`;

-- DropForeignKey
ALTER TABLE `Rating` DROP FOREIGN KEY `Rating_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `Rating` DROP FOREIGN KEY `Rating_tvId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRatings` DROP FOREIGN KEY `UserRatings_ratingFilmId_fkey`;

-- AddForeignKey
ALTER TABLE `ActorOnMovie` ADD CONSTRAINT `ActorOnMovie_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `Actor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActorOnMovie` ADD CONSTRAINT `ActorOnMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActorOnTV` ADD CONSTRAINT `ActorOnTV_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `Actor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActorOnTV` ADD CONSTRAINT `ActorOnTV_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnMovie` ADD CONSTRAINT `DirectorOnMovie_directorId_fkey` FOREIGN KEY (`directorId`) REFERENCES `Director`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnMovie` ADD CONSTRAINT `DirectorOnMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnTV` ADD CONSTRAINT `DirectorOnTV_directorId_fkey` FOREIGN KEY (`directorId`) REFERENCES `Director`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnTV` ADD CONSTRAINT `DirectorOnTV_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnMovie` ADD CONSTRAINT `CategoryOnMovie_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnMovie` ADD CONSTRAINT `CategoryOnMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnTV` ADD CONSTRAINT `CategoryOnTV_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnTV` ADD CONSTRAINT `CategoryOnTV_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnMovie` ADD CONSTRAINT `CountryOnMovie_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnMovie` ADD CONSTRAINT `CountryOnMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnTV` ADD CONSTRAINT `CountryOnTV_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnTV` ADD CONSTRAINT `CountryOnTV_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Episodes` ADD CONSTRAINT `Episodes_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRatings` ADD CONSTRAINT `UserRatings_ratingFilmId_fkey` FOREIGN KEY (`ratingFilmId`) REFERENCES `Rating`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentUser` ADD CONSTRAINT `CommentUser_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
