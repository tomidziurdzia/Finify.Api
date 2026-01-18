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

    @Column('varchar', {
        name: 'created_by',
        default: 'system',
    })
    createdBy: string;

    @Column('varchar', {
        name: 'updated_by',
        default: 'system',
    })
    updatedBy: string;

    @Column('boolean', {
        default: true,
        name: 'is_active',
    })
    isActive: boolean;
}