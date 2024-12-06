-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: userdb
-- ------------------------------------------------------
-- Server version	8.4.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `KeyTokens`
--

DROP TABLE IF EXISTS `KeyTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KeyTokens` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `privateKey` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `publicKey` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `refreshToken` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `KeyTokens_userId_key` (`userId`),
  CONSTRAINT `KeyTokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `KeyTokens`
--

LOCK TABLES `KeyTokens` WRITE;
/*!40000 ALTER TABLE `KeyTokens` DISABLE KEYS */;
INSERT INTO `KeyTokens` VALUES ('772910a6-109d-43ca-9932-c54460faaf6a','038bdd00-109e-4e72-badf-dadca0e381de','-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBJJ0a+cHwDcah\nY0I/Y0tZXJraaLQuW7repmks6627hb/rWG972GJPzf39BxGbTLAq9/E3vSBBEeuK\nyDJqmmLBdTVFC7ISOxP0v3bkhPkBUwhXCoIV/UnGx31qth8lhKka9GarK970qHa+\ndVGgJhIFZYbeYdCtJvFTX/Mw1l8sUNBlMMPQVt/SIphFWZn4uIPD/UgD1xWG4F38\n62vHf7q1e7jFpSDbpyMV2/r6heJLAuuWlFwFWN9hg83T91bmQnIumLtWFKQe7gmN\nCqW/GO8EKBgTQneWG0zvQipmdFzj0JQ9/0MHJYKbeQPxfCipxBoYxk7gNyZvzSR7\nr0cziGYpAgMBAAECggEAAOobXYWhz73cKAB2nFYFuDV/I2b/T2bhlbmw+5fEE1Ef\nTWepfRGGgz04JVemuco23VIEnN0/rVjLeWhx2kP2RFc5oNf2bsd3B5+7QHq9GRU1\nD8091dY34E6Q5Y2MmTQtfsvgccTVgemlFXxfUURM4PF2axzu2YFt/0iP6xyT7i6t\nPzZRDa+4LdqhYOqrBcRMnGltAAWD+8u+fKlHRIr7ryJ7pDCKtBMqLykJjG+/EkZp\nzqQvIB8MMfLEdPXblJJhGhDLU04do0lWwXmG8XlYLXcbRqu0yx546/AP3+6TaYP1\nhKHotZW8j49iWWICumGdaYDKaKniZTsiugL2+OzbJwKBgQD/qFBEzR91YVF5Kcox\nkJwHVm8pay4blihCL5VN/SPjgBe1Z51exPcNfGAeGdc98ENciIz+hQhAygrRmugM\nmXlEr6XXmd+dpkpP9NnOCJQXsGE+EpfWAyqmfdMzlhvz2pfwDpP0vbyAL01kUQW7\nCSdLrHpW3S2ErkjrcH0SrF5nKwKBgQDBZtvSaxt5+QSTOt88fM0OXNwSrVrYBeYo\ngLjDbzxis+Q9ORV1g515EyefRWt61sJ2AxA4Xxba/FHLB4wUkUt33+P24DnbfIlK\nNQn4TMNVi6SUZAMaARtaHxxz+Pn+NGSWKsbY5KOMHoADpR2l+2kVcP87s0PUJrgm\nm2onayw9+wKBgQDtnZJ9X+kNQBZpdt3mk3FxoHRRGr0QBtAENBWhFtZ0bGmcwWES\n5B56+k6bq4jSmK0DJCdnqF2zWhYUGtXyX/LGVDrf2LRt4lDPX9PQG0kJe3XmK4HT\n9718YRYbrDjuvQzaobIClxbMTSqxQl0BKdDMFNLgSVI1L4e2zCZzZKGZYQKBgEH9\nsOAZf+ScnX0HR4jCJM3TzZvp3ud7C8+iLGkzGW2saCKjybixUhgv+wMTktr1UKEn\n5m71szzBf79BMgEKmq+qi4R/ef50ffv+IQrCVpxn655eidhjrEuR9gl0WQjuI6xB\nqFv1mACFn7SesIEkSfTw+4YJYwmOtKMnwI72uL/lAoGBAJGhPPRy0eMjRmEvGHKz\n/o65LF13CTN35x9m4QEeDoqXGbm2Tw/FBnvu5DkxaEe3ii1ZrTUxoJHVJYCCK/U5\nnAElg6aNDB1i+wxHYWwJK9KNzKEqtNbVf3CaKdwpMG+al5AqoEdYRZAEM57IpaUt\n86LEpI1H56gSDGvQFqF8j3tS\n-----END PRIVATE KEY-----\n','-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwSSdGvnB8A3GoWNCP2NL\nWVya2mi0Llu63qZpLOutu4W/61hve9hiT839/QcRm0ywKvfxN70gQRHrisgyappi\nwXU1RQuyEjsT9L925IT5AVMIVwqCFf1Jxsd9arYfJYSpGvRmqyve9Kh2vnVRoCYS\nBWWG3mHQrSbxU1/zMNZfLFDQZTDD0Fbf0iKYRVmZ+LiDw/1IA9cVhuBd/Otrx3+6\ntXu4xaUg26cjFdv6+oXiSwLrlpRcBVjfYYPN0/dW5kJyLpi7VhSkHu4JjQqlvxjv\nBCgYE0J3lhtM70IqZnRc49CUPf9DByWCm3kD8XwoqcQaGMZO4Dcmb80ke69HM4hm\nKQIDAQAB\n-----END PUBLIC KEY-----\n','eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMzhiZGQwMC0xMDllLTRlNzItYmFkZi1kYWRjYTBlMzgxZGUiLCJlbWFpbCI6ImhsdGQxMjAxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzMwMzQ4NDk2LCJleHAiOjE3MzA5NTMyOTZ9.d1pWQBl5PaI9sBXHmvGpU5bwdCpVPUV3vo5c_wNGFO518LkAc-caohlMtEVZ6M3jz4ZmPWyqpN9r_0Ba5MPLwaJsmrVT1FwVllrX4rwHUxnaMLSbLIczqxgYs86ZHKhEGj35ND_zw57pPlxb6gDoI_V01ta333Z21xbbAfnNuPheP-Ky6pOp6RbBlTm9muF47-TJTuhONEmhqko8X3W7MUlTyrGcnuqP9T7xwn9Ei2Jw9R0sgqXYZ4_t4zdTNq1IV9hSVftdGSXx-KOEd83faQBVn1n-pfnMQCyNCCl95i-M0bh8hU70skpbnZt8WFRpHzOzNsF6NUrzC3UL5_7cpw','2024-10-31 04:07:56.136','2024-10-31 04:21:36.538');
/*!40000 ALTER TABLE `KeyTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OTP`
--

DROP TABLE IF EXISTS `OTP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OTP` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `OTP_email_key` (`email`),
  UNIQUE KEY `OTP_otp_key` (`otp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OTP`
--

LOCK TABLES `OTP` WRITE;
/*!40000 ALTER TABLE `OTP` DISABLE KEYS */;
/*!40000 ALTER TABLE `OTP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RefreshTokenUsed`
--

DROP TABLE IF EXISTS `RefreshTokenUsed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RefreshTokenUsed` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `refreshToken` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `RefreshTokenUsed_userId_fkey` (`userId`),
  CONSTRAINT `RefreshTokenUsed_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RefreshTokenUsed`
--

LOCK TABLES `RefreshTokenUsed` WRITE;
/*!40000 ALTER TABLE `RefreshTokenUsed` DISABLE KEYS */;
/*!40000 ALTER TABLE `RefreshTokenUsed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('USER','ADMIN') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `status` enum('Active','Inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('038bdd00-109e-4e72-badf-dadca0e381de','tdat','hltd1201@gmail.com','$2b$10$IdVbn9P5MDyffg8HFJ2sYOHZTDdxouvdvO5ASuO.BJkmz6OejXt5u','USER','Active','2024-09-25 09:15:12.663','2024-09-25 09:15:12.663'),('37f6ccaf-77ed-4009-b79b-cf21d239884e','test','htldat2002@gmail.com','Abc@12345678','ADMIN','Active','2024-10-07 11:01:16.420','2024-10-07 11:01:16.420');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserAgent`
--

DROP TABLE IF EXISTS `UserAgent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserAgent` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agent` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserAgent_agent_key` (`agent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserAgent`
--

LOCK TABLES `UserAgent` WRITE;
/*!40000 ALTER TABLE `UserAgent` DISABLE KEYS */;
INSERT INTO `UserAgent` VALUES ('c4b905c0-fef5-41bc-af79-0e0eb0561ccc','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'),('ccef5016-b309-49d3-8de4-185627dfb301','PostmanRuntime/7.42.0');
/*!40000 ALTER TABLE `UserAgent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserOnAgent`
--

DROP TABLE IF EXISTS `UserOnAgent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserOnAgent` (
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agentId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`userId`,`agentId`),
  KEY `UserOnAgent_agentId_fkey` (`agentId`),
  CONSTRAINT `UserOnAgent_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `UserAgent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserOnAgent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserOnAgent`
--

LOCK TABLES `UserOnAgent` WRITE;
/*!40000 ALTER TABLE `UserOnAgent` DISABLE KEYS */;
INSERT INTO `UserOnAgent` VALUES ('038bdd00-109e-4e72-badf-dadca0e381de','c4b905c0-fef5-41bc-af79-0e0eb0561ccc'),('038bdd00-109e-4e72-badf-dadca0e381de','ccef5016-b309-49d3-8de4-185627dfb301');
/*!40000 ALTER TABLE `UserOnAgent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('0f98915e-99f4-4385-b5f0-5d9a60b2d2ad','8cbbfa3c731bcef910221b83ec99ba7a851f3934d608251c0704724800a1d328','2024-09-25 14:51:34.882','20240925145134_init',NULL,NULL,'2024-09-25 14:51:34.810',1),('1f711a48-e09b-49a7-a24d-4c30c47393d7','5158a3c9eaea0a1976ffaebde18de44901ad3b1999c0ea0a0e463cc3d6a4e4c3','2024-09-25 03:35:02.150','20240925033501_init',NULL,NULL,'2024-09-25 03:35:01.587',1),('25f8044e-ee2b-4262-bee3-a846f6972002','b3fc8a1627cd28a47085f1a2ab30b486bf8ccb9fc4440ca9ac5e6608e5a74ff7',NULL,'20241022081544_init','A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20241022081544_init\n\nDatabase error code: 1101\n\nDatabase error:\nBLOB, TEXT, GEOMETRY or JSON column \'rol_description\' can\'t have a default value\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20241022081544_init\"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name=\"20241022081544_init\"\n             at schema-engine/core/src/commands/apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:226',NULL,'2024-10-22 08:15:44.498',0),('288646eb-2499-4102-b439-b295f3c2a5e9','03f3de71e955b0a79ee240f2b004ca597a29bf0d3207d703957646e212934dfa','2024-09-25 03:34:57.083','20240816054143_init',NULL,NULL,'2024-09-25 03:34:56.991',1),('68e7b570-54dc-4033-8076-31b3f5d1aa96','fee063664e49d436d70d9f8f685440df5fa5eddaa04f1ed267c5b8f58ba3f7fd','2024-09-25 03:34:56.982','20240816052313_init',NULL,NULL,'2024-09-25 03:34:56.881',1),('7781b6c8-94ce-4951-93ed-62d3c703329d','1258693ebad71625b78611ffeb0df62244c937bf03e30ad90cb937b06d31a5ad','2024-09-25 03:34:57.351','20240819035557_init',NULL,NULL,'2024-09-25 03:34:57.299',1),('a4c784a9-a8d2-4103-8d2c-4ed5ac180222','e5a749b6f045e9f82bf2c0049354ae40835e298f0221d35f7f4fd97f4ddefc08','2024-09-25 03:34:57.481','20240827150434_init',NULL,NULL,'2024-09-25 03:34:57.421',1),('afb7827f-62dc-4e90-82e0-106c8155cc60','f839bd3ff534eb7a6ea385b9bb53fc013bf5ee9c56f3f67cae86cb2732ab7959','2024-09-25 03:34:56.872','20240816052226_init',NULL,NULL,'2024-09-25 03:34:56.784',1),('b4f037dc-9193-453e-8d1f-1984d06e0769','16f0ce2e6d6c48ab79f2dfdbb4c8c290d5babf9e790097c8b03a5c054f7c2fdc','2024-09-25 03:34:56.776','20240816045043_init',NULL,NULL,'2024-09-25 03:34:55.603',1),('e92bc489-f3ca-435b-aa75-303817b414e7','788b4a24a331d3c603bf8c89544a2a2a6ad74b964d8f9239687e8e40acc5c82d','2024-09-25 03:34:57.289','20240817030326_init',NULL,NULL,'2024-09-25 03:34:57.092',1),('fe879e46-9ddd-47df-bfeb-007de92bd6f3','5838617359d5258d7d8d3ef0de57f8143ffed856c8c0bacb8db97ea7f7e42f0b','2024-09-25 03:34:57.412','20240819035944_init',NULL,NULL,'2024-09-25 03:34:57.360',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-31 15:29:53
