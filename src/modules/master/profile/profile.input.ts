
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { ProfileDto } from './profile.dto';

@InputType()
export class CreateProfileInput extends OmitType(
  ProfileDto,
  [
    'id',
    'profilePhoto',
    'createdAt',
    'updatedAt',
    'profilePhotoUrl',
  ],
  InputType,
) { }

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) { }

@InputType('UpdateProfileTypeInput')
export class UpdateProfileTypeInput {
  @Field()
  id: string;
}
