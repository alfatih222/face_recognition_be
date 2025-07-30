import { BaseEntity } from "@/src/config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MenuEntity } from "../menu/menu.entity";
import { RoleEntity } from "../m_role/role.entity";

@Entity({
    name: 'm_role_permision',
})
export class RolePermissionEntity extends BaseEntity {
    @ManyToOne(() => MenuEntity, (menu) => menu.id)
    @JoinColumn({ name: 'menu_id' })
    menu: MenuEntity;

    @ManyToOne(() => RoleEntity, (role) => role.id)
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;

    @Column()
    role_id: string;
    @Column()
    menu_id: string;
}
