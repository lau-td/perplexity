import { MigrationInterface, QueryRunner } from "typeorm";

export class New6InitSchema1732694045583 implements MigrationInterface {
    name = 'New6InitSchema1732694045583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "datasets" ADD "description" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "datasets" DROP COLUMN "description"`);
    }

}
