import { MigrationInterface, QueryRunner } from 'typeorm';

export class Topic1603968240342 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "topic" ADD "max_student" tinyint NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "DF_71e2be0f2b48f7ae3ace1e4231c" DEFAULT 2 FOR "max_student"`
    );
    await queryRunner.query(`ALTER TABLE "topic" ADD "register_status" tinyint NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "DF_1e432775fc36bef116e98ec8d3e" DEFAULT 1 FOR "register_status"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "topic" DROP CONSTRAINT "DF_1e432775fc36bef116e98ec8d3e"`);
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "register_status"`);
    await queryRunner.query(`ALTER TABLE "topic" DROP CONSTRAINT "DF_71e2be0f2b48f7ae3ace1e4231c"`);
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "max_student"`);
  }
}
