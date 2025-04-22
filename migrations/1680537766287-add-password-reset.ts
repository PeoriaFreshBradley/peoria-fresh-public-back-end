import { MigrationInterface, QueryRunner } from "typeorm";

export class addPasswordReset1680537766287 implements MigrationInterface {
    name = 'addPasswordReset1680537766287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`resetPasswordRequestDate\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`resetPasswordRequestDate\``);
    }

}
