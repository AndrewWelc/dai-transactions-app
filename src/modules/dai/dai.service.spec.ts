import { PaginationQueryDto } from './dto/pagination-query.dto';
import { DaiController } from './dai.controller';
import { DaiService } from './dai.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TransactionType } from './enum/transaction-type.enum';
import { DaiTransaction } from './dai-transaction.entity';
import { Repository } from 'typeorm';

describe('DaiService', () => {
  let daiService: DaiService;
  let daiController: DaiController;
  let repo: Repository<DaiTransaction>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DaiService,
        {
          provide: getRepositoryToken(DaiTransaction),
          useClass: Repository,
        },
      ],
      controllers: [DaiController],
    }).compile();

    daiService = moduleRef.get<DaiService>(DaiService);
    daiController = moduleRef.get<DaiController>(DaiController);
    repo = moduleRef.get<Repository<DaiTransaction>>(
      getRepositoryToken(DaiTransaction),
    );
  });

  describe('getTransactions', () => {
    it('should return an array of transactions', async () => {
      const paginationQueryDto = new PaginationQueryDto();
      jest.spyOn(daiService, 'getTransactions').mockResolvedValueOnce([]);
      const result = await daiController.getTransactions(paginationQueryDto);
      expect(result).toEqual([]);
    });
  });

  describe('getTransactionsByAddress', () => {
    it('should return an array of transactions for the specified wallet address', async () => {
      const addressParamDto = { walletAddress: '0x123' };
      const paginationQueryDto = new PaginationQueryDto();
      const transactionType = TransactionType.SENDER;
      jest
        .spyOn(daiService, 'getTransactionsByAddress')
        .mockResolvedValueOnce([]);
      const result = await daiController.getTransactionsByAddress(
        addressParamDto,
        transactionType,
        paginationQueryDto,
      );
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when address does not exist', async () => {
      const addressParamDto = { walletAddress: '0x456' };
      const paginationQueryDto = new PaginationQueryDto();
      const transactionType = TransactionType.SENDER;
      jest
        .spyOn(daiService, 'getTransactionsByAddress')
        .mockResolvedValueOnce(null);
      expect(async () => {
        await daiController.getTransactionsByAddress(
          addressParamDto,
          transactionType,
          paginationQueryDto,
        );
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('getBalance', () => {
    it('should return the balance for the specified wallet address', async () => {
      const addressParamDto = { walletAddress: '0x123' };
      jest.spyOn(daiService, 'getBalance').mockResolvedValueOnce(100);
      const result = await daiController.getBalance(addressParamDto);
      expect(result).toEqual(100);
    });

    it('should throw NotFoundException when address does not exist', async () => {
      const addressParamDto = { walletAddress: '0x456' };
      jest.spyOn(daiService, 'getBalance').mockResolvedValueOnce(null);
      expect(async () => {
        await daiController.getBalance(addressParamDto);
      }).rejects.toThrow(NotFoundException);
    });
  });
});
