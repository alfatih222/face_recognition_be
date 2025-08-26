import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../master/user/user.dto';
import { AttendanceDto } from './attendance.dto';
import { NavigatePages } from '@/src/common/input/datable.input';

@ObjectType()
export class AttendanceResponse {
  @Field()
  allow: boolean;

  @Field()
  message: string;

  constructor(partial?: Partial<AttendanceResponse>) {
    Object.assign(this, partial);
  }
}

@ObjectType('AttendanceDTO')
export class AttendanceDetailDTO {
  @Field(() => [AttendanceDto], { nullable: true, defaultValue: [] })
  nodes: AttendanceDto[];

  @Field(() => NavigatePages)
  pageInfo: NavigatePages;

  @Field(() => Int, { defaultValue: 0 })
  totalCount: number;
}
