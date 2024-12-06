-- CreateTable
CREATE TABLE `UserLogin` (
    `id` VARCHAR(36) NOT NULL,
    `user` TEXT NOT NULL,
    `keyToken` TEXT NOT NULL,
    `agent` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
