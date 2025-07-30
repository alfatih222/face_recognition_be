import { Field, ID, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsUUID } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";


@InputType('PdfInput')
export class PdfInput {
    @Field(() => ID)
    @IsNotEmpty()
    @IsUUID(4, { message: i18nValidationMessage('validation.INVALID') })
    id: string;
}
