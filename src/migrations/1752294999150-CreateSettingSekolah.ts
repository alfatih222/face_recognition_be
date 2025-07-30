import * as fs from 'fs';
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSettingSekolah1752294999150 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.commitTransaction();
        await queryRunner.startTransaction();
        const queries = fs.readFileSync(
            __dirname + '/../../src/migrations/queries/setting.sql',
        );

        await queryRunner.query(queries.toString());
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM m_setting`);
    }

}
