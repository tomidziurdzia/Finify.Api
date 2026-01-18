import { Audit } from 'src/shared/entities/audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionType } from '../enums/transaction-type-enum';

@Entity('transactions')
export class Transaction extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  date: Date;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;
}
