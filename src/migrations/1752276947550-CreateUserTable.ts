import { UserEntity } from "@/src/modules/master/user/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1752276947550 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
