import { BaseEntity } from "@/src/config/base.entity";
import { UserEntity } from "@/src/modules/master/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";


@Entity({ name: "absensi" })
export class AttendanceEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column()
    user_id: string;

    @Column({
        type: 'date',
    })
    date: string;

    @Column({nullable:true})
    checkIn: string;

    @Column({nullable:true})
    checkOut: string;

    @Column()
    latitude: string;
 
    @Column()
    longitude: string;

    @Column()
    type: string;
}
