import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType('Menu')
export class MenuInput {
    @Field()
    @IsString({})
    name: string;
    @Field({ nullable: true })
    icon: string;
    @Field({ nullable: true })
    url: string;
    @Field({ nullable: true })
    fieldname: string;
    @Field({ nullable: true })
    type: string;
    @Field({ nullable: true })
    menu_id: string;

}
