import { MigrationInterface, QueryRunner } from "typeorm";

export class makeRefreshTokenLarger1677716172241 implements MigrationInterface {
    name = 'makeRefreshTokenLarger1677716172241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_c31d0a2f38e6e99110df62ab0a\` ON \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` DROP COLUMN \`token\``);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` ADD \`token\` varchar(2048) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_token\` DROP COLUMN \`token\``);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` ADD \`token\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c31d0a2f38e6e99110df62ab0a\` ON \`refresh_token\` (\`token\`)`);
    }

}
