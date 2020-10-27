import { MigrationInterface, QueryRunner } from 'typeorm';

export class Refactor1603725003706 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" ADD "created_at" datetime2`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0" DEFAULT getdate() FOR "created_at"`
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" datetime2`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_9cdce43fa0043c794281aa09051" DEFAULT getdate() FOR "updated_at"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "deleted_at" datetime2`);
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "created_at" datetime2`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "DF_bcdf63026ba2f1428b4bf6e818b" DEFAULT getdate() FOR "created_at"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "updated_at" datetime2`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "DF_e48e33ed2af67d5cf2a7d6f3201" DEFAULT getdate() FOR "updated_at"`
    );
    await queryRunner.query(`ALTER TABLE "thesis" ADD "deleted_at" datetime2`);
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" ADD "deleted_at" datetime2`);
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" ADD "created_at" datetime2`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "DF_ee79decc5e6c3ab075488d715f3" DEFAULT getdate() FOR "created_at"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" ADD "updated_at" datetime2`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "DF_41da0f86ba021102b1be5137df0" DEFAULT getdate() FOR "updated_at"`
    );
    await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "created_at" datetime2`);
    await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "updated_at" datetime2`);
    await queryRunner.query(`ALTER TABLE "thesis" ALTER COLUMN "created_at" datetime2`);
    await queryRunner.query(`ALTER TABLE "thesis" ALTER COLUMN "updated_at" datetime2`);
    await queryRunner.query(`ALTER TABLE "lecturer" ALTER COLUMN "created_at" datetime2`);
    await queryRunner.query(`ALTER TABLE "lecturer" ALTER COLUMN "updated_at" datetime2`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "lecturer" ALTER COLUMN "updated_at" datetime2 NOT NULL`);
    await queryRunner.query(`ALTER TABLE "lecturer" ALTER COLUMN "created_at" datetime2 NOT NULL`);
    await queryRunner.query(`ALTER TABLE "thesis" ALTER COLUMN "updated_at" datetime2 NOT NULL`);
    await queryRunner.query(`ALTER TABLE "thesis" ALTER COLUMN "created_at" datetime2 NOT NULL`);
    await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "updated_at" datetime2 NOT NULL`);
    await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "created_at" datetime2 NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "DF_41da0f86ba021102b1be5137df0"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "DF_ee79decc5e6c3ab075488d715f3"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "thesis" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "DF_e48e33ed2af67d5cf2a7d6f3201"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "DF_bcdf63026ba2f1428b4bf6e818b"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_9cdce43fa0043c794281aa09051"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
  }
}
