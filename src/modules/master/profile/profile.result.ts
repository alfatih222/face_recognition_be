import { createUnionType } from '@nestjs/graphql';
import { InvalidInputError } from '../../../graphql/responses/invalid-input.error';
import { Error } from '../../../graphql/types/error.type';
import { ProfileDto } from './profile.dto';

export const UpdateProfileResultUnion = createUnionType({
  name: 'UpdateProfileResult',
  types: () => [ProfileDto, InvalidInputError, Error],
});

