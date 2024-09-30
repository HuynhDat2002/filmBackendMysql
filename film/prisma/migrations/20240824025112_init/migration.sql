-- CreateIndex
CREATE FULLTEXT INDEX `Movie_name_idx` ON `Movie`(`name`);

-- CreateIndex
CREATE FULLTEXT INDEX `Movie_origin_name_idx` ON `Movie`(`origin_name`);
