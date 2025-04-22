import { MigrationInterface, QueryRunner } from "typeorm";

export class addMultiplierToProduce1678126917781 implements MigrationInterface {
    name = 'addMultiplierToProduce1678126917781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produce\` ADD \`unitMultiplier\` float NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produce\` DROP COLUMN \`unitMultiplier\``);
    }

}
