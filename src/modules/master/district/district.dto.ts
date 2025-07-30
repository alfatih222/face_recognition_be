import {
  BeforeDeleteMany,
  BeforeDeleteOne,
  FilterableField,
  FilterableRelation,
  IDField,
  PagingStrategies,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CityDto } from '../city/city.dto';

@ObjectType('districtSync')
@QueryOptions({
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
})
@FilterableRelation('city', () => CityDto, {
  disableRemove: true,
  disableUpdate: true,
  nullable: true,
})
export class DistrictDto {
  @IDField(() => ID)
  id: string;

  @FilterableField()
  name: string;
  @FilterableField({ nullable: true })
  no_kec: string;

  @FilterableField({ nullable: true })
  no_kab: string;

  @FilterableField({ nullable: true })
  no_prop: string;

  @Field()
  active: boolean;
}
