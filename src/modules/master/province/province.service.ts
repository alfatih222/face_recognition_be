import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Province } from './province.entity';
@QueryService(Province)
export class ProvinceService extends TypeOrmQueryService<Province> {
    constructor(
        @InjectRepository(Province)
        private readonly provinceRepository: Repository<Province>
    ) {
        super(provinceRepository, { useSoftDelete: true });
    }

}
