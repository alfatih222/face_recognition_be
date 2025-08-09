import { InjectQueryService, QueryService } from '@nestjs-query/core';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../master/user/user.entity';
import { I18nService } from 'nestjs-i18n';
import { InputRefreshToken, RegisterInput } from './auth.input';
import { Success } from '@/src/graphql/types/success.type';
import { Error } from '@/src/graphql/types/error.type';
import { Either, either } from '@/src/common/utils/either';
import { AuthUserResponse } from './auth.response';
import { jwtDecode } from 'jwt-decode';
import * as moment from 'moment';
import * as FileService from '../../common/utils/file-service';
import { ProfileEntity } from '../master/profile/profile.entity';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectQueryService(UserEntity)
    private userQueryService: QueryService<UserEntity>,
    @InjectQueryService(ProfileEntity)
    private profileQueryService: QueryService<ProfileEntity>,
    private readonly i18n: I18nService
  ) { }

  async registerUser(input: any): Promise<Either<Error, AuthUserResponse>> {
    const {
      file,
      ...inputRegister
    }: {
      file: FileUpload;
      inputRegister: RegisterInput;
    } = input;
    // Cek apakah user sudah ada berdasarkan email
    const existingUser = (
      await this.userQueryService.query({
        filter: { email: { eq: input.email } },
      })
    )[0];

    if (existingUser) {
      const errorMessage = await this.i18n.t('auth.USER_ALREADY_TAKEN', {
        args: { email: input.email },
      });

      return either.error(new Error(errorMessage));
    }

    if (!file) {
      const errorMessage = await this.i18n.t('auth.USER_ALREADY_TAKEN', {
        args: { email: input.email },
      });

      return either.error(new Error(errorMessage));
    }

    // Inisialisasi path foto
    let facePath;
    let profilePhotoData;
    const dateNow = moment().format('YYYYMMDD');

    if (file) {
      facePath = await FileService.storeFile(
        './public/uploads/face',
        file,
        FileService.UploadType.IMAGE,
        this.i18n,
      );
      facePath = facePath.filename;
    }

    // Siapkan data user untuk disimpan
    const newUser = {
      ...inputRegister,
      role_id: "6a92adda-bfe8-4bd0-bf17-e581b97407ce",
      file: facePath,
    };

    // Simpan user baru
    const createUser = await this.userQueryService.createOne(newUser);

    if (createUser) {
      profilePhotoData = await FileService.storeFile(
        './public/uploads/profile',
        file,
        FileService.UploadType.IMAGE,
        this.i18n,
      );
      profilePhotoData = profilePhotoData.filename;

      // create profile user 
      await this.profileQueryService.createOne({
        fullname: !input.fullname ? null : input.fullname,
        user_id: createUser.id,
        profile_photo: !file ? null : profilePhotoData,
      });

      // Beri response sukses
      const successMessage = await this.i18n.t('auth.REGISTER_SUCCESS');
      const token = await this.signToken(createUser);
      return either.of(
        new AuthUserResponse({
          user: createUser,
          token: token.token
        })
      );
    }
  }


  async login(
    email: string,
    password: string
  ): Promise<Either<Error, UserEntity>> {

    // Cek apakah user ada atau tidak ada berdasarkan email
    const user = (
      await this.userQueryService.query({
        filter: { email: { eq: email } },
      })
    )[0];

    // kondisi untuk user tidak ada
    if (!user) {
      return either.error(
        new Error({
          message: `${await this.i18n.t('auth.USER_NOT_FOUND_BY_EMAIL')}`,
        })
      );
    }

    // kondisi ketika user tidak aktif
    if (!user.isActive) {
      return either.error(
        new Error({
          message: `${await this.i18n.t('auth.USER_NOT_ACTIVATED')}`,
        })
      );
    }

    // kondisi password salah
    if (!(await user?.comparePassword(password))) {
      return either.error(
        new Error({
          message: `${await this.i18n.t('auth.PASSWORD_WRONG')}`,
        })
      );
    }
    return either.of(user);
  }

  // create token user
  async signToken(user: UserEntity): Promise<AuthUserResponse> {
    const payload = { email: user.email, sub: user.id, id: user.id };
    return new AuthUserResponse({
      user,
      token: this.jwtService.sign(payload, { expiresIn: '1d' }),
    });
  }

  async refreshToken(input: InputRefreshToken): Promise<any> {
    try {
      if (!input.token) {
        return either.error(
          new Error({
            message: `${await this.i18n.t('auth.TOKEN_NOT_FOUND')}`,
          })
        );
      }
      const decoded: any = jwtDecode(input.token);
      if (!decoded.sub) {
        return either.error(
          new Error({
            message: `${await this.i18n.t('auth.TOKEN_NOT_FOUND')}`,
          })
        );
      }
      const user = await this.userQueryService.query({
        filter: { id: { eq: decoded.sub }, email: { eq: decoded.email } },
      });
      if (!user[0]) {
        return either.error(
          new Error({
            message: `${await this.i18n.t('auth.USER_NOT_FOUND')}`,
          })
        );
      }
      const jwtToken = await this.jwtService.sign(
        {
          sub: user[0].id,
          email: user[0].email,
        },
        { expiresIn: '1h' }
      );
      return either.of({
        __typename: 'RefreshTokenResponse',
        token: jwtToken,
      });
    } catch (error) {
      return either.error(new Error({ message: error }));
    }
  }

  async getRefreshToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token, { ignoreExpiration: true });
      // console.log(payload);
      const userId = payload.sub;
      const user = await this.userQueryService.getById(userId);

      //kondisi user tidak ada
      if (!user) {
        return either.error(
          new Error({ message: `${await this.i18n.t('user.USER_NOT_FOUND')}` })
        );
      }

      // User Not Activated
      if (!user.isActive) {
        return either.error(
          new Error({
            message: `${await this.i18n.t('auth.USER_NOT_ACTIVATED')}`,
          })
        );
      }

      // New Token
      return either.of(
        new AuthUserResponse({
          user,
          token: this.jwtService.sign(
            { email: user.email, sub: user.id },
            { expiresIn: '1d' }
          ),
        })
      );
    } catch (error) {
      return either.error(new Error(error));
    }
  }
}
