import "@tensorflow/tfjs-node";
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as canvas from 'canvas';
import * as faceapi from '@vladmandic/face-api';
import { I18nService } from "nestjs-i18n";
import { Between, Brackets, EntityManager, LessThan, MoreThanOrEqual, Repository } from "typeorm";
import { AttendanceEntity } from "./attendance.entity";
import { TypeOrmQueryService } from "@nestjs-query/query-typeorm";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../master/user/user.entity";
import { MSettingEntity } from "../master/m_setting/m_setting.entity";
import { FileUpload } from "graphql-upload";
import { AttendanceInput, SortingData, TableFilter } from "./attendance.input";
import { AttendanceDetailDTO, AttendanceResponse } from "./attendance.response";
import * as FileService from '../../common/utils/file-service';
import { face_recognition, initializeFaceRecognition } from "@/src/utils/face-recognition.utils";
import { location } from "@/src/utils/location.utils";
import { getAttendanceTypeByTime } from "@/src/common/utils/attendanceTime";
import * as moment from 'moment';
import { PagingInput } from "@/src/common/input/datable.input";

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
    const { file, latitude, longitude } = input;
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
    const distance = await location(
      latitude.toString(),
      longitude.toString(),
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
    console.log('oopds', bestMatch.distance)
    if (bestMatch.distance > 0.4) {
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
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        user_id: user.id,
        created_by: user.id,
      });
    }

    return new AttendanceResponse({
      allow: true,
      message: await this.i18n.t('validation.ABSEN_SUCCESS'),
    });
  }

  async getAttendances(params: {
  filter: TableFilter;
  paging: PagingInput;
  sorting: SortingData[];
  }): Promise<AttendanceDetailDTO> {
    const defaultFilter: TableFilter = {
  checkIn: null,
  checkOut: null,
  date: null,
  username: null,
  fullname: null,
  and: [],
  or: [],
};
  const { filter = defaultFilter, paging = { limit: 10, offset: 0 }, sorting = [] } = params;
  const { limit = 10, offset = 0 } = paging;

  const qb = this.entityManager.getRepository(AttendanceEntity)
    .createQueryBuilder('a')
    .leftJoin('a.user', 'u')
    .leftJoin('u.profile', 'p');

    qb.where('1=1');
    
    console.log('spodsd', qb)

  const filterFields = ['checkIn', 'checkOut', 'date', 'username', 'fullname'];

  // helper function to apply filters with ILIKE
  function applyFilters(qb, filters: TableFilter, prefix = '') {
    for (const field of filterFields) {
      const val = filters[field]?.iLike;
      if (val) {
        qb.andWhere(`${prefix}${field === 'username' ? 'u.username' : field === 'fullname' ? 'p.fullname' : `a.${field}` } ILIKE :${prefix}${field}`, {
          [`${prefix}${field}`]: val,
        });
      }
    }
  }

  // apply main filter
  applyFilters(qb, filter);

  // apply AND filters
  for (const andFilter of filter.and ?? []) {
    applyFilters(qb, andFilter, 'and_');
  }

  // apply OR filters
  if ((filter.or ?? []).length > 0) {
    qb.andWhere(new Brackets(qbOr => {
      filter.or.forEach((orFilter, i) => {
        qbOr.orWhere(new Brackets(qbInner => {
          for (const field of filterFields) {
            const val = orFilter[field]?.iLike;
            if (val) {
              qbInner.orWhere(`${field === 'username' ? 'u.username' : field === 'fullname' ? 'p.fullname' : `a.${field}`} ILIKE :or_${field}_${i}`, {
                [`or_${field}_${i}`]: val,
              });
            }
          }
        }));
      });
    }));
  }

  // Sorting
  const sortMap = {
    date: 'a.date',
    user_id: 'a.user_id',
    username: 'u.username',
    fullname: 'p.fullname',
  };
  const { field, direction } = sorting[0] ?? {};
  const orderField = sortMap[field] ?? 'a.date';
  const orderDir = (direction ?? 'DESC') as 'ASC' | 'DESC';

  qb.orderBy(orderField, orderDir).skip(offset).take(limit);

  const [data, totalCount] = await qb.getManyAndCount();

  const nodes = data.map(item => ({
    id: item.id,
    user_id: item.user_id,
    date: item.date,
    checkIn: item.checkIn ?? '-',
    checkOut: item.checkOut ?? '-',
    latitude: item.latitude,
    longitude: item.longitude,
    type: item.type,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    username: item.user?.username ?? '-',
    fullname: item.user?.profile?.fullname ?? '-',
  }));

  return {
    nodes,
    totalCount,
    pageInfo: {
      hasNextPage: offset + limit < totalCount,
      hasPreviousPage: offset > 0,
    },
  };
}

}
