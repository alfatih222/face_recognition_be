import { Module } from '@nestjs/common';
import { RolePermissionService } from './role_permission.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { RolePermissionEntity } from './role_permission.entity';
import { RolePermissionDto } from './role_permission.dto';
import { RolePermissionInput } from './role_permission.input';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      services: [RolePermissionService],
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          RolePermissionEntity,
        ]),
      ],
      resolvers: [
        {
          DTOClass: RolePermissionDto,
          EntityClass: RolePermissionEntity,
          ServiceClass: RolePermissionService,
          CreateDTOClass: RolePermissionInput,
          UpdateDTOClass: RolePermissionInput,
          guards: [JwtAuthGuard],
          read: {
            one: {
              name: 'rolePermision',

            },
            many: {
              name: 'rolePermisions',
            },
          },
          create: {
            one: {
              name: 'rolePermisionCreate',
            },
            many: { disabled: true },
          },
          update: {
            one: { name: 'rolePermisionUpdate' },
            many: { disabled: true },
          },
          delete: {
            one: { name: 'rolePermisionDelete' },
            many: { disabled: true },
          },
        },
      ],
    }),
  ],
  providers: [RolePermissionService],
})
export class RolePermissionModule { }
