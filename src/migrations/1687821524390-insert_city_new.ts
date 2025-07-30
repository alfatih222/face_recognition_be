import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
export class InsertCityNew1687821524390 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.commitTransaction();
    await queryRunner.startTransaction();
    const queries = fs.readFileSync(
      __dirname + '/../../src/migrations/queries/029_new_city_sync.sql',
    );

    await queryRunner.query(queries.toString());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM m_city_sync`);
  }
}
