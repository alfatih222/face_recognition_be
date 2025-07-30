import {
  FilterableRelation,
  IDField,
  PagingStrategies,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoleDto } from '../m_role/role.dto';
import { MenuDto } from '../menu/menu.dto';


@ObjectType('transactionclinician')
@QueryOptions({
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
})
@FilterableRelation('role', () => RoleDto, {
  disableRemove: true,
  disableUpdate: true,
})
@FilterableRelation('menu', () => MenuDto, {
  disableRemove: true,
  disableUpdate: true,
})
export class RolePermissionDto {
  @IDField(() => ID)
  id: string;

  @Field()
  role_id: string;
  @Field()
  menu_id: string;
  
}
