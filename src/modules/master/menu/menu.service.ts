import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { MenuEntity } from './menu.entity';
@QueryService(MenuEntity)
export class MenuService extends TypeOrmQueryService<MenuEntity> {
    constructor(
        @InjectRepository(MenuEntity)
        private readonly menuRepository: Repository<MenuEntity>
    ) {
        super(menuRepository, { useSoftDelete: true });
    }

}
