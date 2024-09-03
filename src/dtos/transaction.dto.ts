export class TransactionDto {
  lender: string;

  borrower: string;

  amount: number;

  type: 'borrow' | 'repay';

  date: Date;
}