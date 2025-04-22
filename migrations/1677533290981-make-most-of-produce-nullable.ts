import { MigrationInterface, QueryRunner } from "typeorm";

export class makeMostOfProduceNullable1677533290981 implements MigrationInterface {
    name = 'makeMostOfProduceNullable1677533290981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`smallPhotoURL\` \`smallPhotoURL\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`largePhotoURL\` \`largePhotoURL\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`type\` \`type\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`difficulty\` \`difficulty\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`growingZone\` \`growingZone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`season\` \`season\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`harvestStart\` \`harvestStart\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`harvestEnd\` \`harvestEnd\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`harvestEnd\` \`harvestEnd\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`harvestStart\` \`harvestStart\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`season\` \`season\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`growingZone\` \`growingZone\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`difficulty\` \`difficulty\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`type\` \`type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`largePhotoURL\` \`largePhotoURL\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produce\` CHANGE \`smallPhotoURL\` \`smallPhotoURL\` varchar(255) NOT NULL`);
    }

}
