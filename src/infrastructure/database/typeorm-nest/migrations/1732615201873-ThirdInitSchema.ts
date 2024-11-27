import { MigrationInterface, QueryRunner } from "typeorm";

export class ThirdInitSchema1732615201873 implements MigrationInterface {
    name = 'ThirdInitSchema1732615201873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_segments" DROP CONSTRAINT "FK_5ae66d663d40dc94576c37408fb"`);
        await queryRunner.query(`ALTER TABLE "embeddings" RENAME COLUMN "content" TO "document_id"`);
        await queryRunner.query(`ALTER TABLE "document_segments" DROP COLUMN "embedding_id"`);
        await queryRunner.query(`ALTER TABLE "embeddings" DROP COLUMN "document_id"`);
        await queryRunner.query(`ALTER TABLE "embeddings" ADD "document_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "embeddings" ADD CONSTRAINT "FK_af7cbcfb2b78ba6e749aa419dfa" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeddings" DROP CONSTRAINT "FK_af7cbcfb2b78ba6e749aa419dfa"`);
        await queryRunner.query(`ALTER TABLE "embeddings" DROP COLUMN "document_id"`);
        await queryRunner.query(`ALTER TABLE "embeddings" ADD "document_id" character varying`);
        await queryRunner.query(`ALTER TABLE "document_segments" ADD "embedding_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "embeddings" RENAME COLUMN "document_id" TO "content"`);
        await queryRunner.query(`ALTER TABLE "document_segments" ADD CONSTRAINT "FK_5ae66d663d40dc94576c37408fb" FOREIGN KEY ("embedding_id") REFERENCES "embeddings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
