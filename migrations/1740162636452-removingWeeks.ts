import { MigrationInterface, QueryRunner } from "typeorm"

export class RemovingWeeks1740162636452 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('ALTER TABLE `produce` DROP COLUMN `weeks`' ); 
        await queryRunner.query('ALTER TABLE `produce` DROP COLUMN `daysToGrow`' ); 

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('ALTER TABLE `produce` ADD COLUMN `weeks` INT');
        await queryRunner.query('ALTER TABLE `produce` ADD COLUMN `daysToGrow` INT');

    }

}
