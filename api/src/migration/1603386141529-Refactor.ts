import { MigrationInterface, QueryRunner } from 'typeorm';

export class Refactor1603386141529 implements MigrationInterface {
  name = 'Refactor1603386141529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_b2033a3235871353c93700a0b60"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAdmin"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userType"`);
    await queryRunner.query(`ALTER TABLE "lecturer" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "lecturer" DROP COLUMN "lecturerId"`);
    await queryRunner.query(
      `ALTER TABLE "lecturer" DROP CONSTRAINT "DF_34c657b8be98126514543638353"`
    );
    await queryRunner.query(`ALTER TABLE "lecturer" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "lecturer" DROP CONSTRAINT "DF_061c4a6ef0b1c48779cbdad4c7c"`
    );
    await queryRunner.query(`ALTER TABLE "lecturer" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "studentId"`);
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "schoolYear"`);
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "DF_c04389662909caffbe494673c94"`
    );
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "DF_00376a179004fd1b897ba7c800b"`
    );
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "studentClass"`);
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "DF_92aaa184e18e0b7f2819d8a4b17"`
    );
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isGraduate"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" datetime2`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_admin" tinyint CONSTRAINT "DF_126841b968a45e2d3997ebfa338" DEFAULT 1`
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "user_type" tinyint`);
    await queryRunner.query(`ALTER TABLE "lecturer" ADD "deleted_at" datetime2`);
    await queryRunner.query(`ALTER TABLE "lecturer" ADD "lecturer_id" nchar(4)`);
    await queryRunner.query(
      `ALTER TABLE "lecturer" ADD "created_at" datetime2 NOT NULL CONSTRAINT "DF_b4911330aa2bac4f4142ace1501" DEFAULT getdate()`
    );
    await queryRunner.query(
      `ALTER TABLE "lecturer" ADD "updated_at" datetime2 NOT NULL CONSTRAINT "DF_28346d532fa058bb001e3a74e29" DEFAULT getdate()`
    );
    await queryRunner.query(`ALTER TABLE "student" ADD "deleted_at" datetime2`);
    await queryRunner.query(`ALTER TABLE "student" ADD "student_id" nchar(8)`);
    await queryRunner.query(`ALTER TABLE "student" ADD "school_year" nvarchar(10)`);
    await queryRunner.query(`ALTER TABLE "student" ADD "student_class" nvarchar(20)`);
    await queryRunner.query(
      `ALTER TABLE "student" ADD "is_graduate" tinyint CONSTRAINT "DF_23a557e4337ec953316ba539600" DEFAULT 0`
    );
    await queryRunner.query(
      `ALTER TABLE "student" ADD "created_at" datetime2 NOT NULL CONSTRAINT "DF_674911217cb8e34051a3c41eee5" DEFAULT getdate()`
    );
    await queryRunner.query(
      `ALTER TABLE "student" ADD "updated_at" datetime2 NOT NULL CONSTRAINT "DF_ee83ed881817a610ee9729c243f" DEFAULT getdate()`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_3d44ccf43b8a0d6b9978affb880"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_3d44ccf43b8a0d6b9978affb880" DEFAULT 2 FOR "status"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis" DROP CONSTRAINT "DF_5fe45c77a21c501c55972c68336"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis" ADD CONSTRAINT "DF_5fe45c77a21c501c55972c68336" DEFAULT 1 FOR "status"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "thesis" DROP CONSTRAINT "DF_5fe45c77a21c501c55972c68336"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis" ADD CONSTRAINT "DF_5fe45c77a21c501c55972c68336" DEFAULT 2 FOR "status"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_3d44ccf43b8a0d6b9978affb880"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_3d44ccf43b8a0d6b9978affb880" DEFAULT 1 FOR "status"`
    );
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "DF_ee83ed881817a610ee9729c243f"`
    );
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "DF_674911217cb8e34051a3c41eee5"`
    );
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "DF_23a557e4337ec953316ba539600"`
    );
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "is_graduate"`);
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "student_class"`);
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "school_year"`);
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "student_id"`);
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "lecturer" DROP CONSTRAINT "DF_28346d532fa058bb001e3a74e29"`
    );
    await queryRunner.query(`ALTER TABLE "lecturer" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "lecturer" DROP CONSTRAINT "DF_b4911330aa2bac4f4142ace1501"`
    );
    await queryRunner.query(`ALTER TABLE "lecturer" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "lecturer" DROP COLUMN "lecturer_id"`);
    await queryRunner.query(`ALTER TABLE "lecturer" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_type"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_126841b968a45e2d3997ebfa338"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_admin"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "student" ADD "isGraduate" tinyint`);
    await queryRunner.query(
      `ALTER TABLE "student" ADD CONSTRAINT "DF_92aaa184e18e0b7f2819d8a4b17" DEFAULT 0 FOR "isGraduate"`
    );
    await queryRunner.query(`ALTER TABLE "student" ADD "studentClass" nvarchar(20)`);
    await queryRunner.query(`ALTER TABLE "student" ADD "updatedAt" datetime2 NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "student" ADD CONSTRAINT "DF_00376a179004fd1b897ba7c800b" DEFAULT getdate() FOR "updatedAt"`
    );
    await queryRunner.query(`ALTER TABLE "student" ADD "createdAt" datetime2 NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "student" ADD CONSTRAINT "DF_c04389662909caffbe494673c94" DEFAULT getdate() FOR "createdAt"`
    );
    await queryRunner.query(`ALTER TABLE "student" ADD "schoolYear" nvarchar(10)`);
    await queryRunner.query(`ALTER TABLE "student" ADD "studentId" nchar(8)`);
    await queryRunner.query(`ALTER TABLE "student" ADD "deletedAt" datetime2`);
    await queryRunner.query(`ALTER TABLE "lecturer" ADD "updatedAt" datetime2 NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "lecturer" ADD CONSTRAINT "DF_061c4a6ef0b1c48779cbdad4c7c" DEFAULT getdate() FOR "updatedAt"`
    );
    await queryRunner.query(`ALTER TABLE "lecturer" ADD "createdAt" datetime2 NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "lecturer" ADD CONSTRAINT "DF_34c657b8be98126514543638353" DEFAULT getdate() FOR "createdAt"`
    );
    await queryRunner.query(`ALTER TABLE "lecturer" ADD "lecturerId" nchar(4)`);
    await queryRunner.query(`ALTER TABLE "lecturer" ADD "deletedAt" datetime2`);
    await queryRunner.query(`ALTER TABLE "user" ADD "userType" tinyint`);
    await queryRunner.query(`ALTER TABLE "user" ADD "isAdmin" tinyint`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_b2033a3235871353c93700a0b60" DEFAULT 0 FOR "isAdmin"`
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" datetime2`);
  }
}
