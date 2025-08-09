import { CityDto } from "@/src/modules/master/city/city.dto";
import { DistrictDto } from "@/src/modules/master/district/district.dto";
import { ProvinceDto } from "@/src/modules/master/province/province.dto";
import { SubdistrictDto } from "@/src/modules/master/subdistrict/subdistrict.dto";
import { FilterableField, FilterableUnPagedRelation, IDField, PagingStrategies, QueryOptions } from "@nestjs-query/query-graphql";
import { Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

@ObjectType('settingSync')
@QueryOptions({
    pagingStrategy: PagingStrategies.OFFSET,
    enableTotalCount: true,
})
export class MSettingDto {
    @IDField(() => ID)
    id: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField()
    namaSekolah: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    @IsOptional()
    npsn?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    @IsOptional()
    periode?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    @IsOptional()
    alamat?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @IsOptional()
    @FilterableField({ nullable: true })
    city?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @IsOptional()
    @FilterableField({ nullable: true })
    province?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @IsOptional()
    @FilterableField({ nullable: true })
    district?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @IsOptional()
    @FilterableField({ nullable: true })
    subdistrict?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    @IsOptional()
    kodePos?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    jamMasuk: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    jamPulang: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    latitude: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    longitude: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    radius: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    @IsOptional()
    logoSekolah?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    @IsOptional()
    background?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    @IsOptional()
    email?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    @IsOptional()
    telepon?: string;

    @IsString({ message: i18nValidationMessage('validation.STRING') })
    @FilterableField({ nullable: true })
    @IsOptional()
    website?: string;

    @IsBoolean()
    @Field()
    isActive!: boolean;

    @FilterableField(() => GraphQLISODateTime)
    @IsOptional()
    createdAt?: Date;

    @FilterableField(() => GraphQLISODateTime)
    @IsOptional()
    updatedAt?: Date;
}


@ObjectType('ResponseSetting')
export class ResponseSetting {
     @Field(() => MSettingDto, { nullable: true }) // ✅ ubah menjadi nullable
  nodes?: MSettingDto;

    @Field()
    message: string;

    constructor(partial?: Partial<ResponseSetting>) {
        Object.assign(this, partial);
    }
}