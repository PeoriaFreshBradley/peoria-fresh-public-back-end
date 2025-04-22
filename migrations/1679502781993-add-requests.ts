import { MigrationInterface, QueryRunner } from "typeorm";

export class addRequests1679502781993 implements MigrationInterface {
    name = 'addRequests1679502781993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`request\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`amount\` int NOT NULL, \`requestDate\` date NOT NULL, \`produceId\` int NULL, \`ticketId\` int NULL, \`foodBankId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`requestDate\``);
        await queryRunner.query(`ALTER TABLE \`request\` ADD CONSTRAINT \`FK_04fafd70d626307716c3597b0b7\` FOREIGN KEY (\`produceId\`) REFERENCES \`produce\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request\` ADD CONSTRAINT \`FK_e2c248ccb1d1903c269ef502692\` FOREIGN KEY (\`ticketId\`) REFERENCES \`ticket\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request\` ADD CONSTRAINT \`FK_f6b76b95cb158d7fd2a84e57f5b\` FOREIGN KEY (\`foodBankId\`) REFERENCES \`food_bank\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_f6b76b95cb158d7fd2a84e57f5b\``);
        await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_e2c248ccb1d1903c269ef502692\``);
        await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_04fafd70d626307716c3597b0b7\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD \`requestDate\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP TABLE \`request\``);
    }

}
