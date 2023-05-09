# Senior Backend Coding Challenge
## Description

This project includes the full coding challenge with the basic and practical coding task (DAI Transaction API).


## Repository includes

- Basic code improvement part
- DAI Transaction APP with all the required details to run it locally
- SQL queries as a bonus task

## Basic - improved code
I've assumed that `connectToDatabase()` establishes the database connection, then we're getting the user from the database as well as the settings for the specific user. Then we set the role for the user and notifer user and admins about the updated role.

In improved version I've used the async/await syntax to simplify the nested Promise chain.

Also, note that the `notifyUser()` and `notifyAdmins()` methods are independent and do not depend on each other, so we can execute them concurrently using `Promise.all()`. This allows to notify the user and the admins at the same time, which can improve the overall performance of this functionality.

Finally, I've added basic error handling using a `try/catch`.
```ts
const updateUserRole = async () => {
  try {
    const database = await connectToDatabase();
    const user = await getUser(database, 'email@email.com');
    const settings = await getUserSettings(database, user.id);
    const success = await setRole(database, user.id, "ADMIN");
    await Promise.all([
      notifyUser(user.id, "USER_ROLE_UPDATED"),
      notifyAdmins("USER_ROLE_UPDATED")
    ]);
    return success;
  } catch (error) {
    console.error(error);
  }
}

updateUserRole();
```


## Environment Variables

See the `.example.env` file to get the idea what the example environment variables are.

**Important note: `INFURA_API_KEY` in `.env.example` is a free-tier [Infura](https://www.infura.io/) API KEY, but for the sake of this App, requests limits are more than enough.**

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

## (Bonus) SQL queries
 
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
