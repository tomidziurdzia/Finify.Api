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
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { TransactionImage } from './entities/transaction-image.entity';
import e from 'express';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(TransactionImage)
    private readonly transactionImageRepository: Repository<TransactionImage>,

    private readonly datasource: DataSource,
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

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const transactions = await this.transactionRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true },
    });

    return transactions.map((transaction) => ({
      ...transaction,
      images: transaction.images.map((img) => img.url),
    }));
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: { images: true },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return {
      ...transaction,
      images: transaction.images.map((img) => img.url),
    };
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const { images, ...toUpdate } = updateTransactionDto;

    const transaction = await this.transactionRepository.preload({
      id,
      ...toUpdate,
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(TransactionImage, {
          transaction: { id },
        });

        transaction.images = images.map((image) =>
          this.transactionImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const transaction = await this.transactionRepository.findOneBy({ id });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

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

  // For testing purposes only
  async deleteAllTransactions() {
    const query = this.transactionRepository.createQueryBuilder('transaction');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
