// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany(() => Transaction, (transaction) => transaction.lender)
  lentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.borrower)
  borrowedTransactions: Transaction[];
}
