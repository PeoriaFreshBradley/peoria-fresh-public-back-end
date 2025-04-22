import { query } from "express"
import { MigrationInterface, QueryRunner } from "typeorm"

export class ProduceAndGardenerChangesPlusBadges1739393809180 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('ALTER TABLE `produce` ADD COLUMN `priceForScoring` DOUBLE NOT NULL AFTER `unitMultiplier`, ADD COLUMN `multiplierForScoring` DOUBLE NOT NULL AFTER `priceForScoring`, ADD COLUMN `daysToGrow` INT NOT NULL DEFAULT (0) AFTER `multiplierForScoring` ' ); //DROP COLUMN `weeks` 
        await queryRunner.query('ALTER TABLE `gardener`ADD COLUMN `isPlayer` TINYINT NOT NULL DEFAULT \'0\' AFTER `bio`, ADD COLUMN `individualScore` DOUBLE NOT NULL AFTER `isPlayer`;'); 
        await queryRunner.query('CREATE TABLE `badge` (`id` INT NOT NULL AUTO_INCREMENT, `createdAt` DATETIME(6) NOT NULL DEFAULT (now()), `updatedAt` DATETIME(6) NOT NULL DEFAULT (now()), `name` VARCHAR(50) NOT NULL ,`description` VARCHAR(255) NOT NULL, `criteria` VARCHAR(255) NOT NULL, `imageURL` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`)) ');
        await queryRunner.query('CREATE TABLE `user_badge` ( `id` INT NOT NULL AUTO_INCREMENT, `gardenerId` INT NOT NULL DEFAULT \'0\', `badgeId` INT NOT NULL DEFAULT \'0\', `awardedAt` DATETIME NOT NULL DEFAULT (now()), PRIMARY KEY (`id`) USING BTREE, INDEX `gardenerId` (`gardenerId`) USING BTREE, INDEX `badgeId` (`badgeId`) USING BTREE, CONSTRAINT `badgeId` FOREIGN KEY (`badgeId`) REFERENCES `badge` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION, CONSTRAINT `gardenerId` FOREIGN KEY (`gardenerId`) REFERENCES `gardener` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION )');
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('ALTER TABLE `produce` DROP COLUMN `priceForScoring`');
        await queryRunner.query('ALTER TABLE `produce` DROP COLUMN `multiplierForScoring`');
        await queryRunner.query('ALTER TABLE `produce` DROP COLUMN `daysToGrow`');
        await queryRunner.query('ALTER TABLE `gardener` DROP COLUMN `isPlayer`');
        await queryRunner.query('ALTER TABLE `gardener` DROP COLUMN `individualScore`');
        await queryRunner.query('DROP TABLE `badge`')
        await queryRunner.query('DROP TABLE `user_badge`')

    }

}
