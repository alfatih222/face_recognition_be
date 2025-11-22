import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/src/modules/master/user/user.entity';
import { AttendanceEntity } from '@/src/modules/attendance/attendance.entity';
import { MSettingEntity } from '../master/m_setting/m_setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AttendanceEntity,
      MSettingEntity,
    ]),
  ],
  providers: [CronService],
})
export class CronModule {}
