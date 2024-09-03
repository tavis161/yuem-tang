CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create the transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    lenderId INTEGER,
    borrowerId INTEGER,
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('borrow', 'repay')) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lender
        FOREIGN KEY(lenderId) 
        REFERENCES users(id),
    CONSTRAINT fk_borrower
        FOREIGN KEY(borrowerId) 
        REFERENCES users(id)
);
