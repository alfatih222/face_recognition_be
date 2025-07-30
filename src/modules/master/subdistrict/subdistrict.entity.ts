import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { District } from '../district/district.entity';

export const subdistrictNewTableName = 'm_subdistrict_sync';

@Entity({
  name: subdistrictNewTableName,
})
export class Subdistrict {
  @PrimaryColumn('varchar', {
    length: 12,
  })
  id: number;

  @ManyToOne(() => District, (district) => district.id)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @Column()
  district_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  no_kel: string;
  @Column({ nullable: true })
  no_kec: string;
  @Column({ nullable: true })
  no_kab: string;
  @Column({ nullable: true })
  no_prop: string;

  @Column({ nullable: true, default: true })
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
    nullable: true,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date;
}
