import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AttendanceService } from './attendance.service';
import { Input } from '@/src/graphql/args/input.args';
import { AttendanceInput, SortingData, TableFilter } from './attendance.input';
import { GqlUser } from '@/src/common/decorators/gql-user.decorator';
import { UserEntity } from '../master/user/user.entity';
import { ValidateInput } from '@/src/common/decorators/validate-input.decorator';
import { AttendanceResultUnion } from './attendance.result';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';
import { ImageFile } from '@/src/common/upload/upload.scalar';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { RoleBaseGuard } from '@/src/common/guards/role-base.guard';
import { AttendanceDetailDTO } from './attendance.response';
import { Filter } from '@/src/graphql/args/filter.args';
import { Sorting } from '@/src/graphql/args/sorting.args';
import { Paging } from '@/src/graphql/args/paging.args';
import { PagingInput } from '@/src/common/input/datable.input';

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

  @ValidateInput()
  @UseGuards(JwtAuthGuard, RoleBaseGuard)
  @Query(() => AttendanceDetailDTO)
  async getAttendences(
        @Filter() filter: TableFilter,
        @Paging() paging: PagingInput,
        @Sorting(SortingData) sorting: SortingData[],
  ): Promise<AttendanceDetailDTO>{
    return this.faceService.getAttendances({ filter, paging, sorting });
  }
}

