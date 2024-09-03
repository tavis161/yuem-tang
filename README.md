
# Yuem Tang API Documentation

Yuem Tang is a NestJS application designed to manage personal loans between users. It includes functionalities such as user registration, authentication, and tracking borrow and repay transactions.

## Table of Contents
1. [Setup](#setup)
2. [Configuration](#configuration)
3. [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Users](#users)
    - [Transactions](#transactions)
4. [Using the API](#using-the-api)
5. [Development](#development)

## Setup

To set up the Yuem Tang API locally, follow these steps:

1. **Configure the database:**
   - Ensure PostgreSQL is installed and running.
   - Create a database named `yuem_tang_db`.

2. **Environment Configuration:**
   - Copy the `.env.example` file to `.env`.
   - Fill in the database connection details and JWT secret in the `.env` file.

3. **Run the application:**
   ```bash
   npm run start
   ```

## Configuration

The application requires configuration through environment variables as described in the `.env` file. Here are the key variables:

- `DATABASE_HOST` - The hostname of your PostgreSQL server.
- `DATABASE_PORT` - The port your PostgreSQL server is running on.
- `DATABASE_USER` - Your database user.
- `DATABASE_PASSWORD` - Your database password.
- `DATABASE_NAME` - The name of your database.
- `JWT_SECRET` - A secret key for JWT token signing.

## API Endpoints

### Authentication

- **POST `/auth/login`** (Logs in a user)
  - **Headers**:
    - `Content-Type: application/json`
  - **Body**:
    ```json
    {
      "username": "testuser",
      "password": "password123"
    }
    ```
  - **Response**:
    - `200 OK` with JWT token if successful.
    - `401 Unauthorized` if credentials are incorrect.

### Users

- **POST `/users`** (Creates a new user)
  - **Headers**:
    - `Content-Type: application/json`
  - **Body**:
    ```json
    {
      "username": "newuser",
      "password": "newpassword"
    }
    ```
  - **Response**:
    - `201 Created` with user details if successful.
    - `400 Bad Request` if the request is malformed.

- **GET `/users/{id}`** (Retrieves user details)
  - **Headers**:
    - `Authorization: Bearer <JWT_TOKEN>`
  - **Response**:
    - `200 OK` with user details if successful.
    - `404 Not Found` if the user does not exist.

### Transactions

- **POST `/transactions/borrow`** (Records a borrowing transaction)
  - **Headers**:
    - `Content-Type: application/json`
    - `Authorization: Bearer <JWT_TOKEN>`
  - **Body**:
    ```json
    {
      "lenderId": 1,
      "borrowerId": 2,
      "amount": 300.00
    }
    ```
  - **Response**:
    - `201 Created` if the transaction is successful.
    - `400 Bad Request` if the input is invalid.

- **POST `/transactions/repay`** (Records a repayment transaction)
  - **Headers**:
    - `Content-Type: application/json`
    - `Authorization: Bearer <JWT_TOKEN>`
  - **Body**:
    ```json
    {
      "lenderId": 1,
      "borrowerId": 2,
      "amount": 150.00
    }
    ```
  - **Response**:
    - `201 Created` if the transaction is successful.
    - `400 Bad Request` if the input is invalid.

## Using the API

To use the API effectively, follow this workflow:

1. **Register a User** using the POST `/users` endpoint.
2. **Login** using the POST `/auth/login` endpoint to receive a JWT token.
3. **Access Protected Routes** like user details or transactions using the JWT token received from login.