import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType('RolePermission')
export class RolePermissionInput {
    @Field()
    @IsString({})
    role_id: string;
    @Field({ nullable: true })
    menu_id: string;

}
