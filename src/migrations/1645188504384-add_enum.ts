import {MigrationInterface, QueryRunner} from "typeorm";

export class addEnum1645188504384 implements MigrationInterface {
    name = 'addEnum1645188504384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."cat_type_enum" RENAME TO "cat_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."cat_type_enum" AS ENUM('jpeg', 'jpg', 'png', 'gif')`);
        await queryRunner.query(`ALTER TABLE "cat" ALTER COLUMN "type" TYPE "public"."cat_type_enum" USING "type"::"text"::"public"."cat_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cat_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cat_type_enum_old" AS ENUM('jpg', 'png', 'gif')`);
        await queryRunner.query(`ALTER TABLE "cat" ALTER COLUMN "type" TYPE "public"."cat_type_enum_old" USING "type"::"text"::"public"."cat_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."cat_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."cat_type_enum_old" RENAME TO "cat_type_enum"`);
    }

}
