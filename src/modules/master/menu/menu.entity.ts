import { BaseEntity } from "@/src/config/base.entity";
import { registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

export enum MenuType {
    MENU = 'menu', func = 'func'
}

registerEnumType(MenuType, {
    name: 'MenuType',
});
@Entity({
    name: 'm_menu',
})
export class MenuEntity extends BaseEntity {
    @ManyToOne(() => MenuEntity, (menu) => menu.children)
    @JoinColumn({ name: 'menu_id' })
    parent: MenuEntity;

    @Column()
    name: string;
    @Column({ nullable: true })
    icon: string;
    @Column({ nullable: true })
    url: string;
    @Column({ nullable: true })
    fieldname: string;

    @Column({ type: 'enum', enum: MenuType, default: null, nullable: true, })
    type: MenuType;


    @OneToMany(() => MenuEntity, (menu) => menu.parent)
    @JoinColumn({ name: 'menu_id' })
    children: MenuEntity[];

    @Column({ nullable: true })
    menu_id: string;
}
