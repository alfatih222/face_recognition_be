import { Module } from '@nestjs/common';
import { SubdistrictService } from './subdistrict.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Subdistrict } from './subdistrict.entity';
import { SubdistrictDto } from './subdistrict.dto';
import { SubdistrictInput } from './subdistrict.input';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      services: [SubdistrictService],
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          Subdistrict,
        ]),
      ],
      resolvers: [
        {
          DTOClass: SubdistrictDto,
          EntityClass: Subdistrict,
          ServiceClass: SubdistrictService,
          CreateDTOClass: SubdistrictInput,
          UpdateDTOClass: SubdistrictInput,
          read: {
            one: {
              name: 'subdistrictSync',
            },
            many: {
              name: 'subdistrictSyncs',
            },
          },
          create: {
            one: { name: 'subdistrictSyncCreate' },
            many: { disabled: true },
          },
          update: {
            one: { name: 'subdistrictSyncUpdate' },
            many: { disabled: true },
          },
          delete: {
            one: { name: 'subdistrictSyncDelete' },
            many: { disabled: true },
          },
        },
      ],
    }),
  ],
  providers: [SubdistrictService],
})
export class SubdistrictModule { }
