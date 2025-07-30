import { Module, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';
import { ProfileModule } from '../profile/profile.module';
import { UserResolver } from './user.resolver';

const nestjsQueryTypeOrmModule = NestjsQueryTypeOrmModule.forFeature([
  UserEntity,
]);

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [nestjsQueryTypeOrmModule],
      dtos: [{ DTOClass: UserDto }],
      resolvers: [
        {
          DTOClass: UserDto,
          EntityClass: UserEntity,
          read: {
            one: { name: 'user' },
            many: { name: 'users' },
          },
          create: {
            one: { disabled: true },
            many: { disabled: true }
          },
          update: {
            one: { disabled: true },
            many: { disabled: true }
          },
          delete: {
            one: { disabled: true },
            many: { disabled: true }
          },
          pipes: [ValidationPipe],
        },
      ],
    }),
    nestjsQueryTypeOrmModule,
    ProfileModule,
  ],
  exports: [nestjsQueryTypeOrmModule],
  providers: [UserService, UserResolver],
})
export class UserModule { }
