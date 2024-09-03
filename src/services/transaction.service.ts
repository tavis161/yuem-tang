import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionRequestDto } from '../dtos/transaction-request.dto';
import { TransactionDto } from '../dtos/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async createTransaction(dto: TransactionRequestDto, type: 'borrow' | 'repay'): Promise<TransactionDto> {
    const transaction = this.transactionRepository.create({
      lender: { id: dto.lenderId },
      borrower: { id: dto.borrowerId },
      amount: dto.amount,
      type: type,
    });
    const savedTransaction = await this.transactionRepository.save(transaction);
    return this.toTransactionDto(savedTransaction);
  }

  private toTransactionDto(transaction: Transaction): TransactionDto {
    return {
      lenderUsername: transaction.lender.username,
      borrowerUsername: transaction.borrower.username,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
    };
  }

  async createBorrowTransaction(dto: TransactionRequestDto): Promise<TransactionDto> {
    const lender = await this.userRepository.findOneBy({ id: dto.lenderId });
    const borrower = await this.userRepository.findOneBy({ id: dto.borrowerId });

    if (!lender || !borrower) {
      throw new Error('Lender or Borrower not found');
    }

    const transaction = this.transactionRepository.create({
      lender: lender,
      borrower: borrower,
      amount: dto.amount,
      type: 'borrow',
    });

    const savedTransaction = await this.transactionRepository.save(transaction);
    return this.toTransactionDto(savedTransaction);
  }

  async createRepayTransaction(dto: TransactionRequestDto): Promise<TransactionDto> {
    const lender = await this.userRepository.findOneBy({ id: dto.lenderId });
    const borrower = await this.userRepository.findOneBy({ id: dto.borrowerId });

    if (!lender || !borrower) {
      throw new Error('Lender or Borrower not found');
    }

    const transaction = this.transactionRepository.create({
      lender: lender,
      borrower: borrower,
      amount: dto.amount,
      type: 'repay',
    });

    const savedTransaction = await this.transactionRepository.save(transaction);
    return this.toTransactionDto(savedTransaction);
  }

  async getTotalAmount(userId: number): Promise<number> {
    const userTransactions = await this.transactionRepository.find({
      where: [
        { borrower: { id: userId }, type: 'repay' },
        { borrower: { id: userId }, type: 'borrow' }
      ],
      relations: ['lender', 'borrower']
    });

    //TODO:
    //Need to find other user Id to get amount and calculate borrow money
    // const otherUserTransactions = await this.transactionRepository.find({
    //   where: [
    //     { borrower: { id: userId }, type: 'repay' },
    //     { borrower: { id: userId }, type: 'borrow' }
    //   ],
    //   relations: ['lender', 'borrower']
    // });


    let total = 0;
    userTransactions.forEach(txn => {
      const amountChange = txn.type === 'borrow' ? -txn.amount : txn.amount;
      total += amountChange;
    });

    // let otherUserTotal = 0;
    // otherUserTransactions.forEach(txn => {
    //   const amountChange = txn.type === 'borrow' ? -txn.amount : txn.amount;
    //   otherUserTotal += amountChange;
    // });

    // if(userTotal < otherUserTotal) {
    //   return userTotal + otherUserTotal;
    // } 

    return total;
  }

  async getTransactionsForUser(userId: number): Promise<TransactionDto[]> {
    const transactions = await this.transactionRepository.find({
      where: [{ lender: { id: userId } }, { borrower: { id: userId } }],
      relations: ['lender', 'borrower']
    });

    return transactions.map(txn => this.toTransactionDto(txn));
  }

  async getTransactionsBetweenUsers(userAId: number, userBId: number): Promise<TransactionDto[]> {
    const transactions = await this.transactionRepository.find({
      where: [
        { lender: { id: userAId } },
        { borrower: { id: userAId } },
        { lender: { id: userBId } },
        { borrower: { id: userBId } }
      ],
      relations: ['lender', 'borrower']
    });

    return transactions.map(txn => this.toTransactionDto(txn));
  }
}
