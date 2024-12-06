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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `privateKey` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `publicKey` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `refreshToken` text COLLATE utf8mb4_unicode_ci NOT NULL,
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
INSERT INTO `KeyTokens` VALUES ('509f4b7f-4e2c-416a-bc33-12d7f3b9062f','038bdd00-109e-4e72-badf-dadca0e381de','-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCuzIlsYJrmGoqu\nVoEfdKObZ+1MB7L4cCj/Ph0qLkVWUlH4xH1yXeI1mflR6JGq4sDhj7CnaK4SrqqA\n5/V194WovI2JYgvPesYS+IlTrKrX5O3Jo8DAnZsCs5NpUvJrarUfQGItVEtGA/Sm\n/arB182OxpAdGJ7B+eaP7X+nzVf32j+DscAnbFRZmvIBS/Y4gOW/yqqM5BuoAl6Q\nc2bP0bsa9XmdPG/PcKsTq3YdtNA9vPk3oAR/qip5o50CG8RshgkTds59hHMHYzHX\n8Gr4il+8Kp2+mOsUDx1xD/KJrdjx86Nfp6kPbHGmGQJAuUKqm11tl+CtqKC2m11d\nP5ZQl/ytAgMBAAECggEAPSC1HCvqb3avscj5jc0F2/Zroy98FGpww9XucA5PXCEc\nnnDkZ8bSMSl/6Xd53Xc/uYG85sZyPYFMihjUG6VsXfZWTsl1VODb/M1ihNr4wdhC\nmcXExfc3uqme7vG9afgej+e9jZmRW1JNz8oc2X4E2h2xTyOJfU9NpF6LSlzCmx9o\n37aYq0PM2rH2Q4Vk47MSbUG43xThPh5SH1bAQscfLRUplDKX6X0a3U3nIKXpx9M3\nv2BLFvOiGVFH/7etTJ+1vIriGBoyh/BtQkQhi4nNhzyhA48p+mi6SqQ59Bc00r32\nIAeVxHjEAJk5EEbXMI368Aj/kz6jFNMoFeZWvKapBwKBgQDhXF2A+LDAyKKYhUfl\n0tf/IKi7CDytVO0PiPUdk2M4CdJssUFrhp/8yHgu3HmDhfPzSrAkRyTUEyQRpypa\n/kxUuDoiPPNp+1KP/cf3hifNRYrPHxTqCuRp5qFcZDanX20Rpep096MOn02+AHaW\ncr+9L83dsnk6jtgzKDXSvsKndwKBgQDGkGC5m4MjexcRSvYDXy/qwaVwU9DfqT9+\nwzZgw++7mghofsIZRDI4E7AcD06Kc7FerQQiELbJXkojEQBKRLkd6nJJk5LBCFLP\n9yapCHeSLZfKMpsjAMUuLvMIrh4nH5au9/+W0vTnzlgEpiHOKkA9bPdk6V3Z+7SF\noKaiVVlN+wKBgEECHPLsSkiCV+z5XYEdbjNpX2L8gExb2DqH/nU2pANxSeMSytVS\ns2n/BjQ2Y1MeW/3NiLweTbBjiR8SgrRW8PvrXNGtlWX4Gpvw0DNF3stnCSCwTZ8p\n3zPxVJDLU7y6WUMjAlwVZ1L7fziU96B0n3zagl82caQDurgfHE+buZkHAoGAb88G\nmB0oV8dM8vDZ3IYx7ifCZ6DaocakuVVk/lH2YRXYHDccRqvu90KmzPYVjMKeoqgc\nBq6Qro0Ig/xjxG40KtNELYgKf+WW9AHAZDgfVFGWAkZCsxAQ9/N56G5bDj6sU7PT\n2PLK8uhvCZceu/9wkuYT3F/H+CHSwdf3XLtggRcCgYAXEo+1gbkdRvuKDUu64RWF\nayX4+W/9mhmLBENRL73T4ckzYXWqHuR6EttbKQ8w/i/PYfwcjW21C0AzoTzKVQYx\n9cdhHx/Msb6XiZ1FiMiol60WRPTNQ8GxuTJe6LLDdIBWtuNsBsimD7M0Da74uR5T\n9fS5b3fyhoA1lJKxkAvsLg==\n-----END PRIVATE KEY-----\n','-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArsyJbGCa5hqKrlaBH3Sj\nm2ftTAey+HAo/z4dKi5FVlJR+MR9cl3iNZn5UeiRquLA4Y+wp2iuEq6qgOf1dfeF\nqLyNiWILz3rGEviJU6yq1+TtyaPAwJ2bArOTaVLya2q1H0BiLVRLRgP0pv2qwdfN\njsaQHRiewfnmj+1/p81X99o/g7HAJ2xUWZryAUv2OIDlv8qqjOQbqAJekHNmz9G7\nGvV5nTxvz3CrE6t2HbTQPbz5N6AEf6oqeaOdAhvEbIYJE3bOfYRzB2Mx1/Bq+Ipf\nvCqdvpjrFA8dcQ/yia3Y8fOjX6epD2xxphkCQLlCqptdbZfgraigtptdXT+WUJf8\nrQIDAQAB\n-----END PUBLIC KEY-----\n','eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMzhiZGQwMC0xMDllLTRlNzItYmFkZi1kYWRjYTBlMzgxZGUiLCJlbWFpbCI6ImhsdGQxMjAxQGdtYWlsLmNvbSIsImlhdCI6MTcyOTU4MzY5MywiZXhwIjoxNzMwMTg4NDkzfQ.CV-KyvYbuLpMZws327yNZlBK48wOk1NSvS-nsYbx-xfOLxrF-lSvHrb4nLv0z1Nng3ZvJqx7dEyK1UhXG5CMjG7luwziKCtL1f2h4iTr1Vuz9-q9jApyaC-UpWV0NhQT6NMUfmMPWBRbzRG3x1JxXBHwy_kPxkjkaQiT0vgh3bit49_ulhUilMO8S6eluefJRZtuFzI-ylti9OGR-or3mMVx1SRt52gSLQtOTOw7jc_EFx4SaGkHXx7TYyl7ZpJqyM5jrr2U7yZLEaTueViOCPY5gCqiHMyaCxgz0vLr0MDqn-LSHRtPldvUkC0oI-VwfR7zjzux0loyYR8p66M5mQ','2024-10-07 11:10:50.174','2024-10-22 07:54:53.192'),('7cabf8da-f0c0-4607-b881-d3ea7ed88ab9','37f6ccaf-77ed-4009-b79b-cf21d239884e','-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDruVBYZ6t8R35J\nLiakB8GgmV/AO9C7sQP8b8NrK3J7WIbkA35TKJ7QfRfRQY5rTRVqDc8cVmVjknuT\ntTg4wkFC5dXu7KJtK/3723CTsKwzrxKQh6uwOAH947W782rX1Ueu9oC4Z50Jviez\nAfzlX4M9q/m9d53QCse+0PHoItMTG8FvvEeUUw9p4P17g3eBEtDiWwsqtjJ726l8\n4tin2fnBpjxMW2u8Vo8Th4YkrwzgWuMkxqPJ3vbVoVlqXH5coh24U/9HcZp/HziG\ndJxYUhDF4e9HEX8y5vpiZ+Sdp6bgntWCu83LTYGcRYl4ZYFXIoztE6dn5+W1WFam\nANbt1COVAgMBAAECggEAJrNjV0xX+XzEZU/kLLCQT+V2dLltVO9kU+TmjNkSf+FC\nLjvLmOwVnO24xBSTBRdgAWw4eXLOzRj+3HqXeywbalgRNluX9DwRhDDcLAdI0mh3\nMA7yN2mOnCgvTWcSvtJHpVhXvE7Yl8GmQ2u7YU473ht20m5J1N78Od4UpVPYWy21\n7Nwk42uocXM2pueZQ8vzOUAxcZ8vqpIxOKtEzUwGYLs8wU4pfu0r8y/V3IrHsA6l\ng17gocrwbk2Y83CI2dRfsl5ngmA+voPJYvvPLIR1MxpkFn/E3xb3VFX1flya6YQM\ntTiqJJmBKT8BZWeyH5fslC1xUcF2aI3zhTJUGz3V2QKBgQD/PxvHCS4B7II1mk2J\nQsn5ms7/zL6qaQlRr7ZMzuNkZ8izC6ldnLmHcnVmGKOcfbLyJFoMJnbq9S2vwizF\neZqMv+4yLdKFqh3mZHZMWiTcPgLgtZmHVBo3qTBL/8IWrg09tWlqAwSLIj4TlTH+\n+yPKlZTSP20az9Cv0ULKTpbGGQKBgQDsa3OzfMdrycmhQYWtu5aBNK6CTDJmHyM3\n24hu4PSj4c/walochAl6d2jV2PWG1ly+cspw+L32Fs4IMfHRxuI/UKcvfiNdNtOn\nWcOW0inbcdfnGvHCL6l/DoeeszNQ8VAnFc1pVmlEQoeLGbyyA7lsj9jf/acSfMmM\ngFGYsSgg3QKBgB/L2MX+msCamc3bnvUOYOK7KjYrZ0ULOKH4ZZlD3IfRder39O04\nbNQ2qfFB+H+yGOyZIq6IzB+Q01QluDYRY/NMpXuSwbrs6jSdJy9zu0vEXc9oT+vP\nykRMyztsbN0uaW/afXs7TQGYDmuaFlRRLLA72gIm7Ix+ftyoEM3q5FVhAoGAPDjq\n0g+45LYUDGWaXbTpE6SNx1cNh4HrALGFQWlAJ/a/dyhAJ/9iQrXkGIUZle1I1qJ6\n+ugBy4vnk6LVTHBy9VngHHLvIzFyHLD655JFY0bOjmoIp0Ro0pqq5TwUmEu/9RTS\nrEB8tAyWZlJ6BIZ6VzMVNYlxY34yAP42ysRlymkCgYEA3LB/61mx/muqQg0HmoKl\nDRAB0Lrti3mnbX0eEdxJasfHBo2x/1fveCSHonB7DIbWRah6pVPWBNW8QTUppyoA\nlkkGxupAUp3WS8hK7xprn0K13pI6oCy/qyWWWyij7X5sW/WvTppi3YD2d8g+lNIN\n3cbzWZMRkbETBvJJAWEOdEc=\n-----END PRIVATE KEY-----\n','-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA67lQWGerfEd+SS4mpAfB\noJlfwDvQu7ED/G/Daytye1iG5AN+Uyie0H0X0UGOa00Vag3PHFZlY5J7k7U4OMJB\nQuXV7uyibSv9+9twk7CsM68SkIersDgB/eO1u/Nq19VHrvaAuGedCb4nswH85V+D\nPav5vXed0ArHvtDx6CLTExvBb7xHlFMPaeD9e4N3gRLQ4lsLKrYye9upfOLYp9n5\nwaY8TFtrvFaPE4eGJK8M4FrjJMajyd721aFZalx+XKIduFP/R3Gafx84hnScWFIQ\nxeHvRxF/Mub6Ymfknaem4J7VgrvNy02BnEWJeGWBVyKM7ROnZ+fltVhWpgDW7dQj\nlQIDAQAB\n-----END PUBLIC KEY-----\n','eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzN2Y2Y2NhZi03N2VkLTQwMDktYjc5Yi1jZjIxZDIzOTg4NGUiLCJlbWFpbCI6Imh0bGRhdDIwMDJAZ21haWwuY29tIiwiaWF0IjoxNzI4NDg5NjY1LCJleHAiOjE3MjkwOTQ0NjV9.LG4h07eZqjD94CayKtbClc9T0dYANv37oAOGwo5u_Oh9SUHgwv1KAoApe_UW9BsLh3zBvuDA5WjBt0ug9yGTn9rX5bUaSAxH0TJCSNU0voj8rM03fKofUkbxgZVMhtmE8PLVuzbZ6LGFbQ0pN17E0P-5n1F4UKh0fnMwk9_DpWh0gymijQdSQbrA8rjlamRMHBZ1cW_LmX-hdE0Yvx-4nuy2pkluoqA9GBaLieS90fDInKv2KT_LPo0wN6NRQP2FRuCG8QpZIANm_vPyrwJDtqkY5hoRq6kvLgGKlKwu6dk8-aTXczV5yKpOzx-NZ25LuwiYfUl_zgkf7bWXFDZMTg','2024-10-07 11:01:17.079','2024-10-09 16:01:05.083');
/*!40000 ALTER TABLE `KeyTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OTP`
--

DROP TABLE IF EXISTS `OTP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OTP` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refreshToken` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `status` enum('Active','Inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
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

-- Dump completed on 2024-10-22 15:54:51
