import { MigrationInterface, QueryRunner } from "typeorm";

export class FourthInitSchema1732616099838 implements MigrationInterface {
    name = 'FourthInitSchema1732616099838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "youtubes" ADD "summary" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "youtubes" DROP COLUMN "summary"`);
    }

}
