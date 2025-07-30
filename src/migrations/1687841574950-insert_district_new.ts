import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
export class InsertDistrictNew1687841574950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.commitTransaction();
    await queryRunner.startTransaction();

    const queries1 = fs.readFileSync(
      __dirname + '/../../src/migrations/queries/029_new_district_1.sql',
    );

    await queryRunner.query(queries1.toString());

    const queries2 = fs.readFileSync(
      __dirname + '/../../src/migrations/queries/029_new_district_2.sql',
    );

    await queryRunner.query(queries2.toString());

    const queries3 = fs.readFileSync(
      __dirname + '/../../src/migrations/queries/029_new_district_3.sql',
    );

    await queryRunner.query(queries3.toString());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM m_district_sync`);
  }
}
