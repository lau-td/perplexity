import { MigrationInterface, QueryRunner } from "typeorm";

export class New4InitSchema1732689851682 implements MigrationInterface {
    name = 'New4InitSchema1732689851682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeddings" DROP COLUMN "embedding"`);
        await queryRunner.query(`ALTER TABLE "embeddings" ADD "embedding" double precision array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeddings" DROP COLUMN "embedding"`);
        await queryRunner.query(`ALTER TABLE "embeddings" ADD "embedding" double precision`);
    }

}
