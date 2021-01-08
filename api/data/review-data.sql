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
TRUNCATE TABLE lecturer;

REPLACE INTO lecturer (deleted_at, created_at, updated_at, id, lecturer_id, position, level)
VALUES (NULL, DEFAULT, DEFAULT, 1, '2148', 'Trưởng ngành', NULL),
       (NULL, DEFAULT, DEFAULT, 45, '0132', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 46, '0525', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 47, '0000', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 48, '0640', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 49, '0001', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 50, '9116', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 51, '9153', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 52, '3995', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 53, '0133', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 54, '2150', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 55, '4124', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 56, '0002', 'Giảng viên', NULL),
       (NULL, DEFAULT, DEFAULT, 57, '0003', 'Giảng viên', NULL);

ALTER TABLE lecturer
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES student WRITE;
ALTER TABLE student
    DISABLE KEYS;
TRUNCATE TABLE student;

REPLACE INTO student (deleted_at, created_at, updated_at, id, student_id, school_year, student_class, is_graduate)
VALUES (NULL, DEFAULT, DEFAULT, 2, '16110226', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 3, '16110093', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 4, '16110227', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 5, '16110201', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 6, '16110004', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 7, '16110131', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 8, '16110104', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 9, '16110229', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 10, '15110036', '2015', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 11, '15110038', '2015', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 12, '16110186', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 13, '15110103', '2015', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 14, '15110096', '2015', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 15, '16110189', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 16, '16110195', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 17, '16110044', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 18, '16110121', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 19, '16110028', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 20, '16110056', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 21, '16110119', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 22, '16110142', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 23, '16110048', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 24, '16110105', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 25, '16110206', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 26, '16110236', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 27, '16119001', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 28, '16110094', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 29, '16110068', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 30, '16110573', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 31, '16110581', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 32, '16110171', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 33, '16110083', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 34, '15119154', '2015', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 35, '16110032', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 36, '16110030', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 37, '16110555', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 38, '16110064', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 39, '16110150', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 40, '16110015', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 41, '16110001', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 42, '16110045', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 43, '16110153', '2016', NULL, 1),
       (NULL, DEFAULT, DEFAULT, 44, '15110013', '2015', NULL, 1);

ALTER TABLE student
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES thesis WRITE;
ALTER TABLE thesis
    DISABLE KEYS;
TRUNCATE TABLE thesis;

REPLACE INTO thesis (deleted_at, created_at, updated_at, id, subject, creator_id, start_time, end_time, state,
                     lecturer_topic_register, student_topic_register, progress_report, review, defense, status)
VALUES (NULL, DEFAULT, DEFAULT, 1, 'KHÓA LUẬN TỐT NGHIỆP HK1 2020-2021', 1, '2020-08-24 17:00:00',
        '2021-01-16 16:59:00', 5, '2020-08-31 16:59:00', '2020-09-12 16:59:00', '2020-11-28 16:59:00',
        '2021-01-07 16:59:00', '2021-01-09 16:59:00', 2);

ALTER TABLE thesis
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES thesis_lecturer WRITE;
ALTER TABLE thesis_lecturer
    DISABLE KEYS;
TRUNCATE TABLE thesis_lecturer;

REPLACE INTO thesis_lecturer (deleted_at, created_at, updated_at, thesis_id, lecturer_id)
VALUES (NULL, DEFAULT, DEFAULT, 1, 1),
       (NULL, DEFAULT, DEFAULT, 1, 45),
       (NULL, DEFAULT, DEFAULT, 1, 46),
       (NULL, DEFAULT, DEFAULT, 1, 47),
       (NULL, DEFAULT, DEFAULT, 1, 48),
       (NULL, DEFAULT, DEFAULT, 1, 49),
       (NULL, DEFAULT, DEFAULT, 1, 50),
       (NULL, DEFAULT, DEFAULT, 1, 51),
       (NULL, DEFAULT, DEFAULT, 1, 52),
       (NULL, DEFAULT, DEFAULT, 1, 53),
       (NULL, DEFAULT, DEFAULT, 1, 54),
       (NULL, DEFAULT, DEFAULT, 1, 55),
       (NULL, DEFAULT, DEFAULT, 1, 56),
       (NULL, DEFAULT, DEFAULT, 1, 57);

