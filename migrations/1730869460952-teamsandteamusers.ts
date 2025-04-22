import { MigrationInterface, QueryRunner } from "typeorm"

export class Teamsandteamusers1730869460952 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('CREATE TABLE `team` (`id` INT NOT NULL AUTO_INCREMENT,`createdAt` DATETIME(6) NOT NULL DEFAULT (now(6)),`updatedAt` DATETIME(6) NOT NULL DEFAULT (now(6)) ON UPDATE CURRENT_TIMESTAMP(6),`teamName` VARCHAR(50) NOT NULL DEFAULT \'\',`totalScore` INT NOT NULL,PRIMARY KEY (`id`) USING BTREE)')
        await queryRunner.query('CREATE TABLE `team_user` (`id` INT NOT NULL AUTO_INCREMENT,`createdAt` DATETIME(6) NOT NULL DEFAULT (now(6)),`updatedAt` DATETIME(6) NOT NULL DEFAULT (now(6)) ON UPDATE CURRENT_TIMESTAMP(6),`teamId` INT NOT NULL DEFAULT \'0\',`userId` INT NOT NULL DEFAULT \'0\',`teamUserName` VARCHAR(50) NOT NULL DEFAULT \'0\',PRIMARY KEY (`id`) USING BTREE,CONSTRAINT `FK_teamId` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,CONSTRAINT `FK_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION)')

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('DROP TABLE `team_user`')
        await queryRunner.query('DROP TABLE `team`')

    }

}
