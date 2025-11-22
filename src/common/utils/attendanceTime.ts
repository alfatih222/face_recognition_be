import { MSettingEntity } from '@/src/modules/master/m_setting/m_setting.entity';
import * as moment from 'moment';

export function getAttendanceTypeByTime(setting: MSettingEntity): any {
    const now = moment();
    const masukStart = moment(setting.jamMasuk, 'HH:mm').subtract(0, 'minutes'); 
    const masukEnd = moment(setting.jamMasuk, 'HH:mm').add(60, 'minutes'); 
    const pulangStart = moment(setting.jamPulang, 'HH:mm');
    let type:string= 'Invalid';
    if (now.isBetween(masukStart, masukEnd)) return type = 'Masuk';
    if (now.isSameOrAfter(pulangStart)) return type = 'Pulang';

    return type;
}
