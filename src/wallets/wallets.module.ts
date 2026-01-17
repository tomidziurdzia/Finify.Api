import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
  imports: [
    TypeOrmModule.forFeature([Wallet]),
  ],
})
export class WalletsModule {}
