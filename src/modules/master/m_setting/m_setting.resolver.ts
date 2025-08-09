import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MSettingService } from './m_setting.service';
import { MSettingDto, ResponseSetting } from './m_setting.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';
import { Input } from '@/src/graphql/args/input.args';
import { MSettingInput } from './m_setting.input';
import { ImageFile } from '@/src/common/upload/upload.scalar';
import { FileUpload } from 'graphql-upload';
import { ValidateInput } from '@/src/common/decorators/validate-input.decorator';
import { GqlUser } from '@/src/common/decorators/gql-user.decorator';
import { UserEntity } from '../user/user.entity';
import { RoleBaseGuard } from '@/src/common/guards/role-base.guard';
import { MSettingEntity } from './m_setting.entity';

@Resolver()
export class MSettingResolver {
    constructor(private readonly settingService: MSettingService) { }

    @ValidateInput()
    @Mutation(() => ResponseSetting)
    @UseGuards(JwtAuthGuard)
    async updateSetting(
        @Args('id') id: string,
        @Input() input: MSettingInput,
        @Args({ name: 'logo', type: () => ImageFile, nullable: true })
        logo?: FileUpload | null,
        @Args({ name: 'background', type: () => ImageFile, nullable: true })
        background?: FileUpload|null,
    ): Promise<ResponseSetting> {
        const res = await this.settingService.updateSetting(
            id,
            { logo, background, ...input }
        );
        if (res.isError) {
            return res.value;
        }

        return res.value
    }

    @Query(() => MSettingDto)
    @UseGuards(JwtAuthGuard)
    async getSetting(
    ): Promise<MSettingEntity> {
        const res = await this.settingService.getSetting();
        if (res.isError) {
            return res.value;
        }
        console.log('asw', res)
        return res.value
    }
}
