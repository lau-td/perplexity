import { MigrationInterface, QueryRunner } from "typeorm";

export class SecondInitSchema1732612439247 implements MigrationInterface {
    name = 'SecondInitSchema1732612439247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "embeddings" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "embedding" double precision, "metadata" jsonb, "content" character varying, CONSTRAINT "PK_19b6b451e1ef345884caca1f544" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "documents" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "youtube_id" uuid NOT NULL, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "document_segments" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" integer NOT NULL, "content" text NOT NULL, "document_id" uuid NOT NULL, "embedding_id" uuid NOT NULL, CONSTRAINT "PK_dd916ea1f6baa18bcbc861eb173" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_df888e3702c45a9193923494a08" FOREIGN KEY ("youtube_id") REFERENCES "youtubes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_segments" ADD CONSTRAINT "FK_998173c868137b94b25332360e4" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_segments" ADD CONSTRAINT "FK_5ae66d663d40dc94576c37408fb" FOREIGN KEY ("embedding_id") REFERENCES "embeddings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_segments" DROP CONSTRAINT "FK_5ae66d663d40dc94576c37408fb"`);
        await queryRunner.query(`ALTER TABLE "document_segments" DROP CONSTRAINT "FK_998173c868137b94b25332360e4"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_df888e3702c45a9193923494a08"`);
        await queryRunner.query(`DROP TABLE "document_segments"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TABLE "embeddings"`);
    }

}
