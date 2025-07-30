import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AttendanceService } from './attendance.service';
import { Input } from '@/src/graphql/args/input.args';
import { AttendanceInput } from './attendance.input';
import { GqlUser } from '@/src/common/decorators/gql-user.decorator';
import { UserEntity } from '../master/user/user.entity';
import { ValidateInput } from '@/src/common/decorators/validate-input.decorator';
import { AttendanceResultUnion } from './attendance.result';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';
import { ImageFile } from '@/src/common/upload/upload.scalar';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class AttendanceResolver {
  constructor(private readonly faceService: AttendanceService) { }

  @ValidateInput()
  @UseGuards(JwtAuthGuard)
  @Mutation(() => [AttendanceResultUnion])
  async createAbsen(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
    @Input() input: AttendanceInput,
    @GqlUser() user: UserEntity
  ): Promise<Array<typeof AttendanceResultUnion>> {
    const res = await this.faceService.createAttendance({ file, ...input }, user);
    return [res];
  }
}
