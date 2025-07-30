import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { ValidateInput } from '@/src/common/decorators/validate-input.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';
import { UpdateProfileResultUnion } from './profile.result';
import { ImageFile } from '@/src/common/upload/upload.scalar';
import { FileUpload } from 'graphql-upload';
import { UpdateProfileInput } from './profile.input';
import { UserEntity } from '../user/user.entity';
import { Input } from '@/src/graphql/args/input.args';
import { GqlUser } from '@/src/common/decorators/gql-user.decorator';
import { ProfileAssembler } from './profile.assembler';
import { ProfileDto } from './profile.dto';
import { ProfileEntity } from './profile.entity';

@Resolver()
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) { }

    @ValidateInput()
    @UseGuards(JwtAuthGuard)
    @Mutation(() => [UpdateProfileResultUnion])
    async updateProfile(
        @Args({ name: 'profilePhoto', type: () => ImageFile, nullable: true })
        profilePhoto: FileUpload,
        @Args({ name: 'id', type: () => ID, nullable: true })
        id: string,
        @Input() input: UpdateProfileInput,
        @GqlUser() user: UserEntity,
    ): Promise<Array<typeof UpdateProfileResultUnion>> {

        const result = await this.profileService.updateProfile(
            id,
            { profilePhoto, ...input },
            user,
        );
        if (result.isError()) {
            return [result.value];
        }

        return [
            new ProfileAssembler(ProfileDto, ProfileEntity).convertToDTO(
                result.value,
            ),
        ];
    }
}
