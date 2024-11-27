import { MigrationInterface, QueryRunner } from "typeorm";

export class New5InitSchema1732691494509 implements MigrationInterface {
    name = 'New5InitSchema1732691494509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeddings" DROP CONSTRAINT "FK_20705e934f7bd72413240948bf9"`);
        await queryRunner.query(`ALTER TABLE "embeddings" ADD CONSTRAINT "UQ_20705e934f7bd72413240948bf9" UNIQUE ("document_segment_id")`);
        await queryRunner.query(`ALTER TABLE "embeddings" ADD CONSTRAINT "FK_20705e934f7bd72413240948bf9" FOREIGN KEY ("document_segment_id") REFERENCES "document_segments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeddings" DROP CONSTRAINT "FK_20705e934f7bd72413240948bf9"`);
        await queryRunner.query(`ALTER TABLE "embeddings" DROP CONSTRAINT "UQ_20705e934f7bd72413240948bf9"`);
        await queryRunner.query(`ALTER TABLE "embeddings" ADD CONSTRAINT "FK_20705e934f7bd72413240948bf9" FOREIGN KEY ("document_segment_id") REFERENCES "document_segments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
