import { MSettingEntity } from '@/src/modules/master/m_setting/m_setting.entity';
import * as moment from 'moment';

export function getAttendanceTypeByTime(setting: MSettingEntity): 'Masuk' | 'Pulang' | 'Invalid' {
    const now = moment();
console.log('lksds', setting)
    // waktu masuk: 06:30 - 07:10
    const masukStart = moment(setting.jamMasuk, 'HH:mm').subtract(0, 'minutes'); // 06:30
    const masukEnd = moment(setting.jamMasuk, 'HH:mm').add(90, 'minutes'); // 07:10
    console.log('masukStart', masukStart)
    console.log('masukStart', masukStart)
    // waktu pulang: mulai dari jamPulang (13:00 atau 01:00 format 24 jam)
    const pulangStart = moment(setting.jamPulang, 'HH:mm');
    if (now.isBetween(masukStart, masukEnd)) return 'Masuk';
    if (now.isSameOrAfter(pulangStart)) return 'Pulang';

    return 'Invalid';
}
