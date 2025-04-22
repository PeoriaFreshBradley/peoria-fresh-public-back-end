import { MigrationInterface, QueryRunner } from "typeorm";

export class makeWeeksNullable1676767458257 implements MigrationInterface {
    name = 'makeWeeksNullable1676767458257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`weeks\` \`weeks\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`weeks\` \`weeks\` int NOT NULL`);
    }

}
