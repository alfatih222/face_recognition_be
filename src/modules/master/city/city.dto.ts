import { ProvinceDto } from '@/src/modules/master/province/province.dto';
import {
  FilterableField,
  FilterableRelation,
  IDField,
  PagingStrategies,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('citySync')
@QueryOptions({
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
})
@FilterableRelation('province', () => ProvinceDto, {
  disableRemove: true,
  disableUpdate: true,
  nullable: true,
})
export class CityDto {
  @IDField(() => ID)
  id: string;

  @FilterableField()
  name: string;

  @Field()
  active: boolean;
}
