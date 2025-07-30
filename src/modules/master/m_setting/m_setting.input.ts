import { MSettingDto } from "@/src/modules/master/m_setting/m_setting.dto";
import { InputType, OmitType, PartialType } from "@nestjs/graphql";

@InputType('SettingSync')
export class MSettingInput extends OmitType(
    MSettingDto,
    ['id', 'isActive', 'createdAt', 'updatedAt'],
    InputType
) { }


@InputType()
export class MSettingUpdate extends PartialType(MSettingInput) { }