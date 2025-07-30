import { Module } from '@nestjs/common';
import { ProfileEntity } from './profile.entity';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { ProfileDto } from './profile.dto';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { UserEntity } from '../user/user.entity';

const nestjsQueryTypeOrmModule = NestjsQueryTypeOrmModule.forFeature([
  ProfileEntity,
]);

@Module({
  providers: [ProfileResolver, ProfileService],
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([ProfileEntity, UserEntity])],
      resolvers: [
        {
          DTOClass: ProfileDto,
          EntityClass: ProfileEntity,
          read: {
            one: { name: 'profile' },
            many: { name: 'profiles' },
          },
          create: {
            one: { disabled: true },
            many: { disabled: true },
          },
          update: {
            one: { disabled: true },
            many: { disabled: true },
          },
          delete: {
            one: { disabled: true },
            many: { disabled: true },
          },
        },
      ],
    }),
    nestjsQueryTypeOrmModule,
  ],
  exports: [nestjsQueryTypeOrmModule, ProfileService],
})
export class ProfileModule { }
