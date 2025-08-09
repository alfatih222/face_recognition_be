import {
  FilterableField,
  FilterableRelation,
  IDField,
  PagingStrategies,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  IsDateString,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';
import { UserDto } from '../../master/user/user.dto';
import { GenderType } from './profile.entity';
import { i18nValidationMessage } from 'nestjs-i18n';
import { pathToUrl } from '../../../common/utils/string-helpers';

@ObjectType('Profile')
@FilterableRelation('user', () => UserDto, {
  disableRemove: true,
  disableUpdate: true,
})
@QueryOptions({ pagingStrategy: PagingStrategies.OFFSET })
export class ProfileDto {
  @IDField(() => ID)
  id?: string;

  @MinLength(3, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @FilterableField({ nullable: true })
  fullname: string;

  @FilterableField({ nullable: true })
  nip?: string;

  @FilterableField({ nullable: true })
  placeOfBirth?: string;

 
  @FilterableField({ nullable: true })
  dateOfBirth?: string;

  @FilterableField(() => GenderType, { nullable: true })
  gender?: GenderType;

  @FilterableField({ nullable: true })
  address?: string;

  // @IsNumberString({}, { message: i18nValidationMessage('validation.NUMBER') })
  @IsString()
  @FilterableField({ nullable: true })
  phone?: string;

  @FilterableField({
    middleware: [
      (a, b) => {
        const src = a.source.profile_photo;
        return src;
      },
    ],
    nullable: true
  })
  profilePhoto?: string;
  @FilterableField({
    middleware: [
      (a, b) => {
        const src = a.source.profile_photo;
        console.log('sasasa', src)
        return src ? pathToUrl(`profile/${src}`) : null;
      },
    ],
    nullable: true,
  })
  profilePhotoUrl?: string;

  @FilterableField({ filterOnly: true })
  user_id: string;

  @Field(() => GraphQLISODateTime)
  createdAt?: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt?: Date;
}
