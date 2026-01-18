import { Audit } from "src/shared/entities/audit.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CategoryType } from "../enums/category-type-enum";

@Entity('categories')
export class Category extends Audit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {unique: true})
    name: string;

    @Column({
        type: 'enum',
        enum: CategoryType,
    })
    type: CategoryType;
}
    