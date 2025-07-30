import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
    UnPagedRelation,
} from '@nestjs-query/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('menu')
@QueryOptions({
    pagingStrategy: PagingStrategies.OFFSET,
    enableTotalCount: true
})
@UnPagedRelation('children', () => MenuDto, {
    disableRemove: true,
    disableUpdate: true,
})
export class MenuDto {
    @IDField(() => ID)
    id: string;

    @FilterableField({ nullable: true })
    name: string;
    @Field({ nullable: true })
    icon: string;
    @FilterableField({ nullable: true })
    url: string;
    @FilterableField({ nullable: true })
    fieldname: string;
    @FilterableField({ nullable: true })
    type: string;
    @FilterableField({ nullable: true })
    menu_id: string;
}
