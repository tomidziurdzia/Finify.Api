import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { CurrencyType, WalletType } from 'src/shared/enums';

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
