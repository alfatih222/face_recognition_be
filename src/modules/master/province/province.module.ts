import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Province } from './province.entity';
import { ProvinceDto } from './province.dto';
import { ProvinceInput } from './province.input';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      services: [ProvinceService],
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          Province,
        ]),
      ],
      resolvers: [
        {
          DTOClass: ProvinceDto,
          EntityClass: Province,
          ServiceClass: ProvinceService,
          CreateDTOClass: ProvinceInput,
          UpdateDTOClass: ProvinceInput,
          read: {
            one: {
              name: 'provinceSync',
            },
            many: {
              name: 'provinceSyncs',
            },
          },
          create: {
            one: { name: 'provinceSyncCreate' },
            many: { disabled: true },
          },
          update: {
            one: { name: 'provinceSyncUpdate' },
            many: { disabled: true },
          },
          delete: {
            one: { name: 'provinceSyncDelete' },
            many: { disabled: true },
          },
        },
      ],
    }),
  ],
  providers: [ProvinceService],
})
export class ProvinceModule { }
