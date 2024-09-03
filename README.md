
# NestJS Loan Application

This project is a REST API for managing loan transactions between individuals, implemented using NestJS. The application allows users to borrow and repay money, view debt summaries, and view transaction histories. It includes JWT-based authentication and is set up to run inside a Docker container with a PostgreSQL database.

## Prerequisites

- Node.js v18 or later
- npm (Node Package Manager)
- Docker and Docker Compose
- PostgreSQL

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/nestjs-loan-app.git
   cd nestjs-loan-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory of the project based on the `.env.example` file. Replace the placeholders with your own values.

```plaintext
JWT_SECRET=your_jwt_secret
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=database
```

- `JWT_SECRET`: A random string for JWT authentication.
- `DATABASE_*`: Credentials for connecting to the PostgreSQL database.

## Running the Application

### Without Docker

1. Start the PostgreSQL database and create the required tables.
2. Run the application:

   ```bash
   npm run start:dev
   ```

3. The application will be available at `http://localhost:3000`.

### With Docker

1. Build and run the application using Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. The application will be available at `http://localhost:3000`.

## API Documentation

### Authentication

#### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**:

  ```json
  {
    "username": "user1",
    "password": "password123"
  }
  ```

- **Response**:

  - **Status**: `200 OK`
  - **Body**:

    ```json
    {
      "access_token": "your_jwt_token"
    }
    ```

### Users

#### Create User

- **URL**: `/users`
- **Method**: `POST`
- **Description**: Creates a new user.
- **Request Body**:

  ```json
  {
    "username": "user1",
    "password": "password123"
  }
  ```

- **Response**:

  - **Status**: `201 Created`
  - **Body**:

    ```json
    {
      "id": 1,
      "username": "user1"
    }
    ```

#### Get User

- **URL**: `/users/:id`
- **Method**: `GET`
- **Description**: Retrieves a user by ID.
- **Response**:

  - **Status**: `200 OK`
  - **Body**:

    ```json
    {
      "id": 1,
      "username": "user1"
    }
    ```

### Transactions

#### Borrow Money

- **URL**: `/transactions/borrow`
- **Method**: `POST`
- **Description**: Borrow money from another user.
- **Request Header**:

  ```json
    Content-Type:application/json
    Authorization:Bearer <TOKEN>
  ```

- **Request Body**:

  ```json
  {
    "lenderId": 2,
    "borrowerId": 1,
    "amount": 300
  }
  ```

- **Response**:

  - **Status**: `201 Created`
  - **Body**:

    ```json
    {
      "id": 1,
      "lenderId": 2,
      "borrowerId": 1,
      "amount": 300,
      "type": "borrow",
      "date": "2024-08-28T12:34:56.789Z"
    }
    ```

#### Repay Money

- **URL**: `/transactions/repay`
- **Method**: `POST`
- **Description**: Repay money to another user.
- **Request Header**:

  ```json
    Content-Type:application/json
    Authorization:Bearer <TOKEN>
  ```

- **Request Body**:

  ```json
  {
    "lenderId": 2,
    "borrowerId": 1,
    "amount": 100
  }
  ```

- **Response**:

  - **Status**: `201 Created`
  - **Body**:

    ```json
    {
      "id": 2,
      "lenderId": 2,
      "borrowerId": 1,
      "amount": 100,
      "type": "repay",
      "date": "2024-08-28T12:35:56.789Z"
    }
    ```

#### Get Transaction History

- **URL**: `/transactions/:userId`
- **Method**: `GET`
- **Description**: Get transaction history for a specific user.
- **Request Header**:

  ```json
    Content-Type:application/json
    Authorization:Bearer <TOKEN>
  ```

- **Response**:

  - **Status**: `200 OK`
  - **Body**:

    ```json
    [
      {
        "id": 1,
        "lenderId": 2,
        "borrowerId": 1,
        "amount": 300,
        "type": "borrow",
        "date": "2024-08-28T12:34:56.789Z"
      },
      {
        "id": 2,
        "lenderId": 2,
        "borrowerId": 1,
        "amount": 100,
        "type": "repay",
        "date": "2024-08-28T12:35:56.789Z"
      }
    ]
    ```

#### Get Debt Summary

- **URL**: `/transactions/summary/:userId`
- **Method**: `GET`
- **Description**: Get a debt summary for a specific user.
- **Request Header**:

  ```json
    Content-Type:application/json
    Authorization:Bearer <TOKEN>
  ```
  
- **Response**:

  - **Status**: `200 OK`
  - **Body**:

    ```json
    {
      "userId": 1,
      "totalBorrowed": 300,
      "totalRepaid": 100,
      "currentDebt": 200
    }
    ```

## Testing

To run the unit tests for the application, use the following command:

```bash
npm run test
```

## Docker Usage

### Building and Running the Docker Containers

1. Build and run the Docker containers:

   ```bash
   docker-compose up --build
   ```

2. The NestJS application will be running on `http://localhost:3000` and the PostgreSQL database will be exposed on port `5432`.

### Stopping the Containers

To stop the Docker containers, use:

```bash
docker-compose down
```

### Rebuilding the Containers

If you make changes to the code and need to rebuild the containers, use:

```bash
docker-compose up --build
```