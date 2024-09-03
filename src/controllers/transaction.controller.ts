import { Controller, Post, Body, Get, Query, UseGuards, HttpException, HttpStatus, Param } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../entities/transaction.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from '../dtos/create-transaction.dto'
import { TransactionDto }from '../dtos/transaction.dto'

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('borrow')
  async borrowMoney(
    @Body('lenderId') lenderId: number,
    @Body('borrowerId') borrowerId: number,
    @Body('amount') amount: number
  ): Promise<TransactionDto> {
    return this.transactionService.createBorrowTransaction(lenderId, borrowerId, amount);
  }

  @Post('repay')
  async repayMoney(
    @Body('lenderId') lenderId: number,
    @Body('borrowerId') borrowerId: number,
    @Body('amount') amount: number
  ): Promise<TransactionDto> {
    return this.transactionService.createRepayTransaction(lenderId, borrowerId, amount);
  }

  @Get('total/:userId')
  async totalAmount(@Param('userId') userId): Promise<CreateTransactionDto>{
    return this.transactionService.getTotalAmount(userId);
  }

  @Get()
  getTransactions(@Query('userId') userId: number, @Query('userAId') userAId: number, @Query('userBId') userBId: number): Promise<TransactionDto[]> {
    if (userId) {
      return this.transactionService.getTransactionsForUser(userId);
    } else if (userAId && userBId) {
      return this.transactionService.getTransactionsBetweenUsers(userAId, userBId);
    } else {
      throw new HttpException("Invalid query!", HttpStatus.BAD_REQUEST);
    }
  }
}
