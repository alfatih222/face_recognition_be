import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../master/user/user.entity';
import { AttendanceEntity } from '../attendance/attendance.entity';
import { MSettingEntity } from '../master/m_setting/m_setting.entity';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,

    @InjectRepository(AttendanceEntity)
    private attendanceRepo: Repository<AttendanceEntity>,

    @InjectRepository(MSettingEntity)
    private settingRepo: Repository<MSettingEntity>,
  ) {}


  @Cron('07 23 * * *')
async autoCreateAttendance() {
  this.logger.log('CRON RUNNING: Auto checking missing attendance...');

  const today = new Date();
  today.setHours(23, 59, 59, 999); 

  // Ambil semua user aktif
  const allUsers = await this.userRepo.find({
    where: { isActive: true },
  });

  for (const user of allUsers) {
    const lastAttendance = await this.attendanceRepo.findOne({
      where: { user_id: user.id },
      order: { date: 'DESC' },
    });

    let startDate: Date;

    if (!lastAttendance) {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(lastAttendance.date);
      startDate.setDate(startDate.getDate() + 1);
    }

    startDate.setHours(23, 59, 59, 999);

    for (
      let d = new Date(startDate);
      d.getTime() <= today.getTime();
      d.setDate(d.getDate() + 1)
    ) {
      const dayIndex = d.getDay();
      if (dayIndex === 0) {
        this.logger.log(`SKIP SUNDAY → ${d.toISOString().split('T')[0]}`);
        continue;
      }

      const dStr = d.toISOString().split('T')[0];

      const exist = await this.attendanceRepo.findOne({
        where: { user_id: user.id, date: dStr },
      });

      if (!exist) {
        const newData = this.attendanceRepo.create({
          user_id: user.id,
          date: dStr,
          checkIn: null,
          checkOut: null,
          latitude: '',
          longitude: '',
          type: '',
        });

        await this.attendanceRepo.save(newData);

        this.logger.log(`AUTO INSERT → user: ${user.email}, tanggal: ${dStr}`);
      }
    }
  }

  this.logger.log('CRON DONE.');
}

@Cron('09 23 * * *')
async autoUpdateAttendanceType() {
  this.logger.log('CRON RUNNING: Updating attendance types at 14:00...');

  const today = new Date().toISOString().split('T')[0];
console.log('today', today)
  // Ambil semua data attendance hari ini
  const attendanceList = await this.attendanceRepo.find({
    where: { date: today },
  });

  console.log('as', attendanceList)

  for (const att of attendanceList) {
    let newType = att.type;

    const hasCheckIn = !!att.checkIn;
    const hasCheckOut = !!att.checkOut;

    if (hasCheckIn && hasCheckOut) {
      newType = 'absen';
    } else if (hasCheckIn && !hasCheckOut) {
      newType = 'alfa';
    } else if (!hasCheckIn && hasCheckOut) {
      newType = 'alfa';
    } else {
      newType = '';
    }
console.log(newType)
console.log(att.type)
    // Update jika type berbeda
    if (newType !== att.type) {
      att.type = newType;
      await this.attendanceRepo.save(att);
      this.logger.log(
        `Update attendance user_id=${att.user_id} => type: ${newType}`,
      );
    }
  }

  this.logger.log('CRON UPDATE DONE.');
}

}