ALTER TABLE thesis_lecturer
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES thesis_student WRITE;
ALTER TABLE thesis_student
    DISABLE KEYS;
TRUNCATE TABLE thesis_student;

REPLACE INTO thesis_student (deleted_at, created_at, updated_at, thesis_id, student_id)
VALUES (NULL, DEFAULT, DEFAULT, 1, 2),
       (NULL, DEFAULT, DEFAULT, 1, 3),
       (NULL, DEFAULT, DEFAULT, 1, 4),
       (NULL, DEFAULT, DEFAULT, 1, 5),
       (NULL, DEFAULT, DEFAULT, 1, 6),
       (NULL, DEFAULT, DEFAULT, 1, 7),
       (NULL, DEFAULT, DEFAULT, 1, 8),
       (NULL, DEFAULT, DEFAULT, 1, 9),
       (NULL, DEFAULT, DEFAULT, 1, 10),
       (NULL, DEFAULT, DEFAULT, 1, 11),
       (NULL, DEFAULT, DEFAULT, 1, 12),
       (NULL, DEFAULT, DEFAULT, 1, 13),
       (NULL, DEFAULT, DEFAULT, 1, 14),
       (NULL, DEFAULT, DEFAULT, 1, 15),
       (NULL, DEFAULT, DEFAULT, 1, 16),
       (NULL, DEFAULT, DEFAULT, 1, 17),
       (NULL, DEFAULT, DEFAULT, 1, 18),
       (NULL, DEFAULT, DEFAULT, 1, 19),
       (NULL, DEFAULT, DEFAULT, 1, 20),
       (NULL, DEFAULT, DEFAULT, 1, 21),
       (NULL, DEFAULT, DEFAULT, 1, 22),
       (NULL, DEFAULT, DEFAULT, 1, 23),
       (NULL, DEFAULT, DEFAULT, 1, 24),
       (NULL, DEFAULT, DEFAULT, 1, 25),
       (NULL, DEFAULT, DEFAULT, 1, 26),
       (NULL, DEFAULT, DEFAULT, 1, 27),
       (NULL, DEFAULT, DEFAULT, 1, 28),
       (NULL, DEFAULT, DEFAULT, 1, 29),
       (NULL, DEFAULT, DEFAULT, 1, 30),
       (NULL, DEFAULT, DEFAULT, 1, 31),
       (NULL, DEFAULT, DEFAULT, 1, 32),
       (NULL, DEFAULT, DEFAULT, 1, 33),
       (NULL, DEFAULT, DEFAULT, 1, 34),
       (NULL, DEFAULT, DEFAULT, 1, 35),
       (NULL, DEFAULT, DEFAULT, 1, 36),
       (NULL, DEFAULT, DEFAULT, 1, 37),
       (NULL, DEFAULT, DEFAULT, 1, 38),
       (NULL, DEFAULT, DEFAULT, 1, 39),
       (NULL, DEFAULT, DEFAULT, 1, 40),
       (NULL, DEFAULT, DEFAULT, 1, 41),
       (NULL, DEFAULT, DEFAULT, 1, 42),
       (NULL, DEFAULT, DEFAULT, 1, 43),
       (NULL, DEFAULT, DEFAULT, 1, 44);

ALTER TABLE thesis_student
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES topic WRITE;
ALTER TABLE topic
    DISABLE KEYS;
TRUNCATE TABLE topic;

REPLACE INTO topic (deleted_at, created_at, updated_at, id, creator_id, subject, description, status, approver_id,
                    thesis_id, max_student, current_student, register_status)
