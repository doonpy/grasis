SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION;
SET NAMES utf8;
SET NAMES utf8mb4;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0;

LOCK TABLES lecturer WRITE;
ALTER TABLE lecturer
    DISABLE KEYS;

REPLACE INTO lecturer (deleted_at, created_at, updated_at, id, lecturer_id, position, level)
VALUES (NULL, DEFAULT, DEFAULT, 1, NULL, NULL, NULL),
       (NULL, DEFAULT, DEFAULT, 7, '0001', NULL, NULL),
       (NULL, DEFAULT, DEFAULT, 8, '0002', NULL, NULL),
       (NULL, DEFAULT, DEFAULT, 9, '0003', NULL, NULL),
       (NULL, DEFAULT, DEFAULT, 10, '0004', NULL, NULL),
       (NULL, DEFAULT, DEFAULT, 11, '0005', NULL, NULL);

ALTER TABLE lecturer
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES student WRITE;
ALTER TABLE student
    DISABLE KEYS;

REPLACE INTO student (deleted_at, created_at, updated_at, id, student_id, school_year, student_class, is_graduate)
VALUES (NULL, DEFAULT, DEFAULT, 2, '16110001', '2016', '16110CL3', 1),
       (NULL, DEFAULT, DEFAULT, 3, '16110001', '2016', '16110CL3', 1),
       (NULL, DEFAULT, DEFAULT, 4, '16110001', '2016', '16110CL3', 1),
       (NULL, DEFAULT, DEFAULT, 5, '16110001', '2016', '16110CL3', 1),
       (NULL, DEFAULT, DEFAULT, 6, '16110001', '2016', '16110CL3', 1);

ALTER TABLE student
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES thesis WRITE;
ALTER TABLE thesis
    DISABLE KEYS;

REPLACE INTO thesis (deleted_at, created_at, updated_at, id, subject, creator_id, start_time, end_time, state,
                     lecturer_topic_register, student_topic_register, progress_report, review, defense, status)
VALUES (NULL, DEFAULT, DEFAULT, 1, 'Khóa luận 1', 1, '2020-10-01 17:00:00',
        '2020-12-31 16:59:00', 2, '2020-11-19 16:59:00', '2020-11-22 16:59:00', '2020-11-25 16:59:00',
        '2020-11-28 16:59:00', '2020-11-30 16:59:00', 2);

ALTER TABLE thesis
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES thesis_lecturer WRITE;
ALTER TABLE thesis_lecturer
    DISABLE KEYS;

REPLACE INTO thesis_lecturer (deleted_at, created_at, updated_at, thesis_id, lecturer_id)
VALUES (NULL, DEFAULT, DEFAULT, 1, 7),
       (NULL, DEFAULT, DEFAULT, 1, 8),
       (NULL, DEFAULT, DEFAULT, 1, 9),
       (NULL, DEFAULT, DEFAULT, 1, 10),
       (NULL, DEFAULT, DEFAULT, 1, 11);

ALTER TABLE thesis_lecturer
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES thesis_student WRITE;
ALTER TABLE thesis_student
    DISABLE KEYS;

REPLACE INTO thesis_student (deleted_at, created_at, updated_at, thesis_id, student_id)
VALUES (NULL, DEFAULT, DEFAULT, 1, 2),
       (NULL, DEFAULT, DEFAULT, 1, 3),
       (NULL, DEFAULT, DEFAULT, 1, 4),
       (NULL, DEFAULT, DEFAULT, 1, 5),
       (NULL, DEFAULT, DEFAULT, 1, 6);

ALTER TABLE thesis_student
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES topic WRITE;
ALTER TABLE topic
    DISABLE KEYS;

REPLACE INTO topic (deleted_at, created_at, updated_at, id, creator_id, subject, description, status, approver_id,
                    thesis_id, max_student, current_student, register_status)
