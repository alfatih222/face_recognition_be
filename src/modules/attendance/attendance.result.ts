import { createUnionType } from '@nestjs/graphql';
import { Error } from '../../graphql/types/error.type';
import { AttendanceResponse } from './attendance.response';

export const AttendanceResultUnion = createUnionType({
  name: 'AttendanceResult',
  types: () => [AttendanceResponse, Error],
});


