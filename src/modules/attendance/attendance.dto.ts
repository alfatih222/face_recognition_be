import { enumToDesc } from "@/src/common/utils/object-helpers";
import { UserDto } from "@/src/modules/master/user/user.dto";
import { FilterableField, FilterableRelation, FilterableUnPagedRelation, IDField, PagingStrategies, QueryOptions } from "@nestjs-query/query-graphql";
import { Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";


@ObjectType('AbsenSync')
@QueryOptions({
    pagingStrategy: PagingStrategies.OFFSET,
    enableTotalCount: true,
})

@FilterableRelation('user', () => UserDto, {
    disableRemove: true,
    disableUpdate: true,
    nullable: true,
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
    @FilterableField({nullable:true})
    checkIn: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({nullable:true})
    checkOut?: string;

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
