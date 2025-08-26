import { QueryService } from '@nestjs-query/core';
import { UserEntity } from './user.entity';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { ProfileService } from '../profile/profile.service';
import { I18nService } from 'nestjs-i18n';
import { TrDataUserSorting, UserDetailTableFilter } from './user.input';
import { ResultDetailUserDTO, userDetailDTO } from './user.result';
import { setQueryWithParams } from '@/src/common/utils/string-helpers';
import { ILikeFilter, PagingInput } from '@/src/common/input/datable.input';

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
    paging: PagingInput;
    sorting: TrDataUserSorting[];
  }): Promise<ResultDetailUserDTO> {
    const { filter = {}, paging = { limit: 10, offset: 0 }, sorting = [] } = params;
    const { limit = 10, offset = 0 } = paging;

    const safeFilter = filter as Partial<UserDetailTableFilter>;

    const email: ILikeFilter = safeFilter.email ?? {};
    const username: ILikeFilter = safeFilter.username ?? {};
    const fullname: ILikeFilter = safeFilter.fullname ?? {};
    const and = safeFilter.and ?? [];
    const or = safeFilter.or ?? [];

    const mergedAndFilters = and.reduce(
      (acc, curr) => {
        return {
          email: { ...acc.email, ...(curr.email ?? {}) },
          username: { ...acc.username, ...(curr.username ?? {}) },
          fullname: { ...acc.fullname, ...(curr.fullname ?? {}) },
        };
      },
      { email: {}, username: {}, fullname: {} } as {
        email: ILikeFilter;
        username: ILikeFilter;
        fullname: ILikeFilter;
      }
    );

    const finalEmail = email.iLike ?? mergedAndFilters.email?.iLike ?? null;
    const finalUsername = username.iLike ?? mergedAndFilters.username?.iLike ?? null;
    const finalFullname = fullname.iLike ?? mergedAndFilters.fullname?.iLike ?? null;

    // Sorting
    const { field, direction } = sorting[0] ?? {};
    const sortFieldMap = {
      userId: 'mu.id',
      email: 'mu.email',
      username: 'mu.username',
      fullname: 'mup.fullname',
      createdAt: 'mu.created_at',
      updatedAt: 'mu.updated_at',
    };
    const orderByField = sortFieldMap[field] ?? 'mu.updated_at';
    const orderDirection = (direction ?? 'DESC') as 'ASC' | 'DESC';

    const trRepo = this.manager.getRepository(UserEntity);

    try {
      const queryBuilder = trRepo
        .createQueryBuilder('mu')
        .leftJoin('m_user_profile', 'mup', 'mup.user_id = mu.id')
        .andWhere(`mup.id IS NOT NULL`);

      // Apply AND filters
      if (finalEmail) queryBuilder.andWhere('mu.email ILIKE :email', { email: finalEmail });
      if (finalUsername) queryBuilder.andWhere('mu.username ILIKE :username', { username: finalUsername });
      if (finalFullname) queryBuilder.andWhere('mup.fullname ILIKE :fullname', { fullname: finalFullname });

      // Apply OR filters
      if (or.length > 0) {
        queryBuilder.andWhere(new Brackets((qb) => {
          or.forEach((orFilter, index) => {
            const orConditions: string[] = [];
            const orParams: Record<string, any> = {};

            if (orFilter.email?.iLike) {
              orConditions.push(`mu.email ILIKE :orEmail${index}`);
              orParams[`orEmail${index}`] = orFilter.email.iLike;
            }
            if (orFilter.username?.iLike) {
              orConditions.push(`mu.username ILIKE :orUsername${index}`);
              orParams[`orUsername${index}`] = orFilter.username.iLike;
            }
            if (orFilter.fullname?.iLike) {
              orConditions.push(`mup.fullname ILIKE :orFullname${index}`);
              orParams[`orFullname${index}`] = orFilter.fullname.iLike;
            }

            if (orConditions.length > 0) {
              qb.orWhere(orConditions.join(' OR '), orParams);
            }
          });
        }));
      }

      // Build data query with pagination and sorting
      const dataQuery = queryBuilder
        .clone()
        .select([
          'mup.id AS id',
          'mu.email AS email',
          'mu.username AS username',
          'mup.fullname AS fullname',
          'mup.user_id AS user_id',
          'mup.phone AS phone',
          'mup.address AS address',
          'mu.updated_at AS updatedAt',
          'mu.created_at AS createdAt',
        ])
        .limit(limit)
        .offset(offset)
        .orderBy(orderByField, orderDirection);

      const dataRows = await dataQuery.execute();

      // Total count query
      const qry = queryBuilder.clone().select('mu.id', 'id').getQuery();
      const prm = queryBuilder.clone().select('mu.id', 'id').getParameters();

      const totalCountResult = await this.manager
        .createQueryBuilder()
        .from(`(${setQueryWithParams(qry, prm)})`, 'a')
        .select('COUNT(*)', 'CNT')
        .execute();

      const totalCount = Number(totalCountResult?.[0]?.CNT ?? 0);
      const hasNextPage = offset + limit < totalCount;
      const hasPreviousPage = offset > 0;

      const nodes: userDetailDTO[] = dataRows.map((data) => ({
        id: data.id,
        email: data.email ?? '-',
        username: data.username ?? '-',
        user_id: data.user_id ?? '-',
        fullname: data.fullname ?? '-',
        phone: data.phone ?? '-',
        address: data.address ?? '-',
        created_at: data.createdAt ?? '-',
      }));

      return {
        nodes,
        totalCount,
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
        },
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

}
