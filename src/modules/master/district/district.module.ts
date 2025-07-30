import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { District } from './district.entity';
import { DistrictDto } from './district.dto';
import { DistrictInput } from './district.input';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      services: [DistrictService],
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          District,
        ]),
      ],
      resolvers: [
        {
          DTOClass: DistrictDto,
          EntityClass: District,
          ServiceClass: DistrictService,
          CreateDTOClass: DistrictInput,
          UpdateDTOClass: DistrictInput,
          read: {
            one: {
              name: 'districtSync',
            },
            many: {
              name: 'districtSyncs',
            },
          },
          create: {
            one: { name: 'districtSyncCreate' },
            many: { disabled: true },
          },
          update: {
            one: { name: 'districtSyncUpdate' },
            many: { disabled: true },
          },
          delete: {
            one: { name: 'districtSyncDelete' },
            many: { disabled: true },
          },
        },
      ],
    }),
  ],
  providers: [DistrictService],
})
export class DistrictModule { }
