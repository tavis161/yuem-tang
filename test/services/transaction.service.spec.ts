import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../../src/services/transaction.service';
import { Repository } from 'typeorm';
import { Transaction } from '../../src/entities/transaction.entity';
import { User } from '../../src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionRequestDto } from '../../src/dtos/transaction-request.dto';

describe('TransactionService', () => {
    let service: TransactionService;
    let transactionRepository: Repository<Transaction>;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<TransactionService>(TransactionService);
        transactionRepository = module.get(getRepositoryToken(Transaction));
        userRepository = module.get(getRepositoryToken(User));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createBorrowTransaction and createRepayTransaction', () => {
        it.each([
            { method: 'createBorrowTransaction', type: 'borrow' },
            { method: 'createRepayTransaction', type: 'repay' }
        ])('should create and return a $type transaction', async ({ method, type }) => {
            const dto: TransactionRequestDto = { lenderId: 1, borrowerId: 2, amount: 100, type: type };
            const user: User = { id: 1, username: 'A', password: '1234', lentTransactions: [], borrowedTransactions: [] };
            const transaction: Transaction = {
                id: 1,
                lender: user,
                borrower: user,
                amount: dto.amount,
                type,
                date: new Date(),
            };

            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
            jest.spyOn(transactionRepository, 'create').mockReturnValue(transaction);
            jest.spyOn(transactionRepository, 'save').mockResolvedValue(transaction);

            const result = await service[method](dto);
            expect(result).toEqual(expect.any(Object));
            expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: dto.lenderId });
            expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: dto.borrowerId });
            expect(transactionRepository.create).toHaveBeenCalledWith(expect.any(Object));
            expect(transactionRepository.save).toHaveBeenCalledWith(transaction);
        });

        it('should throw an error if lender or borrower is not found', async () => {
            const dto: TransactionRequestDto = { lenderId: 1, borrowerId: 2, amount: 100, type: 'borrow' };
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

            await expect(service.createBorrowTransaction(dto)).rejects.toThrow('Lender or Borrower not found');
            expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: dto.lenderId });
            expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: dto.borrowerId });
        });

        it('should handle database errors during transaction creation', async () => {
            const dto: TransactionRequestDto = { lenderId: 1, borrowerId: 2, amount: 100, type: 'borrow' };
            const user: User = { id: 1, username: 'A', password: '1234', lentTransactions: [], borrowedTransactions: [] };
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
            jest.spyOn(transactionRepository, 'create').mockReturnValue(new Transaction());
            jest.spyOn(transactionRepository, 'save').mockRejectedValue(new Error('Database failure'));

            await expect(service.createBorrowTransaction(dto)).rejects.toThrow('Database failure');
        });
    });

  describe('getTotalAmount', () => {
    it('should calculate total amount correctly', async () => {
        jest.spyOn(transactionRepository, 'find').mockResolvedValue([
            { id: 1, lender: new User(), borrower: new User(), amount: 100, type: 'borrow', date: new Date()},
            { id: 2, lender: new User(), borrower: new User(), amount: 150, type: 'repay', date: new Date()},
        ]);

        const total = await service.getTotalAmount(1);
        expect(total).toEqual(50);
        expect(transactionRepository.find).toHaveBeenCalled();
    });

    it('should handle database errors when fetching transactions', async () => {
        jest.spyOn(transactionRepository, 'find').mockRejectedValue(new Error('Database error'));
        await expect(service.getTotalAmount(1)).rejects.toThrow('Database error');
      });
  
      it('should return 0 if no transactions are found', async () => {
        jest.spyOn(transactionRepository, 'find').mockResolvedValue([]);
        const total = await service.getTotalAmount(1);
        expect(total).toEqual(0);
      });
  });

  describe('getTransactionsForUser', () => {
    it('should return a list of transactions for a user', async () => {
      const transactions: Transaction[] = [{
        id:1,
        lender: { id: 1, username: 'A', password: '1234', lentTransactions: [], borrowedTransactions: []  },
        borrower: { id: 2, username: 'B', password: '1234', lentTransactions: [], borrowedTransactions: []  },
        amount: 100,
        type: 'borrow',
        date: new Date(),
      }];

      jest.spyOn(transactionRepository, 'find').mockResolvedValue(transactions);
      const result = await service.getTransactionsForUser(1);
      expect(result).toEqual(expect.any(Array));
      expect(result).toHaveLength(1);
      expect(transactionRepository.find).toHaveBeenCalled();
    });

    it('should handle database errors during fetching', async () => {
        jest.spyOn(transactionRepository, 'find').mockRejectedValue(new Error('Database failure'));
        await expect(service.getTransactionsForUser(1)).rejects.toThrow('Database failure');
      });
    });
    describe('getTransactionsBetweenUsers', () => {
        it('should return transactions between two users', async () => {
          const transactions: Transaction[] = [{
            id:2,
            lender: { id: 1, username: 'A', password: '1234', lentTransactions: [], borrowedTransactions: []  },
            borrower: { id: 2, username: 'B', password: '1234', lentTransactions: [], borrowedTransactions: []  },
            amount: 50,
            type: 'repay',
            date: new Date(),
          }];
    
          jest.spyOn(transactionRepository, 'find').mockResolvedValue(transactions);
          const result = await service.getTransactionsBetweenUsers(1, 2);
          expect(result).toEqual(expect.any(Array));
          expect(result).toHaveLength(1);
          expect(transactionRepository.find).toHaveBeenCalled();
        });
      });
    
      describe('getTransactionsBetweenUsers error handling', () => {
        it('should handle errors when fetching transactions between users', async () => {
            jest.spyOn(transactionRepository, 'find').mockRejectedValue(new Error('Database failure'));
          await expect(service.getTransactionsBetweenUsers(1, 2)).rejects.toThrow('Database failure');
        });
      });
});
