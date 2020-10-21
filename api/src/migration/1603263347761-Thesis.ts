import { MigrationInterface, QueryRunner } from 'typeorm';

export class Thesis1603263347761 implements MigrationInterface {
  name = 'Thesis1603263347761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "instructorResult"`);
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "reviewResult"`);
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "defenseResult"`);
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "instructor_result" float`);
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "review_result" float`);
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "defense_result" float`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "defense_result"`);
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "review_result"`);
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "instructor_result"`);
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "defenseResult" float`);
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "reviewResult" float`);
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "instructorResult" float`);
  }
}
