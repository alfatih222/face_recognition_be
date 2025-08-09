import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceResolver } from './attendance.resolver';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { AttendanceEntity } from '@/src/modules/attendance/attendance.entity';
import { AttendanceDto } from '@/src/modules/attendance/attendance.dto';
import { UserModule } from '@/src/modules/master/user/user.module';
import { MSettingModule } from '../master/m_setting/m_setting.module';
import { UserService } from '../master/user/user.service';
import { MSettingService } from '../master/m_setting/m_setting.service';
import { UserEntity } from '../master/user/user.entity';
import { MSettingEntity } from '../master/m_setting/m_setting.entity';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      services: [AttendanceService],
      imports: [NestjsQueryTypeOrmModule.forFeature([AttendanceEntity, UserEntity, MSettingEntity])],
      resolvers: [
        {
          DTOClass: AttendanceDto,
          ServiceClass: AttendanceService,
          EntityClass: AttendanceEntity,
          guards:[JwtAuthGuard],
          read: {
            one: { name: 'absen' },
            many: { name: 'absens' },
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
        }
      ]
    })
  ],
  providers: [AttendanceService, AttendanceResolver ],
  exports: [AttendanceService]
})
export class AttendanceModule { }
