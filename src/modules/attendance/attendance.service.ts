import "@tensorflow/tfjs-node";
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as canvas from 'canvas';
import * as faceapi from '@vladmandic/face-api';
import { I18nService } from "nestjs-i18n";
import { Between, EntityManager, LessThan, MoreThanOrEqual, Repository } from "typeorm";
import { AttendanceEntity } from "./attendance.entity";
import { TypeOrmQueryService } from "@nestjs-query/query-typeorm";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../master/user/user.entity";
import { MSettingEntity } from "../master/m_setting/m_setting.entity";
import { FileUpload } from "graphql-upload";
import { AttendanceInput } from "./attendance.input";
import { AttendanceResponse } from "./attendance.response";
import * as FileService from '../../common/utils/file-service';
import { face_recognition, initializeFaceRecognition } from "@/src/utils/face-recognition.utils";
import { location } from "@/src/utils/location.utils";
import { getAttendanceTypeByTime } from "@/src/common/utils/attendanceTime";
import * as moment from 'moment';

@Injectable()
export class AttendanceService extends TypeOrmQueryService<AttendanceEntity> implements OnModuleInit {
  private faceCache = new Map<string, faceapi.LabeledFaceDescriptors>();
  constructor(
    @InjectRepository(AttendanceEntity)
    private readonly attendenceRepo: Repository<AttendanceEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly i18n: I18nService
  ) {
    super(attendenceRepo, { useSoftDelete: true });
  }

  async onModuleInit() {
    await initializeFaceRecognition();
  }

  async createAttendance(input: any, user: UserEntity): Promise<AttendanceResponse> {
    const {
      file,
      ...inputAbsensi
    }: {
      file: FileUpload;
      inputAbsensi: AttendanceInput;
    } = input;
    // entityManager For setting school
    const setting = await this.entityManager.getRepository(MSettingEntity).findOne({ where: { isActive: true } })
    console.log('setting', setting);
    // batasi jam absen
    const attendanceType = getAttendanceTypeByTime(setting);
    console.log('attendanceType', attendanceType);
    // get data absen per user dan per hari
    const todayStart = new Date(moment().startOf('day').format());
    const todayEnd = new Date(moment().endOf('day').format());
    const exsist = await this.attendenceRepo.findOne({
      where: {
        user_id: user.id,
        date: Between(todayStart, todayEnd) as any,
      },
      order: {
        date: 'DESC'
      },
      relations: ['user']
    })
    console.log('exsist', exsist);
    if (attendanceType === 'Invalid') {
      return new AttendanceResponse({
        allow: false,
        message: await this.i18n.t('validation.ATTENDANCE_TIME_INVALID'),
      });
    }

    if (attendanceType === 'Masuk' && exsist) {
      return new AttendanceResponse({
        allow: false,
        message: await this.i18n.t('validation.ALREADY_ATTEND_TODAY'),
      });
    }

    if (attendanceType === 'Pulang' && !exsist) {
      return new AttendanceResponse({
        allow: false,
        message: await this.i18n.t('validation.NO_CHECKIN_FOUND'),
      });
    }

    // location
    const distance = await location(input.lat.toString(),
      input.lng.toString(), setting.latitude, setting.longitude);
    console.log('distance', distance);
    const isInsideArea = distance <= Number(setting.radius);
    if (!isInsideArea) {
      return new AttendanceResponse({
        message: `${await this.i18n.t('validation.LOCATION')}`,
        allow: false
      });
    }

    // face recognition
    const userDescriptor = await face_recognition(user, this.faceCache);
    console.log('userDescriptor', userDescriptor);
    if (!userDescriptor) return new AttendanceResponse({
      allow: false,
      message: `${await this.i18n.t('validation.USER')}`
    });
    const imageBuffer = await FileService.toBuffer(file);
    console.log('imageBuffer', imageBuffer);
    const img = await canvas.loadImage(imageBuffer);
    console.log('img', img);
    const detections = await faceapi
      .detectSingleFace(img as any)
      .withFaceLandmarks()
      .withFaceDescriptor();
    console.log('detection', detections);
    if (!detections) return new AttendanceResponse({
      message: `${await this.i18n.t('validation.FACE')}`,
      allow: false
    });
    // create absensi
    await this.attendenceRepo.insert({
      date: new Date() as any,
      type: attendanceType,
      lat: input.lat,
      lng: input.lng,
      user_id: user.id,
      created_by: user.id
    });

    return new AttendanceResponse({
      allow: true,
      message: `${await this.i18n.t('validation.ABSEN_SUCCESS')}`
    })
  }

}
