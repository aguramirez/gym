-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: db_gym
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cliente_rutina_ejercicios`
--

DROP TABLE IF EXISTS `cliente_rutina_ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_rutina_ejercicios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `notas` varchar(255) DEFAULT NULL,
  `reps` int NOT NULL,
  `sets` int NOT NULL,
  `cliente_rutina_dia_id` bigint DEFAULT NULL,
  `ejercicio_id` bigint NOT NULL,
  `rutina_ejercicio_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdrmvl1kxxjp924gmo68s75pst` (`cliente_rutina_dia_id`),
  KEY `FKgktmtv9mkf6g3wuqtsglwbp75` (`ejercicio_id`),
  KEY `FKs1pggmyg9lv6byu9wl1aou8ur` (`rutina_ejercicio_id`),
  CONSTRAINT `FKdrmvl1kxxjp924gmo68s75pst` FOREIGN KEY (`cliente_rutina_dia_id`) REFERENCES `cliente_rutina_dias` (`id`),
  CONSTRAINT `FKgktmtv9mkf6g3wuqtsglwbp75` FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicios` (`id`),
  CONSTRAINT `FKs1pggmyg9lv6byu9wl1aou8ur` FOREIGN KEY (`rutina_ejercicio_id`) REFERENCES `rutina_ejercicios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_rutina_ejercicios`
--

LOCK TABLES `cliente_rutina_ejercicios` WRITE;
/*!40000 ALTER TABLE `cliente_rutina_ejercicios` DISABLE KEYS */;
INSERT INTO `cliente_rutina_ejercicios` VALUES (14,'',10,4,14,7,NULL),(15,'',12,4,14,9,NULL),(16,'',8,4,15,8,NULL),(17,'dsds',10,4,16,7,NULL),(18,'',12,4,16,9,NULL),(19,'',8,4,17,8,NULL);
/*!40000 ALTER TABLE `cliente_rutina_ejercicios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-31  5:38:20
