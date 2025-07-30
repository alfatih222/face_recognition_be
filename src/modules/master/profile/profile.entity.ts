import { UserEntity } from '../../master/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { registerEnumType } from '@nestjs/graphql';

export enum GenderType {
  L = 'L', // Laki-Laki
  P = 'P', // Perempuan
}

export const profileTableName = 'm_user_profile';
registerEnumType(GenderType, {
  name: 'GenderType',
});
@Entity({ name: profileTableName })
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  fullname: string;

  @Column({ name: 'nip', nullable: true })
  nip: string;

  @Column({ name: 'place_of_birth', nullable: true })
  placeOfBirth: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: GenderType,
    default: GenderType.L,
    nullable: true,
  })
  gender: GenderType;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column()
  user_id: string;

  @Column({ nullable: true })
  profile_photo: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date;

  @OneToOne(() => UserEntity, (user) => user.profile, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
