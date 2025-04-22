import { MigrationInterface, QueryRunner } from "typeorm";

export class addNumPeopleToRequest1679931591257 implements MigrationInterface {
    name = 'addNumPeopleToRequest1679931591257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request\` ADD \`numPeople\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request\` DROP COLUMN \`numPeople\``);
    }

}
