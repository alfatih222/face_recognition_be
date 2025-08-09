import { MSettingEntity } from '@/src/modules/master/m_setting/m_setting.entity';
import * as moment from 'moment';

export function getAttendanceTypeByTime(setting: MSettingEntity): 'Masuk' | 'Pulang' | 'Invalid' {
    const now = moment();
    const masukStart = moment(setting.jamMasuk, 'HH:mm').subtract(0, 'minutes'); // 06:30
    const masukEnd = moment(setting.jamMasuk, 'HH:mm').add(600, 'minutes'); // 07:10
    const pulangStart = moment(setting.jamPulang, 'HH:mm');
    if (now.isBetween(masukStart, masukEnd)) return 'Masuk';
    if (now.isSameOrAfter(pulangStart)) return 'Pulang';

    return 'Invalid';
}
