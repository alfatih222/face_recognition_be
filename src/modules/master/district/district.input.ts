import { Field, InputType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';

@InputType('DistrictSync')
export class DistrictInput {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  city_id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  no_kec: string;

  @Field({ nullable: true })
  no_kab: string;

  @Field({ nullable: true })
  no_prop: string;


  @Field()
  active: boolean;
}
