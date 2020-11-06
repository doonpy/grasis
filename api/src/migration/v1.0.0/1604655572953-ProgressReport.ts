import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProgressReport1604655572953 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `progress_report` (`deleted_at` datetime NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `topic_id` int NOT NULL, `time` datetime NOT NULL, `place` varchar(100) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NULL, `note` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `thesis_student` CHANGE `instructor_result` `instructor_result` float NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `thesis_student` CHANGE `review_result` `review_result` float NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `thesis_student` CHANGE `defense_result` `defense_result` float NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `progress_report` ADD CONSTRAINT `FK_f25e72bbe262be8aa3f131f1f15` FOREIGN KEY (`topic_id`) REFERENCES `topic`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `progress_report` DROP FOREIGN KEY `FK_f25e72bbe262be8aa3f131f1f15`'
    );
    await queryRunner.query(
      'ALTER TABLE `thesis_student` CHANGE `defense_result` `defense_result` float(12) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `thesis_student` CHANGE `review_result` `review_result` float(12) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `thesis_student` CHANGE `instructor_result` `instructor_result` float(12) NULL'
    );
    await queryRunner.query('DROP TABLE `progress_report`');
  }
}
