import { MigrationInterface, QueryRunner } from "typeorm"

export class ColumnNamingMistake1713923160473 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('UPDATE `delivery` SET verifiedBy = NULL');
        await queryRunner.query('ALTER TABLE `delivery` DROP CONSTRAINT `FK_delivery_verifier`');

        await queryRunner.query('ALTER TABLE `delivery` DROP COLUMN `verifiedBy`, ADD COLUMN `verifiedById` INT DEFAULT NULL');
        await queryRunner.query('ALTER TABLE `delivery` ADD CONSTRAINT `FK_delivery_verified_id` FOREIGN KEY (`verifiedById`) REFERENCES `food_bank_admin` (`id`)');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('UPDATE `delivery` SET verifiedById = NULL');
        await queryRunner.query('ALTER TABLE `delivery` DROP CONSTRAINT `FK_delivery_verified_id`');

        await queryRunner.query('ALTER TABLE `delivery` DROP COLUMN `verifiedById`, ADD COLUMN `verifiedBy` INT DEFAULT NULL');
        await queryRunner.query('ALTER TABLE `delivery` ADD CONSTRAINT `FK_delivery_verifier` FOREIGN KEY (`verifiedBy`) REFERENCES `food_bank_admin` (`id`)');
    }

}
