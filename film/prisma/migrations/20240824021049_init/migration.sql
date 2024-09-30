-- CreateIndex
CREATE FULLTEXT INDEX `Movie_name_origin_name_idx` ON `Movie`(`name`, `origin_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `TV_name_origin_name_idx` ON `TV`(`name`, `origin_name`);
