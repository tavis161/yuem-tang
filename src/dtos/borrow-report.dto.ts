export class BorrowStatus {
    username: string;
    status: string;
    amount: number;
}

export class BorrowReport {
    username: string;
    status: BorrowStatus
}

