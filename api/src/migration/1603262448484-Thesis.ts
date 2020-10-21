import { MigrationInterface, QueryRunner } from 'typeorm';

export class Thesis1603262448484 implements MigrationInterface {
  name = 'Thesis1603262448484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "thesis" ("id" int NOT NULL IDENTITY(1,1), "creator" int, "start_time" datetime2 NOT NULL, "end_time" datetime2 NOT NULL, "state" tinyint NOT NULL CONSTRAINT "DF_b84d2f3bc619bab603083ca04ec" DEFAULT 1, "lecturer_topic_register" datetime2 NOT NULL, "student_topic_register" datetime2 NOT NULL, "progress_report" datetime2 NOT NULL, "review" datetime2 NOT NULL, "defense" datetime2 NOT NULL, "status" int NOT NULL CONSTRAINT "DF_5fe45c77a21c501c55972c68336" DEFAULT 2, "created_at" datetime2 NOT NULL CONSTRAINT "DF_bc0ef8bb8165cba3d1ecd6acd5a" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_eebeabf8f088f1416106c1294d3" DEFAULT getdate(), CONSTRAINT "PK_6e4796322fd6d0934893f77c840" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "thesis_lecturer" ("thesis" int NOT NULL, "lecturer" int NOT NULL, CONSTRAINT "PK_91c0eb5923a0d5a9835a2544a7a" PRIMARY KEY ("thesis", "lecturer"))`
    );
    await queryRunner.query(
      `CREATE TABLE "thesis_student" ("thesis" int NOT NULL, "student" int NOT NULL, "topic" int, "instructorResult" float, "reviewResult" float, "defenseResult" float, CONSTRAINT "PK_0480b167258b67624ca902a02f9" PRIMARY KEY ("thesis", "student"))`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis" ADD CONSTRAINT "FK_51d2c8dca12e4a82a4767a9297e" FOREIGN KEY ("creator") REFERENCES "lecturer"("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "FK_11f51415b4f129462ee6bb7ddb0" FOREIGN KEY ("thesis") REFERENCES "thesis"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "FK_512b5d85dfdc781b219826030c3" FOREIGN KEY ("lecturer") REFERENCES "lecturer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "FK_c960a493ae730b158d11968c0cb" FOREIGN KEY ("thesis") REFERENCES "thesis"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "FK_3bbc4361a8fa12b72b43f5b1052" FOREIGN KEY ("student") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "FK_3bbc4361a8fa12b72b43f5b1052"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "FK_c960a493ae730b158d11968c0cb"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "FK_512b5d85dfdc781b219826030c3"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "FK_11f51415b4f129462ee6bb7ddb0"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis" DROP CONSTRAINT "FK_51d2c8dca12e4a82a4767a9297e"`
    );
    await queryRunner.query(`DROP TABLE "thesis_student"`);
    await queryRunner.query(`DROP TABLE "thesis_lecturer"`);
    await queryRunner.query(`DROP TABLE "thesis"`);
  }
}
