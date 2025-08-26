import { Either, either } from '@/src/common/utils/either';
import datasource from '@/src/config/typeorm.datasource.config';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import * as pdf from 'pdf-creator-node';
import * as fs from 'fs';
import { pathToUrl } from '@/src/common/utils/string-helpers';
import { Error } from '@/src/graphql/types/error.type';
import { AttendanceEntity } from '../../attendance/attendance.entity';
import { MSettingEntity } from '../m_setting/m_setting.entity';
import { PdfResponse } from './pdf.response';
import { PdfEntity } from './pdf.entity';
import * as moment from 'moment';
import * as path from 'path';

@Injectable()
export class PdfService {
    i18n: any;
    constructor(private readonly entityManager: EntityManager) { }

    async generatePDFAbsensiGuru(): Promise<Either<Error, PdfResponse>> {
        const queryRunner = datasource.createQueryRunner();
        await queryRunner.startTransaction();
        const dates = moment().format('DDMMYY');
        const date = moment().locale('id').format('DD-MMMM-YYYY');
        const prefixSource = './public/uploads/';
        const folderPath = 'pdf/absensi';
        const templatePath = `templates/pdf`;
        const pdfPath = `${folderPath}/rekapAbsen_${dates}.pdf`;
        try {
            const pdfd = queryRunner.manager.getRepository(PdfEntity);
            const repo = queryRunner.manager.getRepository(AttendanceEntity);
            const startOfMonth = moment().startOf('month').toDate();
            const endOfMonth = moment().endOf('month').toDate();

            const data = await repo
                .createQueryBuilder('attendance')
                .leftJoinAndSelect('attendance.user', 'user')
                .leftJoinAndSelect('user.profile', 'profile')
                .where('attendance.date BETWEEN :start AND :end', {
                    start: startOfMonth,
                    end: endOfMonth,
                })
                .getMany();
            const settingRepo = queryRunner.manager.getRepository(MSettingEntity);
            const setting = await settingRepo.findOne({
                where: { isActive: true },
            });

            if (!data) {
                return either.error(new Error({ message: 'Data absensi tidak ditemukan' }));
            }

            const logoPath1 = path.resolve(__dirname, `../../../../public/uploads/sekolah/logo/${setting.logoSekolah}`);
            const logoBuffer = fs.readFileSync(logoPath1);
            const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
            const formattedData = data.map((absen) => ({
                ...absen,
                tanggalFormatted: moment(absen.date).locale('id').format('D MMMM YYYY'),
                waktuFormatted: moment(absen.createdAt).locale('id').format('HH:mm:ss'),
            }));
            const css = fs.readFileSync(`${templatePath}/style.css`, 'utf8');
            const htmlTemplate = fs.readFileSync(`${templatePath}/template.html`, 'utf8');

            const opts = {
                format: 'A4',
                border: {
                    top: '0',
                    right: '5mm',
                    bottom: '20mm',
                    left: '5mm'
                },
                orientation: 'portrait'
            };

            const doc = {
                html: htmlTemplate.replace('/* CSS */', css),
                data: {
                    absensi: formattedData,
                    sekolah: {
                        ...setting,
                        logo: logoBase64,
                        title: 'Laporan Absensi Guru',
                        date: date
                    },
                },
                path: prefixSource + pdfPath,
                type: '',
            };
            await pdf.create(doc, opts);
            const existingPdf = await pdfd.findOne({ where: { name: `rekapAbsen_${dates}` } });

            let savedPdf;
            if (existingPdf) {
                existingPdf.path = pdfPath;
                savedPdf = await pdfd.save(existingPdf);
            } else {
                savedPdf = await pdfd.save({
                    name: `rekapAbsen_${dates}`,
                    path: pdfPath
                });
            }
            await queryRunner.commitTransaction();

            return either.of(
                new PdfResponse({
                    id: savedPdf.id,
                    path: pathToUrl(savedPdf.path),
                    path_without_domain: ''
                })
            );
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return either.error(new Error({ message: error.message || 'Gagal membuat PDF' }));
        } finally {
            await queryRunner.release();
        }
    }
}
