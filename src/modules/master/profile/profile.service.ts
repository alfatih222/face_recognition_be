import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { either } from '../../../common/utils/either';
import { UserEntity } from '../../master/user/user.entity';
import { Not, Repository } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import * as FileService from '../../../common/utils/file-service';
import {
    UpdateProfileInput,
} from './profile.input';
import { FileUpload } from 'graphql-upload';
import { Error } from '../../../graphql/types/error.type';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(ProfileEntity)
        private profileRepository: Repository<ProfileEntity>,
        private readonly i18n: I18nService,
    ) { }

    async updateProfile(id: string, input: any, user: UserEntity): Promise<any> {
        const {
            profilePhoto,
            ...inputProfile
        }: {
            profilePhoto: FileUpload;
            inputProfile: UpdateProfileInput;
        } = input;
        const oldProfile = await this.profileRepository.findOneBy({
            id,
            user: { id: user.id },
        });

        if (!oldProfile) {
            return either.error(
                new Error({
                    message: `${await this.i18n.t('profile.PROFILE_NOT_FOUND')}`,
                }),
            );
        }

        const existsProfile = await this.profileRepository.countBy({
            nip: input.nip,
            id: Not(id),
            user: { id: user.id },
        });
        if (existsProfile > 0) {
            return either.error(
                new Error({
                    message: `${await this.i18n.t('profile.PROFILE_ALREADY_TAKEN')}`,
                }),
            );
        }
        try {
            // Upload
            let photos: any = {};


            // UPLOAD IMAGE PROFILE
            if (profilePhoto) {
                const profilePhotoUploaded = await FileService.storeFile(
                    './public/uploads/profile' + '/' + user.id,
                    profilePhoto,
                    FileService.UploadType.IMAGE,
                    this.i18n,
                );
                photos = {
                    profilePhoto: profilePhotoUploaded.filename,
                };
            }

            if (!id) {
                await this.profileRepository.insert({
                    ...input,
                    ...photos,
                    user,
                });
            }
            else
                await this.profileRepository.update(
                    { id },
                    {
                        ...inputProfile,
                        ...photos,
                        user,
                    },
                );

            const returnedProfile = await this.profileRepository.findOneBy({
                id,
            });

            // Delete old photo
            if (
                photos.profilePhoto &&
                photos.profilePhoto != oldProfile.profile_photo
            ) {
                await FileService.deleteFile(
                    './public/uploads/profile' + '/' + user.id,
                    oldProfile.profile_photo,
                );
            }
            return either.of(returnedProfile);
        } catch (error) {

            return either.error(new Error(error));
        } finally {
            // release query runner which is manually created:
        }
    }

}
