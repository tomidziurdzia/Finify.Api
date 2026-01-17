import { CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class Audit {
    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
    })
    updatedAt: Date;

    @Column('uuid', {
        name: 'created_by',
        nullable: true,
    })
    createdBy?: string;

    @Column('uuid', {
        name: 'updated_by',
        nullable: true,
    })
    updatedBy?: string;

    @Column('boolean', {
        default: true,
        name: 'is_active',
    })
    isActive: boolean;
}