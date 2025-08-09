import { BaseEntity } from "@/src/config/base.entity";
import { City } from "@/src/modules/master/city/city.entity";
import { District } from "@/src/modules/master/district/district.entity";
import { Province } from "@/src/modules/master/province/province.entity";
import { Subdistrict } from "@/src/modules/master/subdistrict/subdistrict.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'm_setting' })
export class MSettingEntity extends BaseEntity {

    @Column()
    namaSekolah: string;

    @Column({ nullable: true })
    npsn?: string;

    @Column({ nullable: true })
    periode?: string;

    @Column({ nullable: true })
    alamat?: string;

    @Column({
        nullable: true,
    })
    city: string;

    @Column({
        nullable: true,
    })
    province: string;

    @Column({
        nullable: true,
    })
    district: string;

    @Column({
        nullable: true,
    })
    subdistrict: string;

    @Column({ nullable: true })
    kodePos?: string;

    @Column()
    jamMasuk: string;

    @Column()
    jamPulang: string;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @Column()
    radius: string;

    @Column({ nullable: true })
    logoSekolah?: string;

    @Column({ nullable: true })
    background?: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    telepon?: string;

    @Column({ nullable: true })
    website?: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
