import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExplanationFieldToFlashCard1732787792445 implements MigrationInterface {
    name = 'AddExplanationFieldToFlashCard1732787792445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_cards" ADD "explanation" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_cards" DROP COLUMN "explanation"`);
    }

}
