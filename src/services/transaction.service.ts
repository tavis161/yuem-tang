import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { UserService } from './user.service';
import { CreateTransactionDto } from '../dtos/create-transaction.dto'
import { TransactionDto } from '../dtos/transaction.dto'
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private userService: UserService
  ) { }

  async createBorrowTransaction(lenderId: number, borrowerId: number, amount: number): Promise<TransactionDto> {
    const lender = await this.userService.findOne(lenderId);
    const borrower = await this.userService.findOne(borrowerId);
    const transaction = this.transactionRepository.create({
      lender,
      borrower,
      amount,
      type: 'borrow',
    });
    const transactionSaveResult = await this.transactionRepository.save(transaction);
    if (!transactionSaveResult) {
      throw new HttpException("Cannot save data", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const response: TransactionDto = {
      lender: transactionSaveResult.lender.username,
      borrower: transactionSaveResult.borrower.username,
      type: transactionSaveResult.type,
      amount: transactionSaveResult.amount,
      date: transactionSaveResult.date
    }

    return response;
  }

  async createRepayTransaction(lenderId: number, borrowerId: number, amount: number): Promise<TransactionDto> {
    const lender = await this.userService.findOne(lenderId);
    const borrower = await this.userService.findOne(borrowerId);
    const transaction = this.transactionRepository.create({
      lender,
      borrower,
      amount,
      type: 'repay',
    });
    const transactionSaveResult = await this.transactionRepository.save(transaction);
    if (!transactionSaveResult) {
      throw new HttpException("Cannot save data", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const response: TransactionDto = {
      lender: transactionSaveResult.lender.username,
      borrower: transactionSaveResult.borrower.username,
      type: transactionSaveResult.type,
      amount: transactionSaveResult.amount,
      date: transactionSaveResult.date
    }

    return response;
  }

  async getTotalAmount(userId: number): Promise<CreateTransactionDto> {
    let totalBorrow = 0;
    let totalRepay = 0;

    const borrowList = await this.transactionRepository.find({
      where: { lender: { id: userId }, type: 'borrow' },
    })
    borrowList.forEach(borrow => {
      totalBorrow += borrow.amount;
    });

    const repayList = await this.transactionRepository.find({
      where: { lender: { id: userId }, type: "repay" },
    })
    repayList.forEach(repay => {
      totalRepay += repay.amount;
    });

    const totalAmount = totalRepay - totalBorrow;

    return { userId: userId, amount: totalAmount };
  }

  async getTransactionsForUser(userId: number): Promise<TransactionDto[]> {
    const transactionList = await this.transactionRepository.find({
      where: [{ lender: { id: userId } }, { borrower: { id: userId } }],
      relations: ['lender', 'borrower'],
    });
    let result: TransactionDto[] = [];
    transactionList.forEach(txn => {
      result.push({
        lender: txn.lender.username,
        borrower: txn.borrower.username,
        type: txn.type,
        amount: txn.amount,
        date: txn.date
      })
    })
    return result;
  }

  async getTransactionsBetweenUsers(userAId: number, userBId: number): Promise<TransactionDto[]> {
    const transactionList = await this.transactionRepository.find({
      where: [
        { lender: { id: userAId }, borrower: { id: userBId } },
        { lender: { id: userBId }, borrower: { id: userAId } },
      ],
      relations: ['lender', 'borrower'],
    });
    let result: TransactionDto[] = [];
    transactionList.forEach(txn => {
      result.push({
        lender: txn.lender.username,
        borrower: txn.borrower.username,
        type: txn.type,
        amount: txn.amount,
        date: txn.date
      })
    })
    return result;
  }
}
