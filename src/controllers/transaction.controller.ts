// transaction.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../entities/transaction.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('borrow')
  async borrowMoney(
    @Body('lenderId') lenderId: number,
    @Body('borrowerId') borrowerId: number,
    @Body('amount') amount: number
  ): Promise<Transaction> {
    return this.transactionService.createBorrowTransaction(lenderId, borrowerId, amount);
  }

  @Post('repay')
  async repayMoney(
    @Body('lenderId') lenderId: number,
    @Body('borrowerId') borrowerId: number,
    @Body('amount') amount: number
  ): Promise<Transaction> {
    return this.transactionService.createRepayTransaction(lenderId, borrowerId, amount);
  }

  @Get(':userId')
  async getUserTransactions(@Param('userId') userId: number): Promise<Transaction[]> {
    return this.transactionService.getUserTransactions(userId);
  }
}
