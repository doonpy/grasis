import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAddColumns1602914230391 implements MigrationInterface {
  name = 'UserAddColumns1602914230391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "student" ADD "studentClass" nvarchar(20)`);
    await queryRunner.query(
      `ALTER TABLE "student" ADD "isGraduate" tinyint CONSTRAINT "DF_92aaa184e18e0b7f2819d8a4b17" DEFAULT 0`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "DF_92aaa184e18e0b7f2819d8a4b17"`
    );
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isGraduate"`);
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "studentClass"`);
  }
}
