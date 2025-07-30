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
import { DistrictDto } from '../district/district.dto';

@ObjectType('subdistrictSync')
@QueryOptions({
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
})
@FilterableRelation('district', () => DistrictDto, {
  disableRemove: true,
  disableUpdate: true,
  nullable: true,
})
export class SubdistrictDto {
  @IDField(() => ID)
  id: string;

  @FilterableField()
  name: string;

  @FilterableField({ nullable: true })
  no_kel: string;
  @FilterableField({ nullable: true })
  no_kec: string;
  @FilterableField({ nullable: true })
  no_kab: string;
  @FilterableField({ nullable: true })
  no_prop: string;

  @Field()
  active: boolean;
}
