import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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
    return this.walletRepository.find();
  }

  async findOne(id: string) {
    const wallet = await this.walletRepository.findOneBy({id});

    if(!wallet)
    {
      throw new NotFoundException(`Wallet with id ${id} not found`);
    }

    return wallet;
  }

  update(id: string, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  async remove(id: string) {
    const wallet = await this.findOne(id);

    await this.walletRepository.remove(wallet);
  }

  private handleDBExceptions( error: any ){
     if(error.code === "23505") {
        throw new BadRequestException(error.detail);
      }
      
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