VALUES (NULL, DEFAULT, DEFAULT, 1, 45, 'Ứng dụng Sping Framework cho Website bán các sản phẩm điện tử', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 2, 45, 'Xây dựng webiste mạng xã hội về hình ảnh', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 3, 46, 'Xây dựng giải pháp đấu giá trực tuyến', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 4, 46, 'Xây dựng hệ thống chăm sóc khách hàng cho chuỗi salon tóc', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 5, 47, 'Xây dựng ứng dụng hỗ trợ học tiếng Anh sử dụng flashcard', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 6, 48, 'Xây dựng hệ thống quản lý quy trinh khóa luận cho Hệ CLC', NULL, 2, 1, 1,
        2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 7, 49, 'Xây dựng ứng dụng phục vụ hoạt động của Spa', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 8, 49, 'Xây dựng ứng dụng học hỗ trợ học tiếng Hàn trên nền tảng iOS', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 9, 50, 'Ứng dụng hỗ trợ tuyển dụng việc làm trên nền tảng Blockchain', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 10, 50, 'Xây dựng ứng dụng phục vụ đăng ký khám chữa bệnh', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 11, 50, 'Phát hiện sớm bệnh ung thư da dựa trên ảnh chụp từ điện thoại', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 12, 51, 'Xây dựng website bán sách online', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 13, 51, 'Xây dựng website dịch vụ kết nối CAFE GAMING và người chơi game', NULL, 2, 1,
        1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 14, 52, 'Xây dựng website đặt phòng khách sạn', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 15, 52, 'Xây dựng website quản lý nhân sự', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 16, 53, 'Xây dựng hệ thống đặt tour du lịch trực tuyến sử dụng công nghệ MERN Stack',
        NULL, 2, 1, 1,
        2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 17, 53, 'Xây dựng trang web ẩm thực sử dụng công nghệ MERN Stack', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 18, 53, 'Xây dựng trang web bán hàng nông sản, sử dụng công nghệ SailsJS.', NULL, 2, 1,
        1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 19, 54, 'Xây dựng website bán quần áo và phụ kiện dành cho nam giới', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 20, 54, 'Xây dựng website đặt vé xe khách', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 21, 54,
        'Tìm hiểu công nghệ MEAN stack và áp dụng xây dựng Website bán linh kiện máy tính', NULL, 2, 1, 1,
        2, 2, 1),
       (NULL, DEFAULT, DEFAULT, 22, 55, 'Đặc trưng hoá luồng lưu lượng và giải pháp phát hiện bất thường', NULL, 2, 1,
        1,
        2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 23, 55, 'Các giải pháp đảm bảo tính sẵn sàng cho hệ thống mạng nội bộ', NULL, 2, 1, 1,
        2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 24, 1, 'Giải pháp triển khai hệ thống máy ảo thực hành sử dụng Docker', NULL, 2, 1, 1,
        2, 1, 1);


ALTER TABLE topic
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES topic_state WRITE;
ALTER TABLE topic_state
    DISABLE KEYS;
TRUNCATE TABLE topic_state;

REPLACE INTO topic_state (deleted_at, created_at, updated_at, id, topic_id, processor_id, note, action)
VALUES (NULL, DEFAULT, DEFAULT, 1, 1, 45, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 2, 1, 45, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 3, 1, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 4, 2, 45, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 5, 2, 45, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 6, 2, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 7, 3, 46, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 8, 3, 46, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 9, 3, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 10, 4, 46, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 11, 4, 46, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 12, 4, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 13, 5, 47, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 14, 5, 47, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 15, 5, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 16, 6, 48, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 17, 6, 48, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 18, 6, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 19, 7, 49, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 20, 7, 49, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 21, 7, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 22, 8, 49, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 23, 8, 49, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 24, 8, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 25, 9, 50, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 26, 9, 50, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 27, 9, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 28, 10, 50, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 29, 10, 50, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 30, 10, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 31, 11, 50, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 32, 11, 50, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 33, 11, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 34, 12, 51, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 35, 12, 51, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 36, 12, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 37, 13, 51, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 38, 13, 51, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 39, 13, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 40, 14, 52, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 41, 14, 52, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 42, 14, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 43, 15, 52, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 44, 15, 52, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 45, 15, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 46, 16, 53, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 47, 16, 53, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 48, 16, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 49, 17, 53, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 50, 17, 53, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 51, 17, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 52, 18, 53, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 53, 18, 53, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 54, 18, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 55, 19, 54, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 56, 19, 54, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 57, 19, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 58, 20, 54, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 59, 20, 54, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 60, 20, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 61, 21, 54, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 62, 21, 54, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 63, 21, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 64, 22, 55, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 65, 22, 55, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 66, 22, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 67, 23, 55, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 68, 23, 55, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 69, 23, 1, 'Chấp nhận đề tài.', 2),
       (NULL, DEFAULT, DEFAULT, 70, 24, 1, '[Hệ thống] Khởi tạo đề tài.', 1),
       (NULL, DEFAULT, DEFAULT, 71, 24, 1, 'Yêu cầu phê duyệt đề tài.', 6),
       (NULL, DEFAULT, DEFAULT, 72, 24, 1, 'Chấp nhận đề tài.', 2);

