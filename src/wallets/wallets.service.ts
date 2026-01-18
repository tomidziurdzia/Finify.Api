import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { error } from 'console';

@Injectable()
export class WalletsService {

  private readonly logger = new Logger(WalletsService.name);
  
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository : Repository<Wallet>,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    try {
      const wallet = this.walletRepository.create(createWalletDto);
      return await this.walletRepository.save(wallet);
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all wallets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }

  private handleDBExceptions( error: any ){
     if(error.code === "23505") {
        throw new BadRequestException(error.detail);
      }
      
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
