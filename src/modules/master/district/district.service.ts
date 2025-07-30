import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { District } from './district.entity';
@QueryService(District)
export class DistrictService extends TypeOrmQueryService<District> {
    constructor(
        @InjectRepository(District)
        private readonly districtRepository: Repository<District>
    ) {
        super(districtRepository, { useSoftDelete: true });
    }

}
