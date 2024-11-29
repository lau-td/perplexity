import { MigrationInterface, QueryRunner } from "typeorm";

export class New8InitSchema1732854589138 implements MigrationInterface {
    name = 'New8InitSchema1732854589138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "document_chapters" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, "subtitle" character varying NOT NULL, "position" integer NOT NULL, "document_id" uuid NOT NULL, CONSTRAINT "PK_98352aeae4643b3fe61bcdc039d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "document_chapters" ADD CONSTRAINT "FK_12e1013b654ad6bbb7dfc4c1e89" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_chapters" DROP CONSTRAINT "FK_12e1013b654ad6bbb7dfc4c1e89"`);
        await queryRunner.query(`DROP TABLE "document_chapters"`);
    }

}
