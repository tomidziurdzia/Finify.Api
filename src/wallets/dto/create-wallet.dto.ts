import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { WalletType } from '../enums/wallet-type.enum';
import { CurrencyType } from 'src/shared/enums/currency-type.enum';

export class CreateWalletDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(WalletType)
    @IsNotEmpty()
    type: WalletType;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    balance?: number;

    @IsEnum(CurrencyType)
    @IsNotEmpty()
    currency: CurrencyType;

    @IsString()
    @IsOptional()
    description?: string;
}
