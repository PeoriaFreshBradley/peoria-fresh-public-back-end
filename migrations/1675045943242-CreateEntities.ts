import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEntities1675045943242 implements MigrationInterface {
  name = 'CreateEntities1675045943242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`refresh_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`token\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`replacedAt\` datetime NULL, UNIQUE INDEX \`IDX_c31d0a2f38e6e99110df62ab0a\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`isSystemAdmin\` tinyint NOT NULL DEFAULT 0, \`gardenerProfileId\` int NULL, \`foodBankProfileId\` int NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`REL_611f042350cb66b2d7ea090db0\` (\`gardenerProfileId\`), UNIQUE INDEX \`REL_259130c6a99ebfb1d6b722fc0f\` (\`foodBankProfileId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`gardener\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`growing\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`amount\` int NOT NULL, \`expectedHarvest\` datetime NULL, \`plantingDate\` datetime NULL, \`deliveryDate\` datetime NULL, \`status\` enum ('accepted', 'planted', 'harvested', 'delivered') NOT NULL DEFAULT 'accepted', \`ticketId\` int NULL, \`gardenerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`produce_name\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`produceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`produce\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`smallPhotoURL\` varchar(255) NOT NULL, \`largePhotoURL\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`type\` varchar(255) NOT NULL, \`difficulty\` varchar(255) NOT NULL, \`weeks\` int NOT NULL, \`growingZone\` varchar(255) NOT NULL, \`season\` varchar(255) NOT NULL, \`newFlag\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ticket\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`amount\` int NOT NULL, \`requestDate\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`fulfilled\` tinyint NOT NULL DEFAULT 0, \`produceId\` int NULL, \`foodBankId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`food_bank\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`zip\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`website\` varchar(255) NOT NULL, \`hours\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_611f042350cb66b2d7ea090db05\` FOREIGN KEY (\`gardenerProfileId\`) REFERENCES \`gardener\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_259130c6a99ebfb1d6b722fc0f0\` FOREIGN KEY (\`foodBankProfileId\`) REFERENCES \`food_bank\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`growing\` ADD CONSTRAINT \`FK_192ff59991b81fbb59903d5fa3d\` FOREIGN KEY (\`ticketId\`) REFERENCES \`ticket\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`growing\` ADD CONSTRAINT \`FK_53afc4099a4f18bb0c2928e6c49\` FOREIGN KEY (\`gardenerId\`) REFERENCES \`gardener\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`produce_name\` ADD CONSTRAINT \`FK_4c1f8bc7293d4524a6f5216beea\` FOREIGN KEY (\`produceId\`) REFERENCES \`produce\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_a621e099200683a7ef020fd69e5\` FOREIGN KEY (\`produceId\`) REFERENCES \`produce\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_87a78709fbb75e3252cc791bc97\` FOREIGN KEY (\`foodBankId\`) REFERENCES \`food_bank\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_87a78709fbb75e3252cc791bc97\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_a621e099200683a7ef020fd69e5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`produce_name\` DROP FOREIGN KEY \`FK_4c1f8bc7293d4524a6f5216beea\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`growing\` DROP FOREIGN KEY \`FK_53afc4099a4f18bb0c2928e6c49\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`growing\` DROP FOREIGN KEY \`FK_192ff59991b81fbb59903d5fa3d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_259130c6a99ebfb1d6b722fc0f0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_611f042350cb66b2d7ea090db05\``,
    );
    await queryRunner.query(`DROP TABLE \`food_bank\``);
    await queryRunner.query(`DROP TABLE \`ticket\``);
    await queryRunner.query(`DROP TABLE \`produce\``);
    await queryRunner.query(`DROP TABLE \`produce_name\``);
    await queryRunner.query(`DROP TABLE \`growing\``);
    await queryRunner.query(`DROP TABLE \`gardener\``);
    await queryRunner.query(
      `DROP INDEX \`REL_259130c6a99ebfb1d6b722fc0f\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_611f042350cb66b2d7ea090db0\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_c31d0a2f38e6e99110df62ab0a\` ON \`refresh_token\``,
    );
    await queryRunner.query(`DROP TABLE \`refresh_token\``);
  }
}
