import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1732609087399 implements MigrationInterface {
    name = 'InitSchema1732609087399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "datasets" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_1bf831e43c559a240303e23d038" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "youtubes" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "video_id" character varying(255) NOT NULL, "url" character varying(255) NOT NULL, "metadata" jsonb NOT NULL, CONSTRAINT "PK_ca0c369d01879ded3258eec8c0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "datasets" ADD CONSTRAINT "FK_3c3d14a24986464923d285b178d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "datasets" DROP CONSTRAINT "FK_3c3d14a24986464923d285b178d"`);
        await queryRunner.query(`DROP TABLE "youtubes"`);
        await queryRunner.query(`DROP TABLE "datasets"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
