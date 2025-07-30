import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { City } from '../city/city.entity';

export const districtNewTableName='m_district_sync'


@Entity({
  name: districtNewTableName
})
export class District {
  @PrimaryColumn('varchar', {
    length: 12,
  })
  id: string;

  @ManyToOne(() => City, (city) => city.id)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column()
  city_id: string;

  @Column()
  name: string;
  @Column({ name: 'alt_name', type: 'varchar', nullable: true, default: null })
  altName: string;

  @Column({ nullable: true })
  no_kec: string;

  @Column({ nullable: true })
  no_kab: string;

  @Column({ nullable: true })
  no_prop: string;

  @Column({
    default: true,
    nullable: true,
  })
  active: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable:true,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date;
}
