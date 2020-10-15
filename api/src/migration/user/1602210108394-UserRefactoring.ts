import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRefactoring1602210108394 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "refreshToken" varchar(255) NULL;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken";`);
  }
}
