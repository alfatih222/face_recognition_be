import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { MenuDto } from './menu.dto';
import { MenuInput } from './menu.input';
import { MenuEntity } from './menu.entity';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      services: [MenuService],
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          MenuEntity,
        ]),
      ],
      resolvers: [
        {
          DTOClass: MenuDto,
          EntityClass: MenuEntity,
          ServiceClass: MenuService,
          CreateDTOClass: MenuInput,
          UpdateDTOClass: MenuInput,
          guards: [JwtAuthGuard],
          read: {
            one: {
              name: 'menu',

            },
            many: {
              name: 'menus',
            },
          },
          create: {
            one: {
              name: 'menuCreate',
            },
            many: { disabled: true },
          },
          update: {
            one: { name: 'menuUpdate' },
            many: { disabled: true },
          },
          delete: {
            one: { name: 'menuDelete' },
            many: { disabled: true },
          },
        },
      ],
    }),
  ],
  providers: [MenuService],
})
export class MenuModule { }
