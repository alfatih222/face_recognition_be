import { Assembler, ClassTransformerAssembler } from '@nestjs-query/core';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';

@Assembler(UserDto, UserEntity)
export class UserAssembler extends ClassTransformerAssembler<
  UserDto,
  UserEntity
> {}
