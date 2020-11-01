import { MigrationInterface, QueryRunner } from 'typeorm';

export class Topic1604224700546 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "topic_student" ("deleted_at" datetime2, "created_at" datetime2 CONSTRAINT "DF_829e6344baf4746b06f679cfa4b" DEFAULT getdate(), "updated_at" datetime2 CONSTRAINT "DF_83d904acda487c82b57a3d6b2af" DEFAULT getdate(), "topic_id" int NOT NULL, "student_id" int NOT NULL, "status" tinyint NOT NULL CONSTRAINT "DF_fd451075849d942f704ecc60ded" DEFAULT 1, CONSTRAINT "PK_1745d20c4f5a03fb7267f804f7b" PRIMARY KEY ("topic_id", "student_id"))`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "topic"`);
    await queryRunner.query(`ALTER TABLE "topic" ADD "current_student" tinyint NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "DF_5ec5e11c33b000af239fcfcd864" DEFAULT 0 FOR "current_student"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "topic" int`);
    await queryRunner.query(
      `ALTER TABLE "topic_student" ADD CONSTRAINT "FK_87a0be7421bdaf49aba27c8829e" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "topic_student" ADD CONSTRAINT "FK_9926826af7402f79532419b4fb9" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "topic_student" DROP CONSTRAINT "FK_9926826af7402f79532419b4fb9"`
    );
    await queryRunner.query(
      `ALTER TABLE "topic_student" DROP CONSTRAINT "FK_87a0be7421bdaf49aba27c8829e"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "topic"`);
    await queryRunner.query(`ALTER TABLE "topic" DROP CONSTRAINT "DF_5ec5e11c33b000af239fcfcd864"`);
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "current_student"`);
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "topic" int`);
    await queryRunner.query(`DROP TABLE "topic_student"`);
  }
}
