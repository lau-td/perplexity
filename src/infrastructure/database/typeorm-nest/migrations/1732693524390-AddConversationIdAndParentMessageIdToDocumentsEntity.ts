import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConversationIdAndParentMessageIdToDocumentsEntity1732693524390 implements MigrationInterface {
    name = 'AddConversationIdAndParentMessageIdToDocumentsEntity1732693524390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ADD "conversation_id" character varying`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "parent_message_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "parent_message_id"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "conversation_id"`);
    }

}
