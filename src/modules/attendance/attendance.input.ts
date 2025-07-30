import { Field, Float, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { i18nValidationMessage } from "nestjs-i18n";


@InputType('AbsenInput')
export class AttendanceInput {
    @IsNumber({}, { message: i18nValidationMessage('validation.NUMBER') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
    @Field(()=> Float)
    lat: number;

     @IsNumber({}, { message: i18nValidationMessage('validation.NUMBER') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
    @Field(()=> Float)
    lng: number;
}