ALTER TABLE topic_state
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES user WRITE;
ALTER TABLE user
    DISABLE KEYS;
TRUNCATE TABLE user;

REPLACE INTO user (deleted_at, created_at, updated_at, id, username, password, firstname, lastname, gender, email,
                   address, phone, status, is_admin, user_type)
VALUES (NULL, DEFAULT, DEFAULT, 1, 'quangnd',
        'df0e3bcf85941f511c678ee07cdf1068bc861c69', 'Quang', 'Nguyễn Đăng', 1, 'quannd@hcmute.edu.vn', NULL,
        'NULL', 2, 2, 2),
       (NULL, DEFAULT, DEFAULT, 2, 't16110226',
        '1213fe5b8487d512ed1b820a20c915eeca96c2ee', 'Toàn', 'Nguyễn Hữu', 1, '16110226@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 3, 'h16110093',
        '13313b6babdce14614a0812d02e3342444062dce', 'Huy', 'Võ Minh', 1, '16110093@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 4, 't16110227',
        '00c7712a0221897240ddfa82b9dd65a17d9ff006', 'Toàn', 'Phạm Phước Đặng', 1, '16110227@student.hcmute.edu.vn',
        NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 5, 't16110201',
        'ac60f57be5db305b1d15333ea5aed7a04b00051a', 'Tài', 'Ngô Thanh', 1, '16110201@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 6, 'a16110004',
        '7f87919d6142dd331622ad335407e68add81370f', 'Anh', 'Đỗ Hoàng', 1, '16110004@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 7, 'k16110131',
        '2d0a6066b2d17c8ece81fcc2730786a2ea902d15', 'Kiệt', 'Trần Tuấn', 1, '16110131@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 8, 'h16110104',
        '1f74b44967cb8351191e4d83b55e3c774095478b', 'Hưng', 'Lê Quốc', 1, '16110104@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 9, 't16110229',
        'edcc560df537c0258455acc748b00f4e66026076', 'Trầm', 'Nguyễn Hữu Hoàng', 1, '16110229@student.hcmute.edu.vn',
        NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 10, 'g15110036',
        '0a366aa3f48411b16f49a5cf340a1ac4ab3a1e24', 'Giang', 'Phạm Trường', 1, '15110036@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 11, 'h15110038',
        'e2613a0808c1cde8788b41040adceb88e36a8d3b', 'Hào', 'Nguyễn Nhật', 1, '15110038@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 12, 'p16110186',
        '1b2a252db7b6abbf1b4443f6c2753f61ba765602', 'Poon', 'Nguyễn Duy', 1, '16110186@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 13, 'p15110103',
        '33da3b815edc4e676def37453d47127bfc3561ed', 'Phước', 'Lê Minh', 1, '15110103@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 14, 'p15110096',
        '5ef0105b9cc6283d257bb737180069f1c08bd80c', 'Phát', 'Vũ Ngọc', 1, '15110096@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 15, 'q16110189',
        '4c5f3acf741e1d962351e2f3da74f588273b35ed', 'Quang', 'Trần Minh', 1, '16110189@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 16, 'q16110195',
        '7ccabebc43216f8ca856eec17a2c52dd27b5b3a9', 'Quý', 'Nguyễn Ngọc', 1, '16110195@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 17, 'd16110044',
        '847de4086b1a04dfdfff4c377c90cc31803a5f4f', 'Đan', 'Trần Bảo', 1, '16110044@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 18, 'k16110121',
        '8c05d048a57dbba9b093976026de072e6e67bbc5', 'Khoa', 'Lê Đặng Đăng', 1, '16110121@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 19, 'c16110028',
        'e7762dcde0132e1fca18b03fdc7874cbcb5886e7', 'Cường', 'Nguyễn Huy', 1, '16110028@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 20, 'd16110056',
        '25142512d345bb31577b4f8246152aa96b53143d', 'Đức', 'Nguyễn Khánh', 1, '16110056@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 21, 'k16110119',
        '7b2053bed3324c4051b48a18c3047ed632d4b624', 'Khánh', 'Nguyễn Quốc', 1, '16110119@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 22, 'l16110142',
        '710775462acda2d57bba9430f7ba034ae1f5e40f', 'Long', 'Nguyễn Phi', 1, '16110142@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 23, 'd16110048',
        '42a989487b6f54b3f2cdbb7aa574ac1aaddf5c5e', 'Đạt', 'Nguyễn Tiến', 1, '16110048@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 24, 'h16110105',
        '27b677e84b5e7c424fbae335f6629e156e8524b8', 'Hưng', 'Lữ Phước', 1, '16110105@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 25, 't16110206',
        '3b7aa252eca794f5f63064801066a62e22f9a9e7', 'Tân', 'Trần Quang', 1, '16110206@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 26, 't16110236',
        'd01668da793467529a1207730c0ad12771125997', 'Trường', 'Võ Châu Nhật', 1, '16110236@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 27, 'a16119001',
        'fba82c3d0638fc412e9ae63ddffdce44e980f68b', 'Âu', 'Phan Vĩnh', 1, '16119001@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 28, 'h16110094',
        'c2da1a293ba52c652b9aafd582c3b51777a0b5f0', 'Huyền', 'Nguyễn Thị Diệu', 1, '16110094@student.hcmute.edu.vn',
        NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 29, 'h16110068',
        'ccc457692b097be9711fb879f3101439de6f526c', 'Hảo', 'Phạm Thị Như', 1, '16110068@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 30, 't16110573',
        'e5da377c13cbbbb5728b3e2cf56b014099fd755f', 'Thiện', 'Nguyễn Út', 1, '16110573@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 31, 'v16110581',
        'c52376dbd96e747bccd4cd3d78d20a0c7010d9b0', 'Văn', 'Lầu Việt', 1, '16110581@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 32, 'n16110171',
        'c8f58966b4c9540a335475e9b65e92511d9f54e7', 'Nhi', 'Võ Huỳnh Yến', 1, '16110171@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 33, 'h16110083',
        '2fe476ea629ee8e4077750a3feb8f2b413b86c5c', 'Hoà', 'Nguyễn Thái', 1, '16110083@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 34, 't15119154',
        '6dd5b6e02fcd314d2085d37f4efd5afc57e357f3', 'Tùng', 'Nguyễn Thanh', 1, '15119154@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 35, 'd16110032',
        '3ffebc907c8806deadcf0e31cbacbfcefb5713a1', 'Dinh', 'Nguyễn Văn', 1, '16110032@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 36, 'c16110030',
        '70bc17894b207ac0687f510ac2a33e7db7198652', 'Cường', 'Phan Chí', 1, '16110030@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 37, 'h16110555',
        '05bf41c2433f17549c131ce3a9daa3092065b971', 'Huy', 'Nguyễn Văn', 1, '16110555@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 38, 'h16110064',
        '2e8a649e3c5d66f44c4e8b385dd82792b104927f', 'Hải', 'Ngô Đình', 1, '16110064@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 39, 'm16110150',
        '4623c07fcbb66fe06e7f49ba4b847f9312c5e8ab', 'Mai', 'Nguyễn Ngọc Phương', 1, '16110150@student.hcmute.edu.vn',
        NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 40, 'b16110015',
        '78cd0fcdc5bc89bdca264d900ffe00a7d68b5a2c', 'Bảo', 'Huỳnh Trần Thái', 1, '16110015@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 41, 'a16110001',
        '2bdcf04dddab0b0bb46814d9c6c455d12777262b', 'An', 'Hoàng Bình', 1, '16110001@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 42, 'd16110045',
        '9063d0c2ff40aacbb90ff66e95f3d4b362cfc89d', 'Đại', 'Đặng Ngọc', 1, '16110045@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 43, 'd16110153',
        'd2504de431745f8272c0482b0b8e0fa157f9460a', 'Đại', 'Hoàng Phước', 1, '16110153@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 44, 'm15110013',
        '1a3e5809b49c79db38e936442848504938695bdd', 'Minh', 'Đinh Công', 1, '15110013@student.hcmute.edu.vn', NULL,
        'NULL', 2, 1, 1),
       (NULL, DEFAULT, DEFAULT, 45, 'thinhlv',
        'f329e1d39fca7e50adafb4cf2e3db7130d18d7b5', 'Thịnh', 'Lê Vĩnh', 1, 'thinhlv@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 46, 'phuocnt',
        '49f0930b929fa9c54c5bb2f0bd6b13b5729a865b', 'Phước', 'Nguyễn Thanh', 1, 'phuocnt@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 47, 'phunghx',
        '2168670a9d9049c22c075fa61bf16ff0b57b19cd', 'Phụng', 'Huỳnh Xuân', 1, 'phunghx@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 48, 'minhlv',
        '046958e79d3fa3f27df5a804cef4c77e3d15a487', 'Minh', 'Lương Vĩ', 1, 'minhlv@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 49, 'tutc',
        '1e6abbb7bb31f3bae5f182c6bb4ad2c06ecb11dc', 'Tú', 'Trần Công', 1, 'tutc@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 50, 'baont',
        '91b764b433fc2334b9c3b946d29f6c96790f6769', 'Bảo', 'Nguyễn Thiên', 1, 'baont@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 51, 'vanntt',
        '59afe0c650f84f09426de29b2443986229344abb', 'Văn', 'Nguyễn Trần Thi', 1, 'vanntt@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 52, 'chaultm',
        'a7408a986d413b634e8f022ac53c97297aef897f', 'Châu', 'Lê Thị Minh', 1, 'chaultm@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 53, 'vinhlv',
        '152c7b17d6de48925212eb8baf3c73edce278cc6', 'Vinh', 'Lê Văn', 1, 'vinhlv@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 54, 'daonm',
        '3d1d52d5056b259c6f0d33d866e55d41bb14d17f', 'Đạo', 'Nguyễn Minh', 1, 'daonm@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 55, 'chinhhn',
        '7ab7a4feae47083f06cfaabc64c3179c1d3ab493', 'Chính', 'Huỳnh Nguyên', 1, 'chinhhn@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 56, 'dunghv',
        'b2340e5ef8841667c5a4624b86e624cab6dd3b14', 'Dũng', 'Hoàng Văn', 1, 'dunghv@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2),
       (NULL, DEFAULT, DEFAULT, 57, 'hongtt',
        '175485b08c6388ac25224bb5d751c8545dd0c7ac', 'Hồng', 'Từ Tuyết', 1, 'hongtt@hcmute.edu.vn', NULL,
        'NULL', 2, 1, 2);

ALTER TABLE user
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES topic_student WRITE;
ALTER TABLE topic_student
    DISABLE KEYS;
TRUNCATE TABLE topic_student;

REPLACE INTO topic_student (deleted_at, created_at, updated_at, topic_id, student_id, status)
VALUES (NULL, DEFAULT, DEFAULT, 1, 2, 2),
       (NULL, DEFAULT, DEFAULT, 1, 3, 2),
       (NULL, DEFAULT, DEFAULT, 2, 4, 2),
       (NULL, DEFAULT, DEFAULT, 2, 5, 2),
       (NULL, DEFAULT, DEFAULT, 3, 6, 2),
       (NULL, DEFAULT, DEFAULT, 3, 7, 2),
       (NULL, DEFAULT, DEFAULT, 4, 8, 2),
       (NULL, DEFAULT, DEFAULT, 4, 9, 2),
       (NULL, DEFAULT, DEFAULT, 5, 10, 2),
       (NULL, DEFAULT, DEFAULT, 5, 11, 2),
       (NULL, DEFAULT, DEFAULT, 6, 12, 2),
       (NULL, DEFAULT, DEFAULT, 7, 13, 2),
       (NULL, DEFAULT, DEFAULT, 7, 14, 2),
       (NULL, DEFAULT, DEFAULT, 8, 15, 2),
       (NULL, DEFAULT, DEFAULT, 8, 16, 2),
       (NULL, DEFAULT, DEFAULT, 9, 17, 2),
       (NULL, DEFAULT, DEFAULT, 9, 18, 2),
       (NULL, DEFAULT, DEFAULT, 10, 19, 2),
       (NULL, DEFAULT, DEFAULT, 10, 20, 2),
       (NULL, DEFAULT, DEFAULT, 11, 21, 2),
       (NULL, DEFAULT, DEFAULT, 11, 22, 2),
       (NULL, DEFAULT, DEFAULT, 12, 23, 2),
       (NULL, DEFAULT, DEFAULT, 12, 24, 2),
       (NULL, DEFAULT, DEFAULT, 13, 25, 2),
       (NULL, DEFAULT, DEFAULT, 13, 26, 2),
       (NULL, DEFAULT, DEFAULT, 14, 27, 2),
       (NULL, DEFAULT, DEFAULT, 14, 28, 2),
       (NULL, DEFAULT, DEFAULT, 15, 29, 2),
       (NULL, DEFAULT, DEFAULT, 15, 30, 2),
       (NULL, DEFAULT, DEFAULT, 16, 31, 2),
       (NULL, DEFAULT, DEFAULT, 17, 32, 2),
       (NULL, DEFAULT, DEFAULT, 17, 33, 2),
       (NULL, DEFAULT, DEFAULT, 18, 34, 2),
       (NULL, DEFAULT, DEFAULT, 18, 35, 2),
       (NULL, DEFAULT, DEFAULT, 19, 36, 2),
       (NULL, DEFAULT, DEFAULT, 19, 37, 2),
       (NULL, DEFAULT, DEFAULT, 20, 38, 2),
       (NULL, DEFAULT, DEFAULT, 20, 39, 2),
       (NULL, DEFAULT, DEFAULT, 21, 40, 2),
       (NULL, DEFAULT, DEFAULT, 21, 41, 2),
       (NULL, DEFAULT, DEFAULT, 22, 42, 2),
       (NULL, DEFAULT, DEFAULT, 23, 43, 2),
       (NULL, DEFAULT, DEFAULT, 24, 44, 2);

ALTER TABLE topic_student
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES progress_report WRITE;
ALTER TABLE progress_report
    DISABLE KEYS;
TRUNCATE TABLE progress_report;

REPLACE INTO progress_report (deleted_at, created_at, updated_at, id, time, place, note, result)
VALUES (NULL, DEFAULT, DEFAULT, 1, '2020-11-28 00:30:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 2, '2020-11-28 00:45:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 3, '2020-11-28 01:00:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 4, '2020-11-28 01:15:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 5, '2020-11-28 01:30:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 6, '2020-11-28 02:00:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 7, '2020-11-28 02:15:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 8, '2020-11-28 02:30:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 9, '2020-11-28 02:45:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 10, '2020-11-28 03:00:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 11, '2020-11-28 03:15:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 12, '2020-11-28 03:30:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 13, '2020-11-28 03:45:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 14, '2020-11-28 04:00:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 15, '2020-11-28 04:15:00', 'A5-304', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 16, '2020-11-28 07:30:00', 'A5-204', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 17, '2020-11-28 07:45:00', 'A5-204', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 18, '2020-11-28 08:00:00', 'A5-204', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 19, '2020-11-28 08:15:00', 'A5-204', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 20, '2020-11-28 08:30:00', 'A5-204', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 21, '2020-11-28 08:45:00', 'A5-204', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 22, '2020-11-28 09:00:00', 'A5-204', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 23, '2020-11-28 09:30:00', 'A5-204', NULL, 2),
       (NULL, DEFAULT, DEFAULT, 24, '2020-11-28 09:45:00', 'A5-204', NULL, 2);

ALTER TABLE progress_report
    ENABLE KEYS;
UNLOCK TABLES;

LOCK TABLES review WRITE;
ALTER TABLE review
    DISABLE KEYS;
TRUNCATE TABLE review;

REPLACE INTO review (deleted_at, created_at, updated_at, id, time, place, note, result, reviewer_id,
                     reviewer_comment)
VALUES (NULL, DEFAULT, DEFAULT, 1, DEFAULT, NULL, NULL, 1, 46, NULL),
       (NULL, DEFAULT, DEFAULT, 2, DEFAULT, NULL, NULL, 1, 46, NULL),
       (NULL, DEFAULT, DEFAULT, 3, DEFAULT, NULL, NULL, 1, 45, NULL),
       (NULL, DEFAULT, DEFAULT, 4, DEFAULT, NULL, NULL, 1, 45, NULL),
       (NULL, DEFAULT, DEFAULT, 5, DEFAULT, NULL, NULL, 1, 48, NULL),
       (NULL, DEFAULT, DEFAULT, 6, DEFAULT, NULL, NULL, 2, 47, NULL),
       (NULL, DEFAULT, DEFAULT, 7, DEFAULT, NULL, NULL, 1, 56, NULL),
       (NULL, DEFAULT, DEFAULT, 8, DEFAULT, NULL, NULL, 1, 56, NULL),
       (NULL, DEFAULT, DEFAULT, 9, DEFAULT, NULL, NULL, 1, 56, NULL),
       (NULL, DEFAULT, DEFAULT, 10, DEFAULT, NULL, NULL, 1, 57, NULL),
       (NULL, DEFAULT, DEFAULT, 11, DEFAULT, NULL, NULL, 1, 57, NULL),
       (NULL, DEFAULT, DEFAULT, 12, DEFAULT, NULL, NULL, 1, 49, NULL),
       (NULL, DEFAULT, DEFAULT, 13, DEFAULT, NULL, NULL, 1, 49, NULL),
       (NULL, DEFAULT, DEFAULT, 14, DEFAULT, NULL, NULL, 1, 53, NULL),
       (NULL, DEFAULT, DEFAULT, 15, DEFAULT, NULL, NULL, 1, 53, NULL),
       (NULL, DEFAULT, DEFAULT, 16, DEFAULT, NULL, NULL, 1, 54, NULL),
       (NULL, DEFAULT, DEFAULT, 17, DEFAULT, NULL, NULL, 1, 54, NULL),
       (NULL, DEFAULT, DEFAULT, 18, DEFAULT, NULL, NULL, 1, 54, NULL),
       (NULL, DEFAULT, DEFAULT, 19, DEFAULT, NULL, NULL, 1, 52, NULL),
       (NULL, DEFAULT, DEFAULT, 20, DEFAULT, NULL, NULL, 1, 52, NULL),
       (NULL, DEFAULT, DEFAULT, 21, DEFAULT, NULL, NULL, 1, 52, NULL),
       (NULL, DEFAULT, DEFAULT, 22, DEFAULT, NULL, NULL, 1, 1, NULL),
       (NULL, DEFAULT, DEFAULT, 23, DEFAULT, NULL, NULL, 1, 1, NULL),
       (NULL, DEFAULT, DEFAULT, 24, DEFAULT, NULL, NULL, 1, 55, NULL);

ALTER TABLE review
    ENABLE KEYS;
UNLOCK TABLES;

SET SQL_NOTES = @OLD_SQL_NOTES;
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION;
