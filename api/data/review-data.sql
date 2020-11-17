# ************************************************************
# Sequel Pro SQL dump
# Version 5446
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: zf4nk2bcqjvif4in.cbetxkdyhwsb.us-east-1.rds.amazonaws.com (MySQL 5.7.23-log)
# Database: e79196q4jawqdlkj
# Generation Time: 2020-11-17 03:14:39 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table lecturer
# ------------------------------------------------------------

LOCK TABLES `lecturer` WRITE;
/*!40000 ALTER TABLE `lecturer` DISABLE KEYS */;

REPLACE INTO `lecturer` (`deleted_at`, `created_at`, `updated_at`, `id`, `lecturer_id`, `position`, `level`)
VALUES
	(NULL,'2020-11-15 04:47:37.986648','2020-11-15 04:47:37.986648',1,NULL,NULL,NULL),
	(NULL,'2020-11-15 04:47:37.986648','2020-11-15 04:47:37.986648',7,'0001',NULL,NULL),
	(NULL,'2020-11-15 04:47:37.986648','2020-11-15 04:47:37.986648',8,'0002',NULL,NULL),
	(NULL,'2020-11-15 04:47:37.986648','2020-11-15 04:47:37.986648',9,'0003',NULL,NULL),
	(NULL,'2020-11-15 04:47:37.986648','2020-11-15 04:47:37.986648',10,'0004',NULL,NULL),
	(NULL,'2020-11-15 04:47:37.986648','2020-11-15 04:47:37.986648',11,'0005',NULL,NULL);

/*!40000 ALTER TABLE `lecturer` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table student
# ------------------------------------------------------------

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;

REPLACE INTO `student` (`deleted_at`, `created_at`, `updated_at`, `id`, `student_id`, `school_year`, `student_class`, `is_graduate`)
VALUES
	(NULL,'2020-11-16 16:17:23.667931','2020-11-16 16:17:23.667931',2,'16110001','2016','16110CL3',1),
	(NULL,'2020-11-16 16:17:23.667931','2020-11-16 16:17:23.667931',3,'16110001','2016','16110CL3',1),
	(NULL,'2020-11-16 16:17:23.667931','2020-11-16 16:17:23.667931',4,'16110001','2016','16110CL3',1),
	(NULL,'2020-11-16 16:17:23.667931','2020-11-16 16:17:23.667931',5,'16110001','2016','16110CL3',1),
	(NULL,'2020-11-16 16:17:23.667931','2020-11-16 16:17:23.667931',6,'16110001','2016','16110CL3',1);

/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table thesis
# ------------------------------------------------------------

LOCK TABLES `thesis` WRITE;
/*!40000 ALTER TABLE `thesis` DISABLE KEYS */;

REPLACE INTO `thesis` (`deleted_at`, `created_at`, `updated_at`, `id`, `subject`, `creator_id`, `start_time`, `end_time`, `state`, `lecturer_topic_register`, `student_topic_register`, `progress_report`, `review`, `defense`, `status`)
VALUES
	(NULL,'2020-11-16 16:45:09.897852','2020-11-16 16:45:16.000000',1,'Khóa luận 1',1,'2020-11-15 17:00:00','2020-12-31 16:59:00',2,'2020-11-19 16:59:00','2020-11-22 16:59:00','2020-11-25 16:59:00','2020-11-28 16:59:00','2020-11-30 16:59:00',2);

/*!40000 ALTER TABLE `thesis` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table thesis_lecturer
# ------------------------------------------------------------

LOCK TABLES `thesis_lecturer` WRITE;
/*!40000 ALTER TABLE `thesis_lecturer` DISABLE KEYS */;

REPLACE INTO `thesis_lecturer` (`deleted_at`, `created_at`, `updated_at`, `thesis_id`, `lecturer_id`)
VALUES
	(NULL,'2020-11-16 16:45:09.909026','2020-11-16 16:45:09.909026',1,7),
	(NULL,'2020-11-16 16:45:09.925062','2020-11-16 16:45:09.925062',1,8),
	(NULL,'2020-11-16 16:45:09.932240','2020-11-16 16:45:09.932240',1,9),
	(NULL,'2020-11-16 16:45:09.938795','2020-11-16 16:45:09.938795',1,10),
	(NULL,'2020-11-16 16:45:09.945335','2020-11-16 16:45:09.945335',1,11);

/*!40000 ALTER TABLE `thesis_lecturer` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table thesis_student
# ------------------------------------------------------------

LOCK TABLES `thesis_student` WRITE;
/*!40000 ALTER TABLE `thesis_student` DISABLE KEYS */;

REPLACE INTO `thesis_student` (`deleted_at`, `created_at`, `updated_at`, `thesis_id`, `student_id`, `instructor_result`, `review_result`, `defense_result`)
VALUES
	(NULL,'2020-11-16 16:45:09.956533','2020-11-16 16:45:09.956533',1,2,NULL,NULL,NULL),
	(NULL,'2020-11-16 16:45:09.964558','2020-11-16 16:45:09.964558',1,3,NULL,NULL,NULL),
	(NULL,'2020-11-16 16:45:09.973646','2020-11-16 16:45:09.973646',1,4,NULL,NULL,NULL),
	(NULL,'2020-11-16 16:45:09.980081','2020-11-16 16:45:09.980081',1,5,NULL,NULL,NULL),
	(NULL,'2020-11-16 16:45:09.987902','2020-11-16 16:45:09.987902',1,6,NULL,NULL,NULL);

