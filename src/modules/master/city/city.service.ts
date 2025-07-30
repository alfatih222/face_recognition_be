import { City } from '@/src/modules/master/city/city.entity';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryService(City)
export class CityService extends TypeOrmQueryService<City> {
    constructor(
        @InjectRepository(City)
        private readonly cityRepository: Repository<City>
    ) {
        super(cityRepository, { useSoftDelete: true });
    }

}
