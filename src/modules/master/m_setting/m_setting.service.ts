import { MSettingEntity } from '@/src/modules/master/m_setting/m_setting.entity';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MSettingInput } from './m_setting.input';
import { Error } from '@/src/graphql/types/error.type';
import { ResponseSetting } from './m_setting.dto';
import { FileUpload } from 'graphql-upload';
import { Either, either } from '@/src/common/utils/either';
import * as FileService from '../../../common/utils/file-service';
import { I18nService } from 'nestjs-i18n';

@QueryService(MSettingEntity)
export class MSettingService extends TypeOrmQueryService<MSettingEntity> {
    constructor(
        @InjectRepository(MSettingEntity)
        private readonly settingRepository: Repository<MSettingEntity>,
        private readonly i18n: I18nService,
    ) {
        super(settingRepository, { useSoftDelete: true });
    }


    async updateSetting(id: string, input: any): Promise<Either<Error, ResponseSetting>> {
        const {
            logo,
            background,
            ...inputSetting
        }: {
            logo: FileUpload;
            background: FileUpload;
            inputSetting: MSettingInput;
        } = input;
        let logoPath;
        let backgroundPath;
        id = id.trim();
        const existingSetting = await this.settingRepository.findOne({
            where: {
                id:id
            }
        });
        if (!existingSetting) {
            return either.error(new Error({ message: 'Data absensi tidak ditemukan' }));
        }

        if (logo) {
            const logoUploaded = await FileService.storeFile(
                './public/uploads/sekolah/logo',
                logo,
                FileService.UploadType.IMAGE,
                this.i18n,
            );
            logoPath = {
                logoSekolah: logoUploaded.filename,
            };
        }

        if (background) {
            const backgroundUploaded = await FileService.storeFile(
                './public/uploads/sekolah/background',
                background,
                FileService.UploadType.IMAGE,
                this.i18n,
            );
            backgroundPath = {
                background: backgroundUploaded.filename,
            };
        }


        const updatePayload = {
            ...inputSetting,
            ...logoPath,
            ...backgroundPath,
        };

        await this.settingRepository.update(
            { id }, updatePayload,
        );

        const updated = {
            ...existingSetting,
            ...updatePayload,
        };

        return either.of(
            new ResponseSetting({
                nodes: updated,
                message: 'Setting berhasil diperbarui'
            })
        )
    }

    async getSetting(): Promise<Either<Error, MSettingEntity>> {
        const Setting = await this.settingRepository.findOne({
            where: {
                isActive: true
            }
        });
        if (!Setting) {
            return either.error(new Error({ message: 'Data absensi tidak ditemukan' }));
        }

        return either.of(Setting);
    }
}
