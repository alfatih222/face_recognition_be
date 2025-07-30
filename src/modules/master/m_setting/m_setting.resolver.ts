import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MSettingService } from './m_setting.service';
import { ResponseSetting } from './m_setting.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';
import { Input } from '@/src/graphql/args/input.args';
import { MSettingInput } from './m_setting.input';
import { ImageFile } from '@/src/common/upload/upload.scalar';
import { FileUpload } from 'graphql-upload';
import { ValidateInput } from '@/src/common/decorators/validate-input.decorator';

@Resolver()
export class MSettingResolver {
    constructor(private readonly settingService: MSettingService) { }

    @ValidateInput()
    @Mutation(() => ResponseSetting)
    @UseGuards(JwtAuthGuard)
    async updateSetting(
        @Args('id') id: string,
        @Args({ name: 'logo', type: () => ImageFile, nullable: true })
        logo: FileUpload,
        @Args({ name: 'background', type: () => ImageFile, nullable: true })
        background: FileUpload,
        @Input() input: MSettingInput
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
}
