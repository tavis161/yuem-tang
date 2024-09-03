// transaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { UserService } from './user.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private userService: UserService
  ) {}

  async createBorrowTransaction(lenderId: number, borrowerId: number, amount: number): Promise<Transaction> {
    const lender = await this.userService.findOne(lenderId);
    const borrower = await this.userService.findOne(borrowerId);
    const transaction = this.transactionRepository.create({
      lender,
      borrower,
      amount,
      type: 'borrow',
    });
    return this.transactionRepository.save(transaction);
  }

  async createRepayTransaction(lenderId: number, borrowerId: number, amount: number): Promise<Transaction> {
    const lender = await this.userService.findOne(lenderId);
    const borrower = await this.userService.findOne(borrowerId);
    const transaction = this.transactionRepository.create({
      lender,
      borrower,
      amount,
      type: 'repay',
    });
    return this.transactionRepository.save(transaction);
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: [{ lender: { id: userId } }, { borrower: { id: userId } }],
      relations: ['lender', 'borrower'],
    });
  }
}
