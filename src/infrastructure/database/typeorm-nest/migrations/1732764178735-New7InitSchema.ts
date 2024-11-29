import { MigrationInterface, QueryRunner } from "typeorm";

export class New7InitSchema1732764178735 implements MigrationInterface {
    name = 'New7InitSchema1732764178735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "name"`);
    }

}
