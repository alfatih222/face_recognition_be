import { MigrationInterface, QueryRunner } from "typeorm"
import * as fs from 'fs'
export class InsertSubdistrictNew1687844209019 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.commitTransaction();
      await queryRunner.startTransaction();
      
        const queries1 = fs.readFileSync(
          __dirname + '/../../src/migrations/queries/029_new_subdistrict_1.sql',
        );
    
        await queryRunner.query(queries1.toString());
        
        const queries2 = fs.readFileSync(
          __dirname + '/../../src/migrations/queries/029_new_subdistrict_2.sql',
        );
    
        await queryRunner.query(queries2.toString());
        
        const queries3 = fs.readFileSync(
          __dirname + '/../../src/migrations/queries/029_new_subdistrict_3.sql',
        );
    
        await queryRunner.query(queries3.toString());
        
        const queries4 = fs.readFileSync(
          __dirname + '/../../src/migrations/queries/029_new_subdistrict_4.sql',
        );
    
        await queryRunner.query(queries4.toString());
        
        const queries5 = fs.readFileSync(
          __dirname + '/../../src/migrations/queries/029_new_subdistrict_5.sql',
        );
    
        await queryRunner.query(queries5.toString());
        
        const queries6 = fs.readFileSync(
          __dirname + '/../../src/migrations/queries/029_new_subdistrict_6.sql',
        );
    
        await queryRunner.query(queries6.toString());
        
        const queries7 = fs.readFileSync(
          __dirname + '/../../src/migrations/queries/029_new_subdistrict_7.sql',
        );
    
        await queryRunner.query(queries7.toString());
        
        const queries8 = fs.readFileSync(
          __dirname + '/../../src/migrations/queries/029_new_subdistrict_8.sql',
        );
    
        await queryRunner.query(queries8.toString());
        
        const queries9 = fs.readFileSync(
          __dirname + '/../../src/migrations/queries/029_new_subdistrict_9.sql',
        );
    
        await queryRunner.query(queries9.toString());
        
        const queries10 = fs.readFileSync(
          __dirname + '/../../src/migrations/queries/029_new_subdistrict_10.sql',
        );
    
        await queryRunner.query(queries10.toString());
        
        
        const queries11 = fs.readFileSync(
          __dirname + '/../../src/migrations/queries/029_new_subdistrict_11.sql',
        );
    
        await queryRunner.query(queries11.toString());
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM m_subdistrict_sync`);
      }

}
