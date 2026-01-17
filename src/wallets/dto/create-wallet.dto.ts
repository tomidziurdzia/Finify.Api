import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CurrencyType, WalletType } from '../../shared/enums';

export class CreateWalletDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(WalletType)
    @IsNotEmpty()
    type: WalletType;

    @IsNumber()
    @Min(0)
    @IsOptional()
    balance?: number;

    @IsEnum(CurrencyType)
    @IsNotEmpty()
    currency: CurrencyType;

    @IsString()
    @IsOptional()
    description?: string;
}
