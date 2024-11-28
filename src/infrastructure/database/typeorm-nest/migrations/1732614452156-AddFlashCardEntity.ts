import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFlashCardEntity1732614452156 implements MigrationInterface {
    name = 'AddFlashCardEntity1732614452156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flash_cards" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" text NOT NULL, "answer" text NOT NULL, "document_id" uuid NOT NULL, CONSTRAINT "PK_4c6e92c0625ff6d82bb774f84e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "flash_cards" ADD CONSTRAINT "FK_ef1b136795a6dd548ccd86d0a4c" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_cards" DROP CONSTRAINT "FK_ef1b136795a6dd548ccd86d0a4c"`);
        await queryRunner.query(`DROP TABLE "flash_cards"`);
    }

}
