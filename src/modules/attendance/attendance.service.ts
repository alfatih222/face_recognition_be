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
    const { file, lat, lng } = input;
    const setting = await this.entityManager.getRepository(MSettingEntity).findOne({ where: { isActive: true } });
    if (!setting) {
      throw new Error('Setting absensi aktif tidak ditemukan.');
    }
    const attendanceType = getAttendanceTypeByTime(setting);
    if (attendanceType === 'Invalid') {
      return new AttendanceResponse({
        allow: false,
        message: await this.i18n.t('validation.ATTENDANCE_TIME_INVALID'),
      });
    }
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();
    const date = moment().format('YYYY-MM-DD');
    const time = moment().format('HH:mm:ss');

    const exsist = await this.attendenceRepo.findOne({
      where: {
        user_id: user.id,
        date: Between(todayStart, todayEnd) as any,
      },
      order: { date: 'DESC' },
      relations: ['user'],
    });

    // if (attendanceType === 'Masuk' && exsist) {
    //   return new AttendanceResponse({
    //     allow: false,
    //     message: await this.i18n.t('validation.ALREADY_ATTEND_TODAY'),
    //   });
    // }

    if (attendanceType === 'Pulang' && !exsist) {
      return new AttendanceResponse({
        allow: false,
        message: await this.i18n.t('validation.NO_CHECKIN_FOUND'),
      });
    }

    // location
    const distance = await location(
      lat.toString(),
      lng.toString(),
      setting.latitude,
      setting.longitude
    );
    const isInsideArea = distance <= Number(setting.radius);
    if (!isInsideArea) {
      return new AttendanceResponse({
        message: await this.i18n.t('validation.LOCATION'),
        allow: false,
      });
    }

    // face recognition
    if (!this.faceCache.has(user.id.toString())) {
      const descriptor = await face_recognition(user, this.faceCache);
      if (!descriptor) {
        return new AttendanceResponse({
          allow: false,
          message: await this.i18n.t('validation.USER'),
        });
      }
      this.faceCache.set(user.id.toString(), descriptor);
    }
    const userDescriptor = this.faceCache.get(user.id.toString());
    const imageBuffer = await FileService.toBuffer(file);
    const img = await canvas.loadImage(imageBuffer);
    const detections = await faceapi
      .detectSingleFace(img as any)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      console.warn('Wajah tidak terdeteksi dalam gambar.');
      return new AttendanceResponse({
        message: await this.i18n.t('validation.FACE'),
        allow: false,
      });
    }
    const faceMatcher = new faceapi.FaceMatcher(userDescriptor, 0.6);
    const bestMatch = faceMatcher.findBestMatch(detections.descriptor);
    if (bestMatch.label !== user.id.toString()) {
      return new AttendanceResponse({
        allow: false,
        message: await this.i18n.t('validation.FACE_NOT_MATCH'),
      });
    }
    // create absensi
    if (exsist && exsist.checkIn != null) {
      exsist.checkOut = time;
      exsist.updatedAt = new Date();
      await this.attendenceRepo.save(exsist);
    } else {
      await this.attendenceRepo.insert({
        date: date,
        checkIn: time,
        type: attendanceType,
        lat: lat.toString(),
        lng: lng.toString(),
        user_id: user.id,
        created_by: user.id,
      });
    }

    return new AttendanceResponse({
      allow: true,
      message: await this.i18n.t('validation.ABSEN_SUCCESS'),
    });
  }

}
