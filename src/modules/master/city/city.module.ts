import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { City } from './city.entity';
import { CityDto } from './city.dto';
import { CityInput } from './city.input';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      services: [CityService],
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          City,
        ]),
      ],
      resolvers: [
        {
          DTOClass: CityDto,
          EntityClass: City,
          ServiceClass: CityService,
          CreateDTOClass: CityInput,
          UpdateDTOClass: CityInput,
          read: {
            one: {
              name: 'citySync',
            },
            many: {
              name: 'citySyncs',
            },
          },
          create: {
            one: { name: 'citySyncCreate' },
            many: { disabled: true },
          },
          update: {
            one: { name: 'citySyncUpdate' },
            many: { disabled: true },
          },
          delete: {
            one: { name: 'citySyncDelete' },
            many: { disabled: true },
          },
        },
      ],
    }),
  ],
  providers: [CityService],
})
export class CityModule { }
