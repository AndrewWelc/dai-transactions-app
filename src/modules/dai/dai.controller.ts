import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { DaiService } from './dai.service';
import { DaiTransaction } from './entities/dai-transaction.entity';
import { ApiParam, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AddressParamDto } from './dto/address-param.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { TransactionType } from './enum/transaction-type.enum';

@Controller('dai')
@ApiTags('Dai')
@ApiSecurity('x-api-key')
export class DaiController {
  constructor(private readonly daiService: DaiService) {}

  @Get('transactions')
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of transactions per page',
  })
  async getTransactions(
    @Query(new ValidationPipe({ transform: true }))
    paginationQueryDto: PaginationQueryDto,
  ): Promise<DaiTransaction[]> {
    const transactions = await this.daiService.getTransactions(
      paginationQueryDto,
    );
    return transactions;
  }

  @Get('transactions/:walletAddress')
  @ApiParam({
    name: 'walletAddress',
    description: 'Ethereum address',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'type',
    description: 'Transaction type',
    enum: [TransactionType.SENDER, TransactionType.RECIPIENT],
    required: true,
  })
  async getTransactionsByAddress(
    @Param(new ValidationPipe({ transform: true }))
    addressParamDto: AddressParamDto,
    @Query('type', new ValidationPipe({ transform: true }))
    transactionType?: TransactionType,
    @Query(new ValidationPipe({ transform: true }))
    paginationQueryDto?: PaginationQueryDto,
  ): Promise<DaiTransaction[]> {
    const transactions = await this.daiService.getTransactionsByAddress(
      addressParamDto.walletAddress,
      paginationQueryDto,
      transactionType,
    );
    return transactions;
  }

  @Get(':walletAddress/balance')
  @ApiParam({
    name: 'walletAddress',
    description: 'Ethereum address',
    type: 'string',
    required: true,
  })
  async getBalance(
    @Param(new ValidationPipe({ transform: true }))
    addressParamDto: AddressParamDto,
  ): Promise<number> {
    const balance = await this.daiService.getBalance(
      addressParamDto.walletAddress,
    );
    return balance;
  }
}
