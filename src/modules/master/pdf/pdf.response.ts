import { PdfInput } from "@/src/modules/master/pdf/pdf.input";
import { Field, ID, ObjectType, PartialType } from "@nestjs/graphql";


@ObjectType()
export class PdfResponse {
    @Field(() => ID)
    id: string;

    @Field()
    path: string;

    @Field()
    path_without_domain: string;

    constructor(partial?: Partial<PdfResponse>) {
    Object.assign(this, partial);
  }
}

@ObjectType()
export class DeletePDFResponse extends PartialType(PdfInput, ObjectType) { }
