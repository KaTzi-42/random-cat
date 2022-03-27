import {MigrationInterface, QueryRunner} from "typeorm";

export class create1644412254931 implements MigrationInterface {
    name = 'create1644412254931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cat_type_enum" AS ENUM('jpg', 'png', 'gif')`);
        await queryRunner.query(`CREATE TABLE "cat" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" "public"."cat_type_enum" NOT NULL, CONSTRAINT "PK_7704d5c2c0250e4256935ae31b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying, "email" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "cat"`);
        await queryRunner.query(`DROP TYPE "public"."cat_type_enum"`);
    }

}
