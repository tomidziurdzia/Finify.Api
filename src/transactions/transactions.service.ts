import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { TransactionImage } from './entities/transaction-image.entity';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(TransactionImage)
    private readonly transactionImageRepository: Repository<TransactionImage>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const { images = [], ...transactionDetails } = createTransactionDto;

      const transaction = this.transactionRepository.create({
        ...transactionDetails,
        images: images.map((image) =>
          this.transactionImageRepository.create({ url: image }),
        ),
      });

      await this.transactionRepository.save(transaction);

      return { ...transaction, images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.transactionRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOneBy({ id });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.preload({
      id: id,
      ...updateTransactionDto,
      images: [],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    try {
      await this.transactionRepository.save(transaction);

      return transaction;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);

    await this.transactionRepository.remove(transaction);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
