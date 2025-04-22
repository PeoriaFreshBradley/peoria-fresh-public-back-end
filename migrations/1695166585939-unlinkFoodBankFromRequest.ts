import { MigrationInterface, QueryRunner } from "typeorm"

export class UnlinkFoodBankFromRequest1695166585939 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \`request\` DROP CONSTRAINT \`FK_f6b76b95cb158d7fd2a84e57f5b\`;")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request\` ADD FOREIGN KEY \`FK_f6b76b95cb158d7fd2a84e57f5b\` (\`foodBankId\`) REFERENCES \`food_bank\` (\`id\`);`);
    }

}
