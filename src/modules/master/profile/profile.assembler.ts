import { Assembler, ClassTransformerAssembler } from '@nestjs-query/core';
import { ProfileDto } from './profile.dto';
import { ProfileEntity } from './profile.entity';

@Assembler(ProfileDto, ProfileEntity)
export class ProfileAssembler extends ClassTransformerAssembler<
  ProfileDto,
  ProfileEntity
> {}
