import { Module } from '@nestjs/common';
import { MSettingService } from './m_setting.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { MSettingEntity } from '@/src/modules/master/m_setting/m_setting.entity';
import { MSettingDto } from '@/src/modules/master/m_setting/m_setting.dto';
import { MSettingInput, MSettingUpdate } from '@/src/modules/master/m_setting/m_setting.input';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';
import { RoleBaseGuard } from '@/src/common/guards/role-base.guard';
import { MSettingResolver } from './m_setting.resolver';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      services: [MSettingService],
      imports: [NestjsQueryTypeOrmModule.forFeature([MSettingEntity])],
      resolvers: [
        {
          DTOClass: MSettingDto,
          ServiceClass: MSettingService,
          EntityClass: MSettingEntity,
          CreateDTOClass: MSettingInput,
          UpdateDTOClass: MSettingUpdate,
          guards: [JwtAuthGuard, RoleBaseGuard],
          read: {
            one: { disabled: true },
            many: { disabled: true },
          },
          create: {
            one: { disabled: true },
            many: { disabled: true }
          },
          update: {
            one: { disabled: true },
            many: { disabled: true }
          },
          delete: {
            one: { disabled: true },
            many: { disabled: true }
          },
        },
      ],
    }),
  ],
  providers: [MSettingService, MSettingResolver],
  exports: [MSettingService]
})
export class MSettingModule { }

