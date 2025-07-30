import {
  Field,
  ID,
  Int,
  ObjectType,
  PickType,
  createUnionType,
} from '@nestjs/graphql';
import { Error } from '../../../graphql/types/error.type';
import { Success } from '../../../graphql/types/success.type';

export const DeleteUserResultUnion = createUnionType({
  name: 'DeleteUserResult',
  description: 'Only admin can do it.',
  types: () => [Success, Error],
});

@ObjectType('userDetailDTO')
export class userDetailDTO {
  @Field(() => ID, { nullable: true })
  id: string;
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  username: string;
  @Field({ nullable: true })
  user_id: string;
  @Field({ nullable: true })
  fullname: string;
  @Field({ nullable: true })
  phone: string;
  @Field({ nullable: true })
  address: string;
  @Field({ nullable: true })
  created_at: string;
}

@ObjectType('userDetailTransDTO')
export class userDetailTransDTO extends PickType(
  userDetailDTO,
  [
    'id',
    'email',
    'username',
    'user_id',
    'fullname',
    'phone',
    'address',
    'created_at',
  ],
  ObjectType,
) {}

@ObjectType('ResultUserDTO')
export class ResultUserDTO {
  @Field(() => [userDetailTransDTO], { nullable: true, defaultValue: [] })
  user_detail: userDetailTransDTO[];
}

@ObjectType('ResultDetailUserDTO')
export class ResultDetailUserDTO {
  @Field(() => [userDetailDTO], { nullable: true, defaultValue: [] })
  nodes: userDetailDTO[];

  // @Field(() => NavigatePages)
  // pageInfo: NavigatePages;

  @Field(() => Int, { defaultValue: 0 })
  totalCount: number;
}
