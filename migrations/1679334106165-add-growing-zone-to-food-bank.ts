import { MigrationInterface, QueryRunner } from "typeorm";

export class addGrowingZoneToFoodBank1679334106165 implements MigrationInterface {
    name = 'addGrowingZoneToFoodBank1679334106165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`food_bank\` ADD \`growingZone\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`food_bank\` DROP COLUMN \`growingZone\``);
    }

}
