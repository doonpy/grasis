import { MigrationInterface, QueryRunner } from 'typeorm';

export class Refactor1603644473208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "FK_d0b0dc760afe3b766cd0a7d0122"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "FK_35d8aec6de01e77ff0f4657b597"`
    );
    await queryRunner.query(`DROP INDEX "IDX_d0b0dc760afe3b766cd0a7d012" ON "thesis_lecturer"`);
    await queryRunner.query(`DROP INDEX "IDX_35d8aec6de01e77ff0f4657b59" ON "thesis_lecturer"`);
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "FK_d0b0dc760afe3b766cd0a7d0122" FOREIGN KEY ("thesis_id") REFERENCES "thesis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "FK_35d8aec6de01e77ff0f4657b597" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "FK_35d8aec6de01e77ff0f4657b597"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "FK_d0b0dc760afe3b766cd0a7d0122"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "deleted_at" datetime2`);
    await queryRunner.query(
      `CREATE INDEX "IDX_35d8aec6de01e77ff0f4657b59" ON "thesis_lecturer" ("lecturer_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d0b0dc760afe3b766cd0a7d012" ON "thesis_lecturer" ("thesis_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "FK_35d8aec6de01e77ff0f4657b597" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "FK_d0b0dc760afe3b766cd0a7d0122" FOREIGN KEY ("thesis_id") REFERENCES "thesis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
