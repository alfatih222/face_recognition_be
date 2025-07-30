import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../master/user/user.dto';

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
