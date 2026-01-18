import { Audit } from 'src/shared/entities/audit.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionType } from '../enums/transaction-type-enum';
import { TransactionImage } from './transaction-image.entity';

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

  @OneToMany(
    () => TransactionImage,
    (transactionImage) => transactionImage.transaction,
    { cascade: true },
  )
  images?: TransactionImage[];
}
