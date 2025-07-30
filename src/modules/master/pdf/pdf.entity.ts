import { BaseEntity } from "@/src/config/base.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "m_pdf" })
export class PdfEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    path: string;
}
