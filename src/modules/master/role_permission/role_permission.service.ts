
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { RolePermissionEntity } from './role_permission.entity';
@QueryService(RolePermissionEntity)
export class RolePermissionService extends TypeOrmQueryService<RolePermissionEntity> {
    constructor(
        @InjectRepository(RolePermissionEntity)
        private readonly rolePermissionRepo: Repository<RolePermissionEntity>
    ) {
        super(rolePermissionRepo, { useSoftDelete: true });
    }

}
