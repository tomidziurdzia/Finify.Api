import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { CurrencyType, WalletType } from '../../shared/enums';
import { Audit } from "src/shared/entities/audit.entity";

@Entity('wallets')
@Unique(['name', 'currency'])
export class Wallet extends Audit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column({
        type: 'enum',
        enum: WalletType,
    })
    type: WalletType;

    @Column('decimal', {
        precision: 10,
        scale: 2,
        default: 0,
    })
    balance: number;

    @Column({
        type: 'enum',
        enum: CurrencyType,
        //Change after adding multi-currency support and user preferences
        default: CurrencyType.USD,
    })
    currency: CurrencyType;

    @Column('text', {
        nullable: true,
    })
    description?: string;
}
