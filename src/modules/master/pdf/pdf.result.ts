import { InvalidInputError } from "@/src/graphql/responses/invalid-input.error";
import { Error } from "@/src/graphql/types/error.type";
import { DeletePDFResponse, PdfResponse } from "@/src/modules/master/pdf/pdf.response";
import { createUnionType } from "@nestjs/graphql";

export const CreatePDFResultUnion = createUnionType({
    name: 'CreatePDFResult',
    types: () => [PdfResponse, InvalidInputError, Error],
});
export const DeletePDFResultUnion = createUnionType({
    name: 'DeletePDFResult',
    types: () => [DeletePDFResponse, InvalidInputError, Error],
});