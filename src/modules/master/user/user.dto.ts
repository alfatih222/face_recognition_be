import { RoleDto } from '@/src/modules/master/m_role/role.dto';
import {
  FilterableField,
  FilterableRelation,
  FilterableUnPagedRelation,
  IDField,
  PagingStrategies,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, MinLength } from 'class-validator';
import { ProfileDto } from '../profile/profile.dto';

@ObjectType('userSync')
@QueryOptions({ pagingStrategy: PagingStrategies.OFFSET })
@FilterableRelation('role', () => RoleDto, {
  disableRemove: true,
  disableUpdate: true,
  nullable: true,
})
@FilterableRelation('profile', () => ProfileDto, {
  disableRemove: true,
  disableUpdate: true,
  nullable: true,
})
export class UserDto {
  @IDField(() => ID)
  id?: string;

  @IsEmail()
  @FilterableField()
  email!: string;

  @FilterableField()
  username!: string;

  @MinLength(6)
  @Field()
  password!: string;

  @FilterableField({
    nullable: true,
  })
  role_id: string;

  @IsBoolean()
  @Field()
  isActive!: boolean;
}
