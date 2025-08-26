import { DirectionSorting, ILikeFilter } from "@/src/common/input/datable.input";
import { enumToDesc } from "@/src/common/utils/object-helpers";
import { Field, Float, InputType, PickType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { i18nValidationMessage } from "nestjs-i18n";

const filterILike = "use `iLike` filter'";
enum FieldType {
    date = 'date',
    user_id = 'user_id'
}



@InputType('AbsenInput')
export class AttendanceInput {
    @IsNumber({}, { message: i18nValidationMessage('validation.NUMBER') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
    @Field(() => Float)
    latitude: number;

    @IsNumber({}, { message: i18nValidationMessage('validation.NUMBER') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
    @Field(() => Float)
    longitude: number;
}

@InputType('TableFilter')
export class TableFilter {
    @Field(() => ILikeFilter, { nullable: true, description: filterILike })
    @IsOptional()
    checkIn: ILikeFilter;

    @Field(() => ILikeFilter, { nullable: true, description: filterILike })
    @IsOptional()
    checkOut: ILikeFilter;

    @Field(() => ILikeFilter, { nullable: true, description: filterILike })
    @IsOptional()
    date: ILikeFilter;

    @Field(() => ILikeFilter, { nullable: true, description: filterILike })
    @IsOptional()
    username: ILikeFilter;

    @Field(() => ILikeFilter, { nullable: true, description: filterILike })
    @IsOptional()
    fullname: ILikeFilter;

    @Field(() => [TableFilter], { nullable: true })
    @IsOptional()
    and: TableFilter[];

    @Field(() => [TableFilter], { nullable: true })
    @IsOptional()
    or: TableFilter[];
}

@InputType('SortingData')
export class SortingData extends PickType(
    DirectionSorting,
    ['direction'],
    InputType,
) {
    @Field({ description: enumToDesc(FieldType) })
    @IsEnum(FieldType, {
        message: i18nValidationMessage('validation.NOT_REGISTERED'),
    })
    field: string;
}
