import { DataSource } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ethers } from 'ethers';
import { DaiTransaction } from './entities/dai-transaction.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { TransactionType } from './enum/transaction-type.enum';
import * as daiABI from '../../abi/Dai.json';

@Injectable()
export class DaiService {
  private readonly logger = new Logger(DaiService.name);
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly contract: ethers.Contract;

  constructor(private readonly dataSource: DataSource) {
    const infuraApiKey = process.env.INFURA_API_KEY;
    const infuraNetwork = process.env.INFURA_NETWORK; // or mainnet, kovan, etc.
    this.provider = new ethers.providers.InfuraProvider(
      infuraNetwork,
      infuraApiKey,
    );
    this.contract = new ethers.Contract(
      process.env.DAI_CONTRACT_ADDRESS,
      daiABI,
      this.provider,
    );
  }

  async getSymbol(): Promise<string> {
    return this.contract.symbol();
  }

  async getDecimals(): Promise<number> {
    return this.contract.decimals();
  }

  async getLatestBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }

  async getTransactions(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<DaiTransaction[]> {
    const { page, limit } = paginationQueryDto;
    const offset = (page - 1) * limit;
    const transactions = await this.dataSource
      .getRepository(DaiTransaction)
      .createQueryBuilder()
      .orderBy('id', 'DESC')
      .offset(offset)
      .limit(limit)
      .getMany();
    return transactions;
  }

  async getTransactionsByAddress(
    walletAddress: string,
    paginationQueryDto: PaginationQueryDto,
    type?: TransactionType,
  ): Promise<DaiTransaction[]> {
    const queryBuilder = this.dataSource
      .getRepository(DaiTransaction)
      .createQueryBuilder('transaction')
      .where(
        'transaction.sender = :walletAddress OR transaction.recipient = :walletAddress',
        { walletAddress },
      )
      .orderBy('transaction.id', 'DESC');

    const count = await queryBuilder.getCount();
    if (count === 0) {
      throw new NotFoundException(`Wallet address not found`);
    }

    if (type) {
      switch (type) {
        case TransactionType.RECIPIENT:
          queryBuilder.andWhere('transaction.recipient = :walletAddress', {
            walletAddress,
          });
          break;
        case TransactionType.SENDER:
          queryBuilder.andWhere('transaction.sender = :walletAddress', {
            walletAddress,
          });
          break;
        default:
          throw new BadRequestException('Invalid transaction type');
      }
    } else {
      throw new BadRequestException('Transaction type not provided');
    }

    try {
      const { limit, page } = paginationQueryDto;
      const transactions = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
      return transactions;
    } catch (error) {
      throw new BadRequestException('Invalid pagination parameters');
    }
  }

  async getBalance(walletAddress: string): Promise<number> {
    const queryBuilder = this.dataSource
      .getRepository(DaiTransaction)
      .createQueryBuilder('transaction')
      .where(
        'transaction.sender = :walletAddress OR transaction.recipient = :walletAddress',
        {
          walletAddress,
        },
      )
      .select('SUM(CAST(value as NUMERIC))', 'sum');

    let transactions: { sum: string } | undefined;

    try {
      transactions = await queryBuilder.getRawOne();
    } catch (error) {
      this.logger.error(error);
      throw new Error('An error occurred while retrieving the balance');
    }

    if (!transactions || !transactions.sum) {
      throw new NotFoundException('No transactions found for this address');
    }

    return parseFloat(transactions.sum);
  }
}
