import {MigrationInterface, QueryRunner} from "typeorm";

export class renameColumn1644584301942 implements MigrationInterface {
    name = 'renameColumn1644584301942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updateAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "create_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "update_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "update_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "create_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
