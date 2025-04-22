import { MigrationInterface, QueryRunner } from "typeorm"

export class RemovedIndividualScore1740163203648 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('ALTER TABLE `gardener` DROP COLUMN `individualScore`' ); 

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('ALTER TABLE `gardener` ADD COLUMN `individualScore` DOUBLE');

    }

}
