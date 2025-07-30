import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
export class InsertProvinceNew1687821505507 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.commitTransaction();
    await queryRunner.startTransaction();
    const queries = fs.readFileSync(
      __dirname + '/../../src/migrations/queries/029_new_province_sync.sql',
    );

    await queryRunner.query(queries.toString());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM m_province_sync`);
  }
}
