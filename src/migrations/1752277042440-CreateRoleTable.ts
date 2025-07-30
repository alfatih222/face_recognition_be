import { RoleEntity } from "@/src/modules/master/m_role/role.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoleTable1752277042440 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const roleMethodeRepo = queryRunner.connection.getRepository(
            RoleEntity,
        );

        await roleMethodeRepo.insert([
            {
                id: "6a92adda-bfe8-4bd0-bf17-e581b97407ce",
                name: "guru",
                desc: "guru"
            },
            {
                id: "64971752-2b59-4a4e-b742-ecb337e3b386",
                name: "admin",
                desc: "Admin"
            },
            {
                id: "b7bf1ad2-96cf-46c3-a5af-16c085ae9385",
                name: "super admin",
                desc: "super admin"
            }
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const roleMethodeRepo = queryRunner.connection.getRepository(
            RoleEntity,
        );
        await roleMethodeRepo.clear();
    }

}
