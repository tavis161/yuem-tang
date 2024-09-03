import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from '../services/transaction.service';
import { TransactionController } from '../controllers/transaction.controller';
import { Transaction } from '../entities/transaction.entity';
import { UserModule } from './user.module';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User]), UserModule],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
