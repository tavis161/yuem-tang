import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../utils/transformer.util'
import { User } from './user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.lentTransactions)
  @JoinColumn({ name: 'lenderId' })
  lender: User;

  @ManyToOne(() => User, user => user.borrowedTransactions)
  @JoinColumn({ name: 'borrowerId' })
  borrower: User;

  @Column('decimal', { precision: 10, scale: 2 , transformer: new ColumnNumericTransformer()})
  amount: number;

  @Column({ type: 'varchar', length: 10 })
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}