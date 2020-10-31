import { MigrationInterface, QueryRunner } from 'typeorm';

export class Topic1604137790773 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "topic" ("deleted_at" datetime2, "created_at" datetime2 CONSTRAINT "DF_65aca285a83e07f786ff24b6b2d" DEFAULT getdate(), "updated_at" datetime2 CONSTRAINT "DF_970a39a17772a43b3df88d60384" DEFAULT getdate(), "id" int NOT NULL IDENTITY(1,1), "creator_id" int NOT NULL, "subject" ntext NOT NULL, "description" ntext, "status" tinyint NOT NULL CONSTRAINT "DF_64636430227db1b94299318a230" DEFAULT 1, "approver_id" int NOT NULL, "thesis_id" int NOT NULL, "max_student" tinyint NOT NULL CONSTRAINT "DF_71e2be0f2b48f7ae3ace1e4231c" DEFAULT 2, "register_status" tinyint NOT NULL CONSTRAINT "DF_1e432775fc36bef116e98ec8d3e" DEFAULT 1, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "topic_state" ("deleted_at" datetime2, "created_at" datetime2 CONSTRAINT "DF_1429a80c8dacbf5743ec6088396" DEFAULT getdate(), "updated_at" datetime2 CONSTRAINT "DF_ec9a410f3669f5da7af5c1cbff6" DEFAULT getdate(), "id" int NOT NULL IDENTITY(1,1), "topic_id" int NOT NULL, "processor_id" int NOT NULL, "note" ntext, "action" tinyint NOT NULL CONSTRAINT "DF_282f2c7ea7877873e6e6bde4176" DEFAULT 1, CONSTRAINT "PK_c787c9489bae28d5ac8361a64c0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_1f85cbd106edb896312ac663b3f" FOREIGN KEY ("creator_id") REFERENCES "lecturer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_bcaf1d1db01a5550a4c8ef3ad64" FOREIGN KEY ("approver_id") REFERENCES "lecturer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_91ef36166bb928b52eab1fa93e6" FOREIGN KEY ("thesis_id") REFERENCES "thesis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "topic_state" ADD CONSTRAINT "FK_2d397ff381a353ce8a2866b1ce1" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "topic_state" ADD CONSTRAINT "FK_1b64df3b757ebac1a8b8dd90076" FOREIGN KEY ("processor_id") REFERENCES "lecturer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "topic_state" DROP CONSTRAINT "FK_1b64df3b757ebac1a8b8dd90076"`
    );
    await queryRunner.query(
      `ALTER TABLE "topic_state" DROP CONSTRAINT "FK_2d397ff381a353ce8a2866b1ce1"`
    );
    await queryRunner.query(`ALTER TABLE "topic" DROP CONSTRAINT "FK_91ef36166bb928b52eab1fa93e6"`);
    await queryRunner.query(`ALTER TABLE "topic" DROP CONSTRAINT "FK_bcaf1d1db01a5550a4c8ef3ad64"`);
    await queryRunner.query(`ALTER TABLE "topic" DROP CONSTRAINT "FK_1f85cbd106edb896312ac663b3f"`);
    await queryRunner.query(`DROP TABLE "topic_state"`);
    await queryRunner.query(`DROP TABLE "topic"`);
  }
}
