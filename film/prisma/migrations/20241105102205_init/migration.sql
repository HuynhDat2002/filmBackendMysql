-- DropIndex
DROP INDEX `Movie_name_origin_name_idx` ON `Movie`;

-- DropIndex
DROP INDEX `Movie_origin_name_idx` ON `Movie`;

-- DropIndex
DROP INDEX `TV_name_origin_name_idx` ON `TV`;

-- CreateIndex
CREATE FULLTEXT INDEX `TV_name_idx` ON `TV`(`name`);
