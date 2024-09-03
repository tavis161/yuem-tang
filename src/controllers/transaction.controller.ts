import { Controller, Post, Body, Get, Param, UseGuards, HttpException, HttpStatus, Query } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionRequestDto } from '../dtos/transaction-request.dto';
import { TransactionDto } from '../dtos/transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('borrow')
  async borrowMoney(@Body() transactionRequestDto: TransactionRequestDto): Promise<TransactionDto> {
    return this.transactionService.createTransaction(transactionRequestDto, 'borrow');
  }

  @Post('repay')
  async repayMoney(@Body() transactionRequestDto: TransactionRequestDto): Promise<TransactionDto> {
    return this.transactionService.createTransaction(transactionRequestDto, 'repay');
  }

  @Get('total/:userId')
  async totalAmount(@Param('userId') userId: number): Promise<{ total: number }> {
    const total = await this.transactionService.getTotalAmount(userId);
    return { total };
  }

  @Get()
  async getTransactions(@Query() query: { userId?: number, userAId?: number, userBId?: number }): Promise<TransactionDto[]> {
    if (query.userId) {
      return this.transactionService.getTransactionsForUser(query.userId);
    } else if (query.userAId && query.userBId) {
      return this.transactionService.getTransactionsBetweenUsers(query.userAId, query.userBId);
    }
    throw new HttpException("Invalid query parameters. Please specify either 'userId' or both 'userAId' and 'userBId'.", HttpStatus.BAD_REQUEST);
  }
}
