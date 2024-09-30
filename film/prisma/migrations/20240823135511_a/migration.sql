-- CreateTable
CREATE TABLE `Actor` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Actor_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActorOnFilm` (
    `id` VARCHAR(36) NOT NULL,
    `actorId` VARCHAR(36) NOT NULL,
    `filmId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Director` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Director_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DirectorOnFilm` (
    `id` VARCHAR(36) NOT NULL,
    `directorId` VARCHAR(36) NOT NULL,
    `filmId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryOnFilm` (
    `id` VARCHAR(36) NOT NULL,
    `categoryId` VARCHAR(36) NOT NULL,
    `filmId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Country_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CountryOnFilm` (
    `id` VARCHAR(36) NOT NULL,
    `countryId` VARCHAR(36) NOT NULL,
    `filmId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movie` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `origin_name` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `poster_url` VARCHAR(191) NOT NULL,
    `thumb_url` VARCHAR(191) NOT NULL,
    `trailer` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `lang` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `view` INTEGER NOT NULL DEFAULT 0,
    `quality` VARCHAR(191) NOT NULL,
    `episode_current` VARCHAR(191) NOT NULL,
    `video` VARCHAR(191) NOT NULL DEFAULT '',
    `type` VARCHAR(191) NOT NULL DEFAULT 'movie',
    `rating` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TV` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `origin_name` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `poster_url` VARCHAR(191) NOT NULL,
    `thumb_url` VARCHAR(191) NOT NULL,
    `trailer` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `lang` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `view` INTEGER NOT NULL,
    `quality` VARCHAR(191) NOT NULL,
    `episode_current` VARCHAR(191) NOT NULL,
    `episode_total` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'tv',
    `rating` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Episodes` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `video` VARCHAR(191) NOT NULL,
    `tvId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRatings` (
    `userId` VARCHAR(36) NOT NULL,
    `rating` INTEGER NOT NULL,
    `ratingFilmId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rating` (
    `id` VARCHAR(36) NOT NULL,
    `ratingAverage` INTEGER NOT NULL DEFAULT 0,
    `filmId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommentUser` (
    `userId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `commentId` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `CommentUser_email_key`(`email`),
    UNIQUE INDEX `CommentUser_commentId_key`(`commentId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(36) NOT NULL,
    `comment_filmId` VARCHAR(36) NOT NULL,
    `comment_content` TEXT NOT NULL,
    `comment_left` INTEGER NOT NULL DEFAULT 0,
    `comment_right` INTEGER NOT NULL DEFAULT 0,
    `comment_parentId` VARCHAR(36) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ActorOnFilm` ADD CONSTRAINT `ActorOnFilm_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `Actor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActorOnFilm` ADD CONSTRAINT `actor_movieId_fkey` FOREIGN KEY (`filmId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActorOnFilm` ADD CONSTRAINT `actor_tvId_fkey` FOREIGN KEY (`filmId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnFilm` ADD CONSTRAINT `DirectorOnFilm_directorId_fkey` FOREIGN KEY (`directorId`) REFERENCES `Director`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnFilm` ADD CONSTRAINT `director_movieId_fkey` FOREIGN KEY (`filmId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectorOnFilm` ADD CONSTRAINT `director_tvId_fkey` FOREIGN KEY (`filmId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnFilm` ADD CONSTRAINT `CategoryOnFilm_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnFilm` ADD CONSTRAINT `category_movieId_fkey` FOREIGN KEY (`filmId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnFilm` ADD CONSTRAINT `category_tvId_fkey` FOREIGN KEY (`filmId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnFilm` ADD CONSTRAINT `CountryOnFilm_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnFilm` ADD CONSTRAINT `country_movieId_fkey` FOREIGN KEY (`filmId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryOnFilm` ADD CONSTRAINT `country_tvId_fkey` FOREIGN KEY (`filmId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Episodes` ADD CONSTRAINT `Episodes_tvId_fkey` FOREIGN KEY (`tvId`) REFERENCES `TV`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRatings` ADD CONSTRAINT `UserRatings_ratingFilmId_fkey` FOREIGN KEY (`ratingFilmId`) REFERENCES `Rating`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentUser` ADD CONSTRAINT `CommentUser_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