VALUES (NULL, DEFAULT, DEFAULT, 1, 7, 'Đề tài 1', 'Mô tả đề tài 1', 1, 1, 1,
        2, 0, 1),
       (NULL, DEFAULT, DEFAULT, 2, 8, 'Đề tài 2', 'Mô tả đề tài 2', 1, 1, 1,
        2, 0, 1),
       (NULL, DEFAULT, DEFAULT, 3, 9, 'Đề tài 3', 'Mô tả đề tài 3', 1, 1, 1,
        2, 0, 1),
       (NULL, DEFAULT, DEFAULT, 4, 10, 'Đề tài 4', 'Mô tả đề tài 4', 1, 1, 1,
        2, 0, 1),
       (NULL, DEFAULT, DEFAULT, 5, 11, 'Đề tài 5', 'Mô tả đề tài 5', 1, 1, 1,
        2, 0, 1);


ALTER TABLE topic
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES topic_state WRITE;
ALTER TABLE topic_state
    DISABLE KEYS;

REPLACE INTO topic_state (deleted_at, created_at, updated_at, id, topic_id, processor_id, note, action)
VALUES (NULL, DEFAULT, DEFAULT, 1, 1, 1, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 2, 2, 1, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 3, 3, 1, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 4, 4, 1, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 5, 5, 1, '[Hệ thống] Khởi tạo đề tài.', 1);

ALTER TABLE topic_state
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES user WRITE;
ALTER TABLE user
    DISABLE KEYS;

REPLACE INTO user (deleted_at, created_at, updated_at, id, username, password, firstname, lastname, gender, email,
                   address, phone, status, is_admin, user_type)
VALUES (NULL, DEFAULT, DEFAULT, 1, 'Administrator',
        '629bbebb26db1dc77a9e591ddef04dc9fe0d71ff', 'Administrator', NULL, NULL, NULL, NULL, NULL, 2, 2, 2),
       (NULL, DEFAULT, DEFAULT, 2, 's1',
        '547368310f3b25f66d02a64ba47893dc74a205b0', 'A', 'Nguyễn Văn', 1, 'nguyenvana@gmail.com', 'Phú Yên',
        '0123456789', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 3, 's2',
        '286f0f0ce4ce52427432ef943c1403ee2f447e79', 'B', 'Nguyễn Thị', 2, 'nguyenvanb@gmail.com', 'Phú Yên',
        '0123456789', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 4, 's3',
        '382b6d7a39900306d8a909d0c98929edaa284b2e', 'C', 'Nguyễn Văn', 1, 'nguyenvanc@gmail.com', 'Phú Yên',
        '0123456789', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 5, 's4',
        'bcae76843290f07c07554a9bf83b5ded08c20998', 'D', 'Nguyễn Thị', 2, 'nguyenvand@gmail.com', 'Phú Yên',
        '0123456789', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 6, 's5',
        'cdb9d5e27bf125deb473b4bacf79d4efbf53a12a', 'E', 'Nguyễn Văn', 1, 'nguyenvand@gmail.com', 'Phú Yên',
        '0123456789', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 7, 'l1',
        '35e94edbf5023a58993bfd7cc693a28e9bb8478b', 'F', 'Nguyễn Văn', 1, 'nguyenvand@gmail.com', 'Phú Yên',
        '0123456789', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 8, 'l2',
        'dbb6e9bb1b0abe03435c6c5096e34a4e891ad7c6', 'G', 'Nguyễn Thị', 2, 'nguyenvand@gmail.com', 'Phú Yên',
        '0123456789', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 9, 'l3',
        '26af1643fc7e5b0fc1d918068e125e07b5cfe647', 'H', 'Nguyễn Văn', 1, 'nguyenvand@gmail.com', 'Phú Yên',
        '0123456789', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 10, 'l4',
        '778a477847dbab9fd5084422eb53f43ddbc0ab53', 'I', 'Nguyễn Thị', 2, 'nguyenvand@gmail.com', 'Phú Yên',
        '0123456789', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 11, 'l5',
        '20ffa5764892d6085580620442e40b3422368133', 'J', 'Nguyễn Văn', 1, 'nguyenvand@gmail.com', 'Phú Yên',
        '0123456789', 2, 1, 2);

ALTER TABLE user
    ENABLE KEYS;
UNLOCK TABLES;

SET SQL_NOTES = @OLD_SQL_NOTES;
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION;
