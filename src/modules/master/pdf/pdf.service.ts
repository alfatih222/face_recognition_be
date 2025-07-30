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

@Injectable()
export class PdfService {
    i18n: any;
    constructor(private readonly entityManager: EntityManager) { }

    async generatePDFAbsensiGuru(): Promise<Either<Error, PdfResponse>> {
        const queryRunner = datasource.createQueryRunner();
        await queryRunner.startTransaction();
        const dates = moment().format('DDMMYY');

        const prefixSource = './public/uploads/';
        const folderPath = 'pdf/absensi';
        const templatePath = `templates/pdf`;
        const pdfPath = `${folderPath}/rekapAbsen_${dates}.pdf`;

        try {
            const pdfd = queryRunner.manager.getRepository(PdfEntity);
            const repo = queryRunner.manager.getRepository(AttendanceEntity);
            const data = await repo.find({
                relations: ['user', 'user.profile'],
            });
            const settingRepo = queryRunner.manager.getRepository(MSettingEntity);
            const setting = await settingRepo.findOne({
                where: { isActive: true },
            });

            if (!data) {
                return either.error(new Error({ message: 'Data absensi tidak ditemukan' }));
            }

            const formattedData = data.map((absen) => ({
                ...absen,
                tanggalFormatted: moment(absen.date).locale('id').format('D MMMM YYYY'),
                waktuFormatted: moment(absen.createdAt).locale('id').format('HH:mm:ss'),
            }));
            const css = fs.readFileSync(`${templatePath}/style.css`, 'utf8');
            const htmlTemplate = fs.readFileSync(`${templatePath}/template.html`, 'utf8');

            const headerContent = fs.readFileSync(`${templatePath}/header.html`, 'utf8')
                .replace('{{title}}', 'Laporan Absensi Guru')
                .replace('{{periode}}', setting.periode ?? '-')
                .replace('{{nama_sekolah}}', setting.namaSekolah ?? '-');

            const footerContent = fs.readFileSync(`${templatePath}/footer.html`, 'utf8')
                .replace('{{generatedAt}}', new Date().toLocaleString());

            const opts = {
                format: 'A4',
                orientation: 'portrait',
                header: { height: '40mm', contents: headerContent },
                footer: { height: '20mm', contents: footerContent },
            };

            const doc = {
                html: htmlTemplate.replace('/* CSS */', css),
                data: {
                    absensi: formattedData,
                    sekolah: setting,
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
