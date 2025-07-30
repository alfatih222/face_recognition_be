import { Field, InputType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';

@InputType('SubdistrictSync')
export class SubdistrictInput {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  district_id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  no_kel: string;
  @Field({ nullable: true })
  no_kec: string;
  @Field({ nullable: true })
  no_kab: string;
  @Field({ nullable: true })
  no_prop: string;

  @Field()
  active: boolean;
}
