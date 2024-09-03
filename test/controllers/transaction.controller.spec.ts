import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../src/controllers/transaction.controller';
import { TransactionService } from '../../src/services/transaction.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionRequestDto } from '../../src/dtos/transaction-request.dto';
import { Repository } from 'typeorm';
import { Transaction } from '../../src/entities/transaction.entity';
import { User } from '../../src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;
  let transactionRepository: Repository<Transaction>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [ 
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        },
      ],
    }).compile();

    transactionController = module.get<TransactionController>(TransactionController);
    transactionService = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get(getRepositoryToken(Transaction));
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('borrowMoney', () => {
    it('should call the service to create a borrow transaction', async () => {
      const dto: TransactionRequestDto = { lenderId: 1, borrowerId: 2, amount: 100, type: 'borrow' };
      const transactionDto = { lenderUsername: 'John', borrowerUsername: 'Doe', amount: 100, type: 'borrow', date: new Date() };
  
      jest.spyOn(transactionService, 'createTransaction').mockResolvedValue(transactionDto);
  
      const result = await transactionController.borrowMoney(dto);
  
      expect(transactionService.createTransaction).toHaveBeenCalledWith(dto, 'borrow');
      expect(result).toEqual(transactionDto);
    });
  });
  
  describe('totalAmount', () => {
    it('should return the total amount for a user', async () => {
      jest.spyOn(transactionService, 'getTotalAmount').mockResolvedValue(100);
  
      const result = await transactionController.totalAmount(1);
  
      expect(transactionService.getTotalAmount).toHaveBeenCalledWith(1);
      expect(result).toEqual({ total: 100 });
    });
  });

  describe('getTransactions', () => {
    it('should return transactions for a user when userId is provided', async () => {
      const transactionDto = [{ lenderUsername: 'A', borrowerUsername: 'B', amount: 100, type: 'borrow', date: new Date() }];
      jest.spyOn(transactionService, 'getTransactionsForUser').mockResolvedValue(transactionDto);
  
      const result = await transactionController.getTransactions({ userId: 1 });
  
      expect(transactionService.getTransactionsForUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(transactionDto);
    });
  
    it('should return transactions between two users when userAId and userBId are provided', async () => {
      const transactionDto = [{ lenderUsername: 'A', borrowerUsername: 'B', amount: 100, type: 'borrow', date: new Date() }];
      jest.spyOn(transactionService, 'getTransactionsBetweenUsers').mockResolvedValue(transactionDto);

      const result = await transactionController.getTransactions({ userAId: 1, userBId: 2 });

  
      expect(transactionService.getTransactionsBetweenUsers).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual(transactionDto);
    });
  
    it('should throw an error when neither userId nor userAId/userBId are provided', async () => {
      await expect(transactionController.getTransactions({})).rejects.toThrow(
        new HttpException("Invalid query parameters. Please specify either 'userId' or both 'userAId' and 'userBId'.", HttpStatus.BAD_REQUEST)
      );
    });
  });
});
