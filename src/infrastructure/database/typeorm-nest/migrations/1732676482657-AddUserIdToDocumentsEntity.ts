import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToDocumentsEntity1732676482657 implements MigrationInterface {
    name = 'AddUserIdToDocumentsEntity1732676482657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_c7481daf5059307842edef74d73" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_c7481daf5059307842edef74d73"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "user_id"`);
    }

}
