import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DaiController } from './dai.controller';
import { DaiService } from './dai.service';
import { DaiTransaction } from './entities/dai-transaction.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { AddressParamDto } from './dto/address-param.dto';
import { DataSource } from 'typeorm';
import { TransactionType } from './enum/transaction-type.enum';

describe('DaiController', () => {
  let daiController: DaiController;
  let daiService: DaiService;

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [DaiController],
      providers: [
        DaiService,
        { provide: DataSource, useValue: mockRepository },
        {
          provide: getRepositoryToken(DaiTransaction),
          useValue: mockRepository,
        },
      ],
    }).compile();

    daiController = moduleRef.get<DaiController>(DaiController);
    daiService = moduleRef.get<DaiService>(DaiService);
  });

  describe('getTransactions', () => {
    it('should return an array of DaiTransactions', async () => {
      const transactions = [new DaiTransaction(), new DaiTransaction()];
      jest.spyOn(daiService, 'getTransactions').mockResolvedValue(transactions);

      const result = await daiController.getTransactions(
        new PaginationQueryDto(),
      );

      expect(result).toEqual(transactions);
    });
  });

  describe('getTransactionsByAddress', () => {
    const walletAddress = '0x123';
    const paginationQueryDto = new PaginationQueryDto();

    it('should return transactions for wallet address', async () => {
      const transactions = [new DaiTransaction(), new DaiTransaction()];
      jest
        .spyOn(daiService, 'getTransactionsByAddress')
        .mockResolvedValue(transactions);

      const result = await daiController.getTransactionsByAddress(
        new AddressParamDto(walletAddress),
        TransactionType.RECIPIENT,
        paginationQueryDto,
      );

      expect(result).toEqual(transactions);
    });
  });

  describe('getBalance', () => {
    const walletAddress = '0x123';
    const balance = 123.45;

    it('should return the balance of the wallet address', async () => {
      jest.spyOn(daiService, 'getBalance').mockResolvedValue(balance);

      const result = await daiController.getBalance(
        new AddressParamDto(walletAddress),
      );

      expect(result).toBe(balance);
    });
  });
});
