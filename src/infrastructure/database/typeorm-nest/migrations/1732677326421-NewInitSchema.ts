import { MigrationInterface, QueryRunner } from "typeorm";

export class NewInitSchema1732677326421 implements MigrationInterface {
    name = 'NewInitSchema1732677326421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeddings" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "document_segments" ADD "metadata" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_segments" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "embeddings" ADD "metadata" jsonb`);
    }

}
