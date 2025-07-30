import { ValidateInput } from '@/src/common/decorators/validate-input.decorator';
import { Input } from '@/src/graphql/args/input.args';
import { PdfInput } from '@/src/modules/master/pdf/pdf.input';
// import { CreatePDFResultUnion, DeletePDFResultUnion } from '@/src/modules/master/pdf/pdf.result';
import { PdfService } from '@/src/modules/master/pdf/pdf.service';
import { Mutation, Resolver } from '@nestjs/graphql';
import { CreatePDFResultUnion } from './pdf.result';

@Resolver()
export class PdfResolver {
    constructor(private readonly pdfService: PdfService) { }

    @ValidateInput()
    @Mutation(() => [CreatePDFResultUnion])
    async createPDF(
    ): Promise<Array<typeof CreatePDFResultUnion>> {
        const result = await this.pdfService.generatePDFAbsensiGuru();
        if (result.isError) {
            return [result.value]
        }
        return [result.value];
    }

    // @ValidateInput()
    // @Mutation(() => [CreatePDFResultUnion])
    // async createPDFFile(
    //     @Input() input: PdfInput,
    // ): Promise<Array<typeof CreatePDFResultUnion>> {
    //     // const result = await this.pdfService.generatePDFFile(input);
    //     return;
    // }

    // @ValidateInput()
    // @Mutation(() => [DeletePDFResultUnion])
    // async deletePDF(
    //     @Input() input: PdfInput,
    // ): Promise<Array<typeof DeletePDFResultUnion>> {
    //     // const result = await this.pdfService.deletePDF(input);
    //     // return [result.value];
    //     return
    // }
}
