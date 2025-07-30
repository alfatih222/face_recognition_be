import {
  IDField,
  PagingStrategies,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';
@ObjectType('provinceSync')
@QueryOptions({
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
})
export class ProvinceDto {
  @IDField(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  active: boolean;
}
