import { Field, InputType } from '@nestjs/graphql';
import { PrimaryColumn } from 'typeorm';

@InputType('CitySync')
export class CityInput {
  @PrimaryColumn('varchar', {
    length: 10,
  })
  id: string;

  @Field()
  province_id: string;

  @Field()
  name: string;



  @Field()
  active: boolean;
}
