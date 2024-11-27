import { MigrationInterface, QueryRunner } from "typeorm";

export class New3InitSchema1732689433873 implements MigrationInterface {
    name = 'New3InitSchema1732689433873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dataset_document_joins" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "dataset_id" uuid NOT NULL, "document_id" uuid NOT NULL, CONSTRAINT "PK_4d31e53fe6e40e838a3e73cf435" PRIMARY KEY ("dataset_id", "document_id"))`);
        await queryRunner.query(`ALTER TABLE "dataset_document_joins" ADD CONSTRAINT "FK_d29e1ca75ccc0dfdb048b263082" FOREIGN KEY ("dataset_id") REFERENCES "datasets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dataset_document_joins" ADD CONSTRAINT "FK_8dc9d64ed5243fe74d7393453bf" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dataset_document_joins" DROP CONSTRAINT "FK_8dc9d64ed5243fe74d7393453bf"`);
        await queryRunner.query(`ALTER TABLE "dataset_document_joins" DROP CONSTRAINT "FK_d29e1ca75ccc0dfdb048b263082"`);
        await queryRunner.query(`DROP TABLE "dataset_document_joins"`);
    }

}
