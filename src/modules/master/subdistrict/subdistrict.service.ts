import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Subdistrict } from './subdistrict.entity';
@QueryService(Subdistrict)
export class SubdistrictService extends TypeOrmQueryService<Subdistrict> {
    constructor(
        @InjectRepository(Subdistrict)
        private readonly subdistrictRepository: Repository<Subdistrict>
    ) {
        super(subdistrictRepository, { useSoftDelete: true });
    }

}
