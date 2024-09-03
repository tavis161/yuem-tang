
# Yuem Tang

Yuem Tang is a NestJS application for managing personal loans between users, allowing them to record borrow and repay transactions. The application also includes authentication using JWT.

## Table of Contents

1. [Running the Application](#running-the-application)
2. [Environment Variables](#environment-variables)
3. [API Endpoints](#api-endpoints)
4. [Running Tests](#running-tests)
5. [Using Docker](#using-docker)

## Running the Application

1. Start PostgreSQL and create a database.

2. Run the application:

   ```bash
   npm run start:dev
   ```

   The application will be running at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name
JWT_SECRET=your_jwt_secret
```

Replace the placeholders with your actual database credentials and a secure JWT secret.

## API Endpoints

### Authentication

- **POST** `/auth/login`: Login and receive a JWT token.
  ```json
  Request Body:
  {
    "username": "string",
    "password": "string"
  }
  ```

### Users

- **POST** `/users`: Create a new user.
  ```json
  Request Body:
  {
    "username": "string",
    "password": "string"
  }
  ```

- **GET** `/users/:id`: Get user details by ID.

### Transactions

- **POST** `/transactions/borrow`: Record a borrowing transaction.
  ```json
  Request Body:
  {
    "lenderId": "number",
    "borrowerId": "number",
    "amount": "number"
  }
  ```

- **POST** `/transactions/repay`: Record a repayment transaction.
  ```json
  Request Body:
  {
    "lenderId": "number",
    "borrowerId": "number",
    "amount": "number"
  }
  ```

- **GET** `/transactions/user/:id`: Get all transactions for a specific user.

- **GET** `/transactions/between/:userId1/:userId2`: Get transactions between two users.

## Running Tests

To run the unit tests:

```bash
npm run test
```

## Using Docker

1. Build and run the Docker containers:

   ```bash
   docker-compose up --build
   ```

2. The application will be available at `http://localhost:3000`.