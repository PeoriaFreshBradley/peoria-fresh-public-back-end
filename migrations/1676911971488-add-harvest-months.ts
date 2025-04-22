import { MigrationInterface, QueryRunner } from "typeorm";

export class addHarvestMonths1676911971488 implements MigrationInterface {
    name = 'addHarvestMonths1676911971488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produce\` ADD \`harvestStart\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` ADD \`harvestEnd\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produce\` DROP COLUMN \`harvestEnd\``);
        await queryRunner.query(`ALTER TABLE \`produce\` DROP COLUMN \`harvestStart\``);
    }

}
