import { Test, TestingModule } from '@nestjs/testing';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { AddressParamDto } from './dto/address-param.dto';
import { DaiController } from './dai.controller';
import { DaiService } from './dai.service';
import { DaiTransaction } from './entities/dai-transaction.entity';
import { TransactionType } from './enum/transaction-type.enum';
import { NotFoundException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../../db/data-source';

describe('DaiController', () => {
  let controller: DaiController;
  let service: DaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DaiController],
      providers: [DaiService],
      imports: [TypeOrmModule.forRoot(dataSourceOptions)],
    }).compile();

    controller = module.get<DaiController>(DaiController);
    service = module.get<DaiService>(DaiService);
  });

  describe('getTransactions', () => {
    it('should return an array of transactions', async () => {
      const paginationQueryDto = new PaginationQueryDto();
      const transactions: DaiTransaction[] = [
        {
          id: 1,
          blockNumber: 1234,
          timestamp: new Date('2022-05-09T12:00:00Z'),
          sender: '0x1234567890',
          recipient: '0x0987654321',
          value: '1000000000000000000',
          txHash: '0x1234567890abcdef',
        },
        {
          id: 2,
          blockNumber: 5678,
          timestamp: new Date('2022-05-10T12:00:00Z'),
          sender: '0x0987654321',
          recipient: '0x1234567890',
          value: '2000000000000000000',
          txHash: '0xabcdef1234567890',
        },
      ];
      jest
        .spyOn(service, 'getTransactions')
        .mockResolvedValueOnce(transactions);

      const result = await controller.getTransactions(paginationQueryDto);

      expect(result).toBe(transactions);
    });
  });

  describe('getTransactionsByAddress', () => {
    it('should return an array of transactions for the given wallet address and transaction type', async () => {
      const addressParamDto = new AddressParamDto();
      addressParamDto.walletAddress = '0x1234567890';
      const transactionType = TransactionType.SENDER;
      const paginationQueryDto = new PaginationQueryDto();
      const transactions: DaiTransaction[] = [
        {
          id: 1,
          blockNumber: 1234,
          timestamp: new Date('2022-05-09T12:00:00Z'),
          sender: '0x1234567890',
          recipient: '0x0987654321',
          value: '1000000000000000000',
          txHash: '0x1234567890abcdef',
        },
        {
          id: 2,
          blockNumber: 5678,
          timestamp: new Date('2022-05-10T12:00:00Z'),
          sender: '0x0987654321',
          recipient: '0x1234567890',
          value: '2000000000000000000',
          txHash: '0xabcdef1234567890',
        },
      ];
      jest
        .spyOn(service, 'getTransactionsByAddress')
        .mockResolvedValueOnce(transactions);

      const result = await controller.getTransactionsByAddress(
        addressParamDto,
        transactionType,
        paginationQueryDto,
      );

      expect(result).toBe(transactions);
    });

    it('should throw NotFoundException when the wallet address is not found', async () => {
      const addressParamDto = new AddressParamDto();
      addressParamDto.walletAddress = 'invalid-address';
      const transactionType = TransactionType.SENDER;
      const paginationQueryDto = new PaginationQueryDto();
      jest.spyOn(service, 'getTransactionsByAddress').mockResolvedValueOnce([]);

      try {
        await controller.getTransactionsByAddress(
          addressParamDto,
          transactionType,
          paginationQueryDto,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Wallet address not found');
      }
    });
  });

  describe('getBalance', () => {
    it('should return the balance for the given wallet address', async () => {
      const addressParamDto = new AddressParamDto();
      addressParamDto.walletAddress = '0x1234567890';
      const balance = 100;
      jest.spyOn(service, 'getBalance').mockResolvedValueOnce(balance);

      const result = await controller.getBalance(addressParamDto);

      expect(result).toBe(balance);
    });

    it('should throw NotFoundException when the wallet address is not found', async () => {
      const addressParamDto = new AddressParamDto();
      addressParamDto.walletAddress = 'invalid-address';
      jest.spyOn(service, 'getBalance').mockResolvedValueOnce(null);

      try {
        await controller.getBalance(addressParamDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No transactions found for this address');
      }
    });
  });
});
