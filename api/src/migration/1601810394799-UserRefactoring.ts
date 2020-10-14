import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRefactoring1601810394799 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" char(40);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" varchar(50);`);
  }
}
