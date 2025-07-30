import { Field, InputType } from '@nestjs/graphql';
import { PrimaryColumn } from 'typeorm';

@InputType('ProvinceSync')
export class ProvinceInput {
  @Field()
  @PrimaryColumn("varchar", {
    length: 12
  })
  id: string;

  @Field()
  name: string;

  @Field()
  active: boolean;
}
