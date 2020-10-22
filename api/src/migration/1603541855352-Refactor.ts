import { MigrationInterface, QueryRunner } from 'typeorm';

export class Refactor1603541855352 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "FK_3d8016e1cb58429474a3c041904"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "FK_3bbc4361a8fa12b72b43f5b1052"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "FK_c960a493ae730b158d11968c0cb"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis" DROP CONSTRAINT "FK_51d2c8dca12e4a82a4767a9297e"`
    );
    await queryRunner.query(
      `ALTER TABLE "lecturer" DROP CONSTRAINT "FK_e9647bfd5a4c128c9cc3e8cf99c"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "FK_512b5d85dfdc781b219826030c3"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "FK_11f51415b4f129462ee6bb7ddb0"`
    );
    await queryRunner.query(`EXEC sp_rename "thesis.creator", "creator_id"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "PK_0480b167258b67624ca902a02f9"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "PK_3bbc4361a8fa12b72b43f5b1052" PRIMARY KEY ("student")`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "thesis"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "PK_3bbc4361a8fa12b72b43f5b1052"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "student"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "PK_91c0eb5923a0d5a9835a2544a7a"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "PK_512b5d85dfdc781b219826030c3" PRIMARY KEY ("lecturer")`
    );
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" DROP COLUMN "thesis"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "PK_512b5d85dfdc781b219826030c3"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" DROP COLUMN "lecturer"`);
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "deleted_at" datetime2`);
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "thesis_id" int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "PK_e126110a891f73b8710b65bbce9" PRIMARY KEY ("thesis_id")`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "student_id" int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "PK_e126110a891f73b8710b65bbce9"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "PK_e45adc47d24c0707f269897dad2" PRIMARY KEY ("thesis_id", "student_id")`
    );
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" ADD "thesisId" int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "PK_67153d3f7799c7b9733e61343a1" PRIMARY KEY ("thesisId")`
    );
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" ADD "lecturerId" int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "PK_67153d3f7799c7b9733e61343a1"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "PK_6c4d147bf1b0e543ae88c18462a" PRIMARY KEY ("thesisId", "lecturerId")`
    );
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "status" tinyint NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_admin" tinyint NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "user_type" tinyint NOT NULL`);
    await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "is_graduate" tinyint`);
    await queryRunner.query(
      `ALTER TABLE "student" ADD CONSTRAINT "DF_23a557e4337ec953316ba539600" DEFAULT 1 FOR "is_graduate"`
    );
    await queryRunner.query(`ALTER TABLE "thesis" ALTER COLUMN "creator_id" int NOT NULL`);
    await queryRunner.query(
      `CREATE INDEX "IDX_67153d3f7799c7b9733e61343a" ON "thesis_lecturer" ("thesisId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a3d4fbb685d1d4b265fbfe2575" ON "thesis_lecturer" ("lecturerId") `
    );
    await queryRunner.query(
      `ALTER TABLE "student" ADD CONSTRAINT "FK_3d8016e1cb58429474a3c041904" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "FK_e126110a891f73b8710b65bbce9" FOREIGN KEY ("thesis_id") REFERENCES "thesis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "FK_5bf87e4ac0f623f908ba6bb80a8" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis" ADD CONSTRAINT "FK_8268581df2c110d3a057f13354a" FOREIGN KEY ("creator_id") REFERENCES "lecturer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lecturer" ADD CONSTRAINT "FK_e9647bfd5a4c128c9cc3e8cf99c" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "FK_67153d3f7799c7b9733e61343a1" FOREIGN KEY ("thesisId") REFERENCES "thesis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "FK_a3d4fbb685d1d4b265fbfe2575d" FOREIGN KEY ("lecturerId") REFERENCES "lecturer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "FK_a3d4fbb685d1d4b265fbfe2575d"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "FK_67153d3f7799c7b9733e61343a1"`
    );
    await queryRunner.query(
      `ALTER TABLE "lecturer" DROP CONSTRAINT "FK_e9647bfd5a4c128c9cc3e8cf99c"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis" DROP CONSTRAINT "FK_8268581df2c110d3a057f13354a"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "FK_5bf87e4ac0f623f908ba6bb80a8"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "FK_e126110a891f73b8710b65bbce9"`
    );
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "FK_3d8016e1cb58429474a3c041904"`
    );
    await queryRunner.query(`DROP INDEX "IDX_a3d4fbb685d1d4b265fbfe2575" ON "thesis_lecturer"`);
    await queryRunner.query(`DROP INDEX "IDX_67153d3f7799c7b9733e61343a" ON "thesis_lecturer"`);
    await queryRunner.query(`ALTER TABLE "thesis" ALTER COLUMN "creator_id" int`);
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "DF_23a557e4337ec953316ba539600"`
    );
    await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "is_graduate" tinyint`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "user_type" tinyint`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_admin" tinyint`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "status" tinyint`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "PK_6c4d147bf1b0e543ae88c18462a"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "PK_67153d3f7799c7b9733e61343a1" PRIMARY KEY ("thesisId")`
    );
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" DROP COLUMN "lecturerId"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "PK_67153d3f7799c7b9733e61343a1"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" DROP COLUMN "thesisId"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "PK_e45adc47d24c0707f269897dad2"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "PK_e126110a891f73b8710b65bbce9" PRIMARY KEY ("thesis_id")`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "student_id"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "PK_e126110a891f73b8710b65bbce9"`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "thesis_id"`);
    await queryRunner.query(`ALTER TABLE "thesis_student" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" ADD "lecturer" int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "PK_512b5d85dfdc781b219826030c3" PRIMARY KEY ("lecturer")`
    );
    await queryRunner.query(`ALTER TABLE "thesis_lecturer" ADD "thesis" int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" DROP CONSTRAINT "PK_512b5d85dfdc781b219826030c3"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "PK_91c0eb5923a0d5a9835a2544a7a" PRIMARY KEY ("thesis", "lecturer")`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "student" int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "PK_3bbc4361a8fa12b72b43f5b1052" PRIMARY KEY ("student")`
    );
    await queryRunner.query(`ALTER TABLE "thesis_student" ADD "thesis" int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "thesis_student" DROP CONSTRAINT "PK_3bbc4361a8fa12b72b43f5b1052"`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "PK_0480b167258b67624ca902a02f9" PRIMARY KEY ("thesis", "student")`
    );
    await queryRunner.query(`EXEC sp_rename "thesis.creator_id", "creator"`);
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "FK_11f51415b4f129462ee6bb7ddb0" FOREIGN KEY ("thesis") REFERENCES "thesis"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_lecturer" ADD CONSTRAINT "FK_512b5d85dfdc781b219826030c3" FOREIGN KEY ("lecturer") REFERENCES "lecturer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lecturer" ADD CONSTRAINT "FK_e9647bfd5a4c128c9cc3e8cf99c" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis" ADD CONSTRAINT "FK_51d2c8dca12e4a82a4767a9297e" FOREIGN KEY ("creator") REFERENCES "lecturer"("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "FK_c960a493ae730b158d11968c0cb" FOREIGN KEY ("thesis") REFERENCES "thesis"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "thesis_student" ADD CONSTRAINT "FK_3bbc4361a8fa12b72b43f5b1052" FOREIGN KEY ("student") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "student" ADD CONSTRAINT "FK_3d8016e1cb58429474a3c041904" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }
}
