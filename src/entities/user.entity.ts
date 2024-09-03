import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Transaction, (transaction) => transaction.lender)
  lentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.borrower)
  borrowedTransactions: Transaction[];
}
