import { MigrationInterface, QueryRunner } from "typeorm";

export class New2InitSchema1732689276571 implements MigrationInterface {
    name = 'New2InitSchema1732689276571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeddings" DROP CONSTRAINT "FK_af7cbcfb2b78ba6e749aa419dfa"`);
        await queryRunner.query(`ALTER TABLE "embeddings" RENAME COLUMN "document_id" TO "document_segment_id"`);
        await queryRunner.query(`ALTER TABLE "embeddings" ADD CONSTRAINT "FK_20705e934f7bd72413240948bf9" FOREIGN KEY ("document_segment_id") REFERENCES "document_segments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeddings" DROP CONSTRAINT "FK_20705e934f7bd72413240948bf9"`);
        await queryRunner.query(`ALTER TABLE "embeddings" RENAME COLUMN "document_segment_id" TO "document_id"`);
        await queryRunner.query(`ALTER TABLE "embeddings" ADD CONSTRAINT "FK_af7cbcfb2b78ba6e749aa419dfa" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
