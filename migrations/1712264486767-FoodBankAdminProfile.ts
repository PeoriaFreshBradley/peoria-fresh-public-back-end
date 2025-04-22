import { MigrationInterface, QueryRunner } from "typeorm"

export class FoodBankAdminProfile1712264486767 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `user` DROP FOREIGN KEY `FK_259130c6a99ebfb1d6b722fc0f0`');
        await queryRunner.query('ALTER TABLE `user` DROP COLUMN `foodBankProfileId`');
        await queryRunner.query('ALTER TABLE `user` ADD COLUMN `foodBankProfileId` INT NULL AFTER `gardenerProfileId`');
        await queryRunner.query('CREATE UNIQUE INDEX `IDX_foodbankid` ON `user` (`foodBankProfileId`) USING BTREE');
        await queryRunner.query('CREATE TABLE `food_bank_admin` (`id` INT(11) NOT NULL AUTO_INCREMENT, `createdAt` DATETIME(6) NOT NULL DEFAULT current_timestamp(6), `updatedAt` DATETIME(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6), `name` VARCHAR(255) NOT NULL, `foodBankId` INT DEFAULT NULL, `permission` INT NOT NULL, `invitationEmail` VARCHAR(255) NOT NULL, `invitationCode` VARCHAR(256) NOT NULL, PRIMARY KEY (`id`) USING BTREE, UNIQUE INDEX `invitationEmail` (`invitationEmail`), CONSTRAINT `FK_admin_foodbank` FOREIGN KEY (`foodBankId`) REFERENCES `food_bank` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT)');
        await queryRunner.query('ALTER TABLE `user` ADD CONSTRAINT `FK_user_foodBankAdmin` FOREIGN KEY (`foodBankProfileId`) REFERENCES `food_bank_admin` (`id`)');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `food_bank_admin` DROP CONSTRAINT `FK_admin_foodbank`');
        await queryRunner.query('DROP TABLE `food_bank_admin`');
        await queryRunner.query('ALTER TABLE `user` DROP CONSTRAINT `FK_user_foodBankAdmin`, ADD CONSTRAINT `FK_259130c6a99ebfb1d6b722fc0f0` FOREIGN KEY (`foodBankProfileId`) REFERENCES `food_bank` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT')
    }

}
