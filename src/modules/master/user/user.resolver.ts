import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlUser } from '../../../common/decorators/gql-user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';
import {
  ResultDetailUserDTO,
} from './user.result';
import { UserService } from './user.service';
import { Filter } from '@/src/graphql/args/filter.args';
import { TrDataUserSorting, UserDetailTableFilter } from './user.input';
import { PagingInput } from '@/src/common/input/datable.input';
import { Paging } from '@/src/graphql/args/paging.args';
import { Sorting } from '@/src/graphql/args/sorting.args';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserDto)
  @UseGuards(JwtAuthGuard)
  async me(@GqlUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @Query(() => ResultDetailUserDTO)
  @UseGuards(JwtAuthGuard)
  async getUserData(
    @Filter() filter: UserDetailTableFilter,
    @Paging() paging: PagingInput,
    @Sorting(TrDataUserSorting) sorting: TrDataUserSorting[],
  ): Promise<ResultDetailUserDTO> {
    return this.userService.getUsers({ filter, sorting });
  }
}
