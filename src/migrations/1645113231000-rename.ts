import {MigrationInterface, QueryRunner} from "typeorm";

export class rename1645113231000 implements MigrationInterface {
    name = 'rename1645113231000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cat" RENAME COLUMN "isValidate" TO "is_checked"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cat" RENAME COLUMN "is_checked" TO "isValidate"`);
    }

}
