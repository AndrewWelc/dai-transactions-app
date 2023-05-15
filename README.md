# Senior Backend Coding Challenge
## Description

This project includes the full coding challenge with the basic and practical coding task (DAI Transaction API).


## Repository includes

- DAI Transaction APP with all the required details to run it locally
- SQL queries as a bonus


# DAI Transaction API 
This is an application/API that interacts with the DAI smart contract and stores the latest DAI transactions into a database on a continuous basis. The application also exposes a REST API that provides access to data from the database, including the last DAI transactions, transactions by sender or recipient, and the DAI balance of a given address.

## Tech Stack
- NestJS
- PostgreSQL
- TypeORM
- Jest
- Winston for logging
  
All written in TypeScript.

## Environment Variables

See the `.example.env` file to get the idea what the example environment variables are.

**Important note: `INFURA_API_KEY` in `.env.example` is a free-tier [Infura](https://www.infura.io/) API KEY, but for the sake of this App, requests limits are more than enough.**

## Logging

The application logs all requests to the console. Additionally, the application logs errors to the console and to a log file in the logs directory.

## Installation

```bash
$ yarn install
```

## Running the app

1. Start docker container with postgres:
   ```bash
   $ docker-compose up -d
   ```
2. Run migrations:
   ```bash
   $ yarn migration:run
   ```
3. Run the application:
    ```bash
    # development
    $ yarn run start

    # watch mode
    $ yarn run start:dev

    # production mode
    $ yarn run start:prod
    ```

## Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## API Reference
#### Get DAI transactions

```http
  GET /dai/transactions
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `x-api-key` | `header` | **Required**. API Key to authorize the API |
| `limit` | `number (query)` | Number of transaction per page |
| `page` | `number (query)` | Page number |

#### Get transactions by wallet address for recipient or sender

```http
  GET /dai/transactions/${walletAddress}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `walletAddress`      | `string` | **Required**. Wallet address |
| `type`      | `string` | **Required**. Type of transactions to fetch (for recipient or sender) |
| `limit` | `number (query)` | Number of transaction per page |
| `page` | `number (query)` | Page number |

#### Get balance of wallet address

```http
  GET /dai/${walletAddress}/balance
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `walletAddress`      | `string` | **Required**. Wallet address |


All the API reference can be also found in Swagger: http://localhost:3001/api - it has Authorization and all the parameters / query params included.

## Additional information
APP has Request logger middleware, that saves all the requests in the Postgres database - `api_request_log` table. ABI for the DAI contract is included in `abi` folder (`Dai.json`).

## High-Level Description
High-level description of the technologies used and development decisions are available in the [HIGH-LEVEL-DESC](./HIGH-LEVEL-DESC.md) file.

# (Bonus) SQL queries
 
```sql
/* AVG Requests per day */
SELECT COUNT(*) / (SELECT COUNT(DISTINCT DATE(timestamp)) FROM api_request_log) AS avg_requests_per_day
FROM api_request_log
WHERE timestamp BETWEEN '2023-05-08' AND '2023-05-08';

/* AVG Requests per second */
SELECT COUNT(*) / EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) AS avg_requests_per_second
FROM api_request_log
WHERE timestamp BETWEEN '2023-05-08 12:00:00' AND '2023-05-08 23:59:59';

/* Most used API key */
SELECT api_key , COUNT(*) AS num_requests
FROM api_request_log
GROUP BY api_key
ORDER BY num_requests DESC
LIMIT 1;

/* Sum of all requests in specific timeframe */
SELECT SUM(1) as total_requests
FROM api_request_log
WHERE timestamp BETWEEN '2023-05-08 00:00:00' AND '2023-05-08 23:59:59';

/* 3 hour time period for specific API key, when usage is the highest (15:00:00 to 18:00:00), limited to 100 records */
SELECT 
  api_key, 
  method, 
  path, 
  status_code, 
  response_time, 
  timestamp 
FROM api_request_log 
WHERE 
  api_key = 'API_KEY_FOR_APP' AND 
  timestamp >= '2023-05-08 15:00:00' AND 
  timestamp < '2023-05-08 18:00:00'
ORDER BY 
  response_time DESC 
LIMIT 100;
```
