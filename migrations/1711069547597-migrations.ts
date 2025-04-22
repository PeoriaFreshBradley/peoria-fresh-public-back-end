import { MigrationInterface, QueryRunner } from "typeorm"

export class Migrations1711069547597 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `delivery` ADD COLUMN `type` ENUM(\'donated\',\'grown\') NOT NULL');
        await queryRunner.query('ALTER TABLE `food_bank` ADD COLUMN `locationId` INT DEFAULT NULL');
        await queryRunner.query('ALTER TABLE `food_bank` ADD CONSTRAINT `FK_foodbank_location` FOREIGN KEY (`locationId`) REFERENCES `location` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT');
        await queryRunner.query('ALTER TABLE `gardener` ADD COLUMN `visibility` ENUM(\'public\',\'private\') NOT NULL DEFAULT \'private\'');
        await queryRunner.query('ALTER TABLE `gardener` ADD COLUMN `bio` VARCHAR(500) DEFAULT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `delivery` DROP COLUMN `type`');
        await queryRunner.query('ALTER TABLE `food_bank` DROP FOREIGN KEY `foodbank_location`');
        await queryRunner.query('ALTER TABLE `food_bank` DROP COLUMN `locationId`');
        await queryRunner.query('ALTER TABLE `gardener` DROP COLUMN `visibility`');
        await queryRunner.query('ALTER TABLE `gardener` DROP COLUMN `bio`)');
    }

}
