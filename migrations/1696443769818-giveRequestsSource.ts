import { MigrationInterface, QueryRunner } from "typeorm"

export class GiveRequestsSource1696443769818 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE \`request\` ADD COLUMN \`requestFrom\` VARCHAR(200) DEFAULT NULL AFTER \`requestDate\`;')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE \`request\` DROP COLUMN \`requestFrom\`;')
    }

}
