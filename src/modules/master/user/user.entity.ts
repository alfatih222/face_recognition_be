import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { RoleEntity } from '../m_role/role.entity';
import * as Password from '../../../common/utils/password';
import { BaseEntity } from '@/src/config/base.entity';
import { ProfileEntity } from '../profile/profile.entity';

@Entity({ name: 'm_user' })
export class UserEntity extends BaseEntity {

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  password: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => RoleEntity, (role) => role.id, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column({
    nullable: true,
  })
  role_id: string;

  @Column({
    nullable: true,
  })
  file: string;

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity;

  @BeforeInsert()
  async hashPassword() {
    this.password = await Password.toHash(this.password);
  }

  async comparePassword(password: string) {
    return Password.compare(this.password, password);
  }
}