/*!40000 ALTER TABLE `thesis_student` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table topic
# ------------------------------------------------------------

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;

REPLACE INTO `topic` (`deleted_at`, `created_at`, `updated_at`, `id`, `creator_id`, `subject`, `description`, `status`, `approver_id`, `thesis_id`, `max_student`, `current_student`, `register_status`)
VALUES
	(NULL,'2020-11-16 16:46:01.883120','2020-11-16 16:46:01.883120',1,1,'Đề tài 1','Mô tả đề tài 1',1,1,1,2,0,1);

/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table topic_state
# ------------------------------------------------------------

LOCK TABLES `topic_state` WRITE;
/*!40000 ALTER TABLE `topic_state` DISABLE KEYS */;

REPLACE INTO `topic_state` (`deleted_at`, `created_at`, `updated_at`, `id`, `topic_id`, `processor_id`, `note`, `action`)
VALUES
	(NULL,'2020-11-16 16:46:01.890092','2020-11-16 16:46:01.890092',1,1,1,'[Hệ thống] Khởi tạo đề tài.',1);

/*!40000 ALTER TABLE `topic_state` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user
# ------------------------------------------------------------

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

REPLACE INTO `user` (`deleted_at`, `created_at`, `updated_at`, `id`, `username`, `password`, `firstname`, `lastname`, `gender`, `email`, `address`, `phone`, `status`, `is_admin`, `user_type`)
VALUES
	(NULL,'2020-11-15 04:47:37.976039','2020-11-15 04:47:37.976039',1,'Administrator','629bbebb26db1dc77a9e591ddef04dc9fe0d71ff','Administrator',NULL,NULL,NULL,NULL,NULL,2,2,2),
	(NULL,'2020-11-16 16:17:23.659533','2020-11-16 16:17:23.659533',2,'s1','547368310f3b25f66d02a64ba47893dc74a205b0','A','Nguyễn Văn',1,'nguyenvana@gmail.com','Phú Yên','0123456789',2,1,1),
	(NULL,'2020-11-16 16:17:23.659533','2020-11-16 16:17:23.659533',3,'s2','286f0f0ce4ce52427432ef943c1403ee2f447e79','B','Nguyễn Thị',2,'nguyenvanb@gmail.com','Phú Yên','0123456789',2,1,1),
	(NULL,'2020-11-16 16:17:23.659533','2020-11-16 16:17:23.659533',4,'s3','382b6d7a39900306d8a909d0c98929edaa284b2e','C','Nguyễn Văn',1,'nguyenvanc@gmail.com','Phú Yên','0123456789',2,1,1),
	(NULL,'2020-11-16 16:17:23.659533','2020-11-16 16:17:23.659533',5,'s4','bcae76843290f07c07554a9bf83b5ded08c20998','D','Nguyễn Thị',2,'nguyenvand@gmail.com','Phú Yên','0123456789',2,1,1),
	(NULL,'2020-11-16 16:17:23.659533','2020-11-16 16:17:23.659533',6,'s5','cdb9d5e27bf125deb473b4bacf79d4efbf53a12a','E','Nguyễn Văn',1,'nguyenvand@gmail.com','Phú Yên','0123456789',2,1,1),
	(NULL,'2020-11-16 16:17:23.659533','2020-11-16 16:17:23.659533',7,'l1','35e94edbf5023a58993bfd7cc693a28e9bb8478b','F','Nguyễn Văn',1,'nguyenvand@gmail.com','Phú Yên','0123456789',2,1,1),
	(NULL,'2020-11-16 16:17:23.659533','2020-11-16 16:17:23.659533',8,'l2','dbb6e9bb1b0abe03435c6c5096e34a4e891ad7c6','G','Nguyễn Thị',2,'nguyenvand@gmail.com','Phú Yên','0123456789',2,1,1),
	(NULL,'2020-11-16 16:17:23.659533','2020-11-16 16:17:23.659533',9,'l3','26af1643fc7e5b0fc1d918068e125e07b5cfe647','H','Nguyễn Văn',1,'nguyenvand@gmail.com','Phú Yên','0123456789',2,1,1),
	(NULL,'2020-11-16 16:17:23.659533','2020-11-16 16:17:23.659533',10,'l4','778a477847dbab9fd5084422eb53f43ddbc0ab53','I','Nguyễn Thị',2,'nguyenvand@gmail.com','Phú Yên','0123456789',2,1,1),
	(NULL,'2020-11-16 16:17:23.659533','2020-11-16 16:17:23.659533',11,'l5','20ffa5764892d6085580620442e40b3422368133','J','Nguyễn Văn',1,'nguyenvand@gmail.com','Phú Yên','0123456789',2,1,1);

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
