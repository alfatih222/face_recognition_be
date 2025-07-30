import { QueryService } from '@nestjs-query/core';
import { UserEntity } from './user.entity';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ProfileService } from '../profile/profile.service';
import { I18nService } from 'nestjs-i18n';
import { TrDataUserSorting, UserDetailTableFilter } from './user.input';
import { ResultDetailUserDTO, userDetailDTO } from './user.result';
import { setQueryWithParams } from '@/src/common/utils/string-helpers';

@QueryService(UserEntity)
export class UserService extends TypeOrmQueryService<UserEntity> {
 constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly profileService: ProfileService,
    private readonly i18n: I18nService,

    @InjectEntityManager()
    private readonly manager: EntityManager,
  ) {
    super(userRepository, { useSoftDelete: true });
 }
  
  
   async getUsers(params: {
    filter: UserDetailTableFilter;
    // paging: PagingInput;
    sorting: TrDataUserSorting[];
  }): Promise<ResultDetailUserDTO> {
    const { filter, sorting } = params;

    // filter variable
    const {
      email: { iLike: email },
      username: { iLike: username },
      // user_id: { eq: userId },
      fullname: { iLike: fullname },
    } = {
      email: { iLike: null },
      username: { iLike: null },
      // user_id: { eq: null },
      fullname: { iLike: null },
      ...filter,
      ...(filter.and ?? []).reduce((prev, dt) => ({ ...prev, ...dt }), {}),
    };

    //paging variable
    // const { limit = 10, offset = 0 } = paging;

    // sorting variable
    const { field, direction } = sorting[0] ?? {};
    const sortingOpts = {
      userId: 'mu.id',
      email: 'mu.email',
      username: 'mu.username',
      fullname: 'mup.fullname',
      createdAt: 'mu.created_at',
      updatedAt: 'mu.updated_at',
    };
    const order = sortingOpts[field];

    const trRepo = this.manager.getRepository(UserEntity);

    const where: Record<string, string> = {
      ...(email ? { ['mu.email']: email } : {}),
      ...(username ? { ['mu.username']: username } : {}),
      ...(fullname ? { ['mup.fullname']: fullname } : {}),
    };

    // const whereString = Object.keys(where)
    //   .map((key) => `${key} ilike ${key}`)
    //   .join(' AND ');

    try {
      const queryBuilder = trRepo
        .createQueryBuilder('mu')
        .leftJoin('m_user_profile', 'mup', 'mup.user_id = mu.id')
        .where(
          Object.keys(where).reduce(
            (prev, key, i) =>
              prev +
              (!!i ? ' AND ' : '') +
              `${key} ILIKE :${key.split('.')[1]}`,
            '',
          ),
          Object.keys(where).reduce(
            (prev, key) => ({ ...prev, [key.split('.')[1]]: where[key] }),
            {},
          ),
        )
        .andWhere(`mup.id is not null`);

      const dt = await queryBuilder
        .clone()
        .select('mup.id', 'id')
        .addSelect('mu.email', 'email')
        .addSelect('mu.username', 'username')
        .addSelect('mup.fullname', 'fullname')
        .addSelect('mup.user_id', 'user_id')
        .addSelect('mup.phone', 'phone')
        .addSelect('mup.address', 'address')
        .addSelect('mu.updated_at', 'updateAt')
        .addSelect('mu.created_at', 'createdAt')
        // .limit(limit)
        // .offset(offset ?? 0)
        .orderBy(
          order ?? 'mu.updated_at',
          (direction ?? 'DESC') as 'ASC' | 'DESC',
        )
        .execute();
      console.log('dt', dt);
      const qry = queryBuilder.clone().select('mu.id', 'id').getQuery();
      const prm = queryBuilder.clone().select('mu.id', 'id').getParameters();

      const totalCount = Number(
        (
          await this.manager
            .createQueryBuilder()
            .from(`(${setQueryWithParams(qry, prm)})`, 'a')
            .select('SUM(1)', 'CNT')
            .execute()
        )[0]?.CNT ?? 0,
      );

      // const hasNextPage = offset + limit < totalCount;
      // const hasPreviousPage = !!offset;

      const nodes: userDetailDTO[] = [];

      for await (const data of dt) {
        nodes.push({
          id: data.id,
          email: data.email ?? '-',
          username: data.username ?? '-',
          user_id: data.user_id ?? '-',
          fullname: data.fullname ?? '-',
          phone: data.phone ?? '-',
          created_at: data.createdAt ?? '-',
          address: data.address ?? '-',
        });
      }

      return {
        nodes,
        // pageInfo: {
        //   hasNextPage,
        //   hasPreviousPage,
        // },
        totalCount,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
