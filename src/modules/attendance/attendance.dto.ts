import { enumToDesc } from "@/src/common/utils/object-helpers";
import { UserDto } from "@/src/modules/master/user/user.dto";
import { FilterableField, FilterableUnPagedRelation, IDField, PagingStrategies, QueryOptions } from "@nestjs-query/query-graphql";
import { GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";


@ObjectType('AbsenSync')
@FilterableUnPagedRelation('user', () => UserDto, {
    disableRemove: true,
    disableUpdate: true,
    nullable: true,
})
@QueryOptions({
    pagingStrategy: PagingStrategies.OFFSET,
    enableTotalCount: true,
})
export class AttendanceDto {
    @IDField(() => ID)
    id: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField()
    user_id: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField()
    date: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField()
    lat: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField()
    lng: string;

    @FilterableField()
    type: string;

    @FilterableField(() => GraphQLISODateTime)
    @IsOptional()
    createdAt?: Date;

    @FilterableField(() => GraphQLISODateTime)
    @IsOptional()
    updatedAt?: Date;

}
