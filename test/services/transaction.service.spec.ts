// transaction.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../../src/services/transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../../src/entities/transaction.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../src/services/user.service';
import { User } from '../../src/entities/user.entity';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        UserService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    userService = module.get<UserService>(UserService);
  });

  it('should create a borrow transaction', async () => {
    const lender = new User();
    lender.id = 1;
    lender.username = 'lender';
    const borrower = new User();
    borrower.id = 2;
    borrower.username = 'borrower';

    jest.spyOn(userService, 'findOne').mockResolvedValueOnce(lender);
    jest.spyOn(userService, 'findOne').mockResolvedValueOnce(borrower);

    const transaction = new Transaction();
    transaction.id = 1;
    transaction.lender = lender;
    transaction.borrower = borrower;
    transaction.amount = 100;
    transaction.type = 'borrow';

    jest.spyOn(repository, 'save').mockResolvedValue(transaction);

    const result = await service.createBorrowTransaction(1, 2, 100);
    expect(result).toEqual(transaction);
  });
});
