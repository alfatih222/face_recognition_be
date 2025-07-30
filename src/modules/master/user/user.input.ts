import { Field, InputType, OmitType, PickType } from '@nestjs/graphql';
import { UserDto } from './user.dto';
import { DirectionSorting, ILikeFilter } from '@/src/common/input/datable.input';
import { IsEnum, IsOptional } from 'class-validator';
import { enumToDesc } from '@/src/common/utils/object-helpers';
import { i18nValidationMessage } from 'nestjs-i18n';

const filterEq = "use `eq` filter'";
const filterIs = "use `is` filter'";
const filterLike = "use `like` filter'";
const filterILike = "use `iLike` filter'";
enum TransFieldType {
  user_id = 'id',
}

@InputType('UserSync')
export class UserInput extends OmitType(
  UserDto,
  ['id', 'role_id', 'isActive'],
  InputType
) { }

@InputType('UserDetailTableFilter')
export class UserDetailTableFilter {
  @Field(() => ILikeFilter, { nullable: true, description: filterILike })
  @IsOptional()
  email: ILikeFilter;

  @Field(() => ILikeFilter, { nullable: true, description: filterILike })
  @IsOptional()
  username: ILikeFilter;

  // @Field(() => EqFilter, { nullable: true, description: filterEq })
  // @IsOptional()
  // user_id: EqFilter;

  @Field(() => ILikeFilter, { nullable: true, description: filterILike })
  @IsOptional()
  fullname: ILikeFilter;

  @Field(() => [UserDetailTableFilter], { nullable: true })
  @IsOptional()
  and: UserDetailTableFilter[];

  @Field(() => [UserDetailTableFilter], { nullable: true })
  @IsOptional()
  or: UserDetailTableFilter[];
}

@InputType('TrDataUserSorting')
export class TrDataUserSorting extends PickType(
  DirectionSorting,
  ['direction'],
  InputType,
) {
  @Field({ description: enumToDesc(TransFieldType) })
  @IsEnum(TransFieldType, {
    message: i18nValidationMessage('validation.NOT_REGISTERED'),
  })
  field: string;
}