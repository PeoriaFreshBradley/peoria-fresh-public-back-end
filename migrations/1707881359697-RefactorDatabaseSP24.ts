import { MigrationInterface, QueryRunner } from "typeorm"

export class RefactorDatabaseSP241707881359697 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `growing` ADD COLUMN `produceId` INT NOT NULL');
        await queryRunner.query('UPDATE `growing` SET `produceId` = (SELECT `produceId` FROM `ticket` WHERE `ticket`.`id` = `growing`.`ticketId` LIMIT 1)')
        await queryRunner.query('ALTER TABLE `growing` ADD CONSTRAINT `FK_growing_produce` FOREIGN KEY (`produceId`) REFERENCES `produce` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT')
        await queryRunner.query('ALTER TABLE `gardener` ADD COLUMN `hasGarden` TINYINT NOT NULL DEFAULT FALSE');

        await queryRunner.query('ALTER TABLE `request` DROP FOREIGN KEY `FK_e2c248ccb1d1903c269ef502692`, DROP COLUMN `numPeople`, DROP COLUMN `requestFrom`, DROP COLUMN `ticketId`, DROP COLUMN `foodBankId`');
        await queryRunner.query('ALTER TABLE `growing` DROP COLUMN `ticketId`, DROP FOREIGN KEY `FK_192ff59991b81fbb59903d5fa3d`');
        await queryRunner.query('DROP TABLE `ticket`');
        await queryRunner.query('CREATE TABLE `location` ( `id` INT(11) NOT NULL AUTO_INCREMENT, `createdAt` DATETIME NOT NULL DEFAULT current_timestamp(), `updatedAt` DATETIME NOT NULL DEFAULT current_timestamp(), `address` VARCHAR(50) NOT NULL, `city` VARCHAR(50) NOT NULL, `state` VARCHAR(50) NOT NULL, `country` VARCHAR(50) NOT NULL, `postal` INT(11) NOT NULL, PRIMARY KEY (`id`) USING BTREE, UNIQUE INDEX `UNIQUENESS` (`address`, `city`, `state`, `country`, `postal`) USING BTREE) ENGINE=InnoDB ')
        await queryRunner.query('CREATE TABLE `delivery` ( `id` int(11) NOT NULL AUTO_INCREMENT, `createdAt` datetime NOT NULL DEFAULT current_timestamp(), `updatedAt` datetime NOT NULL DEFAULT current_timestamp(), `produceId` int(11) NOT NULL DEFAULT 0, `providerId` int(11) NOT NULL, `locationId` int(11) NOT NULL, `amount` int(11) NOT NULL, `expectedDeliveryDate` date NOT NULL, `verifiedAmount` int(11) DEFAULT 0, `isVerified` tinyint(4) NOT NULL DEFAULT 0, `verifiedBy` int(11) DEFAULT NULL,  PRIMARY KEY (`id`), KEY `FK_delivery_location` (`locationId`),  KEY `FK_delivery_produce` (`produceId`),  KEY `FK_delivery_provider` (`providerId`),  KEY `FK_delivery_verifier` (`verifiedBy`),  CONSTRAINT `FK_delivery_location` FOREIGN KEY (`locationId`) REFERENCES `location` (`id`),  CONSTRAINT `FK_delivery_produce` FOREIGN KEY (`produceId`) REFERENCES `produce` (`id`),  CONSTRAINT `FK_delivery_provider` FOREIGN KEY (`providerId`) REFERENCES `gardener` (`id`),  CONSTRAINT `FK_delivery_verifier` FOREIGN KEY (`verifiedBy`) REFERENCES `user` (`id`)) ENGINE=InnoDB');
    
        await queryRunner.query('ALTER TABLE `request` ADD COLUMN `locationId` INT NULL, ADD CONSTRAINT `FK_request_location` FOREIGN KEY (`locationId`) REFERENCES `location` (`id`)')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `request` ADD COLUMN `ticketId`, ADD COLUMN `foodBankId`, ADD FOREIGN KEY `FK_e2c248ccb1d1903c269ef502692` (`ticketId`) REFERENCES `ticket`.`id` ON UPDATE RESTRICT ON DELETE RESTRICT');
        await queryRunner.query('ALTER TABLE `growing` ADD COLUMN `ticketId`, ADD FOREIGN KEY `FK_192ff59991b81fbb59903d5fa3d` (`ticketId`) REFERENCES `ticket`.`id` ON UPDATE RESTRICT ON DELETE RESTRICT');
        await queryRunner.query('ALTER TABLE `request` ADD COLUMN `numPeople` INT, ADD COLUMN `foodBankId` INT NULL, ADD COLUMN `requestFrom` VARCHAR(200) NULL');
        await queryRunner.query('CREATE TABLE `ticket` ( `id` INT(11) NOT NULL AUTO_INCREMENT, `createdAt` DATETIME(6) NOT NULL DEFAULT current_timestamp(6), `updatedAt` DATETIME(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6), `amount` INT(11) NOT NULL, `fulfilled` TINYINT(4) NOT NULL DEFAULT 0, `produceId` INT(11) NULL DEFAULT NULL, `foodBankId` INT(11) NULL DEFAULT NULL, PRIMARY KEY (`id`) USING BTREE, INDEX `FK_a621e099200683a7ef020fd69e5` (`produceId`) USING BTREE, CONSTRAINT `FK_a621e099200683a7ef020fd69e5` FOREIGN KEY (`produceId`) REFERENCES `produce` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT) ENGINE=InnoDB AUTO_INCREMENT=129');

        await queryRunner.query('DROP TABLE `location`')
        await queryRunner.query('DROP TABLE `delivery`')
        await queryRunner.query('ALTER TABLE `gardener` DROP COLUMN `hasGarden`');
        await queryRunner.query('ALTER TABLE `growing` DROP CONSTRAINT `FK_growing_produce`, DROP COLUMN `produceId`')
        await queryRunner.query('ALTER TABLE `request` DROP CONSTRAINT `FK_request_location`, DROP COLUMN `locationId`')

    }

}
