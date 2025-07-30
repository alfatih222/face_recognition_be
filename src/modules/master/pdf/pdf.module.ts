import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfResolver } from './pdf.resolver';

@Module({
  imports: [],
  providers: [PdfService, PdfResolver],
  exports: [PdfService]
})
export class PdfModule { }
