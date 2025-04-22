import { query } from "express";
import { MigrationInterface, QueryRunner } from "typeorm"

export class UnlinkFoodBankFromTicket1695166117394 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP CONSTRAINT \`FK_87a78709fbb75e3252cc791bc97\`;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD FOREIGN KEY \`FK_87a78709fbb75e3252cc791bc97\` (\`foodBankId\`) REFERENCES \`food_bank\` (\`id\`);`);
    }

}
