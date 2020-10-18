import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefreshInitEntity1603000097018 implements MigrationInterface {
  name = 'RefreshInitEntity1603000097018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_refresh_token" ("id" int NOT NULL IDENTITY(1,1), "userId" int NOT NULL, "browser" varchar(50), "version" varchar(50), "platform" varchar(50), "os" varchar(50), "refreshToken" varchar(255), "source" varchar(255), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_2bd85087c08a6e8931de6563522" DEFAULT getdate(), CONSTRAINT "PK_2f86bb87603956e017efa2e74ec" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
    await queryRunner.query(
      `ALTER TABLE "user_refresh_token" ADD CONSTRAINT "FK_9e2418637bd2ee8d14c7ccb1e34" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_refresh_token" DROP CONSTRAINT "FK_9e2418637bd2ee8d14c7ccb1e34"`
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "refreshToken" varchar(255)`);
    await queryRunner.query(`DROP TABLE "user_refresh_token"`);
  }
}
