# Dai Transactions APP - High Level Description

This is a high-level description of the **Dai Transactions API** solution that was built for the coding challenge. It includes what was built, the technologies used and the reason for the high-level decisions.

## Description

The Dai Transactions API is a RESTful API built with `NestJS` that provides endpoints for fetching transactions and balances on the Dai network. It interacts with the Dai smart contract through the `Ethereum network` using the ethers library. The API is authorized using an `x-api-key` header. The transactions endpoints include fetching all transactions or transactions by recipient or sender wallet address, with pagination options. The balance endpoint allows users to fetch the balance of a given wallet address. The API also logs requests using Winston and stores the logs in both a file and a `PostgreSQL` database. In addition, the API reference is accessible via the `/api` route using `Swagger UI`.

## Technologies and Tools Used

The following technologies were used in building the Dai Transactions API:

- **NestJS**: a framework for building Node.js applications with a focus on modularity.
- **TypeScript**: a typed superset of JavaScript that compiles to plain JavaScript.
- **TypeORM**: an object-relational mapping tool that provides a data persistence layer.
- **PostgreSQL**: a powerful open-source relational database management system.
- **Docker**: a containerization platform that allows for easy deployment of applications.
- **Winston**: a logging library that provides flexibility and customization options.
- **ethers**: a library for interacting with Ethereum that provides a simple and consistent API.
- **Dai ABI**: an Application Binary Interface for the Dai smart contract.
- **NestJS throttler**: a module that limits the number of requests per second to an API endpoint.
- **Jest**: to write simple tests for the transactions endpoints
- **Swagger UI**: Rest API documentation tool for the api reference

## High-level Decisions

Several high-level decisions were made during the development of the Dai Transactions API. These include:


- Using `NestJS` as the framework for this project because it provides a solid foundation for building scalable and maintainable server-side applications with TypeScript. NestJS is built on top of for example `Express` and provides additional features such as dependency injection, modular architecture, and provides really easy integration with other popular libraries and frameworks.
- Using the latest version of `TypeORM` that uses `DataSource` instead of `deprecated Connection`. This was chosen because it is the recommended approach and provides better performance. Also Connection is going to be deleted on the newer releases of TypeORM, so it's wise to use the newest DataSource flow.
- Using `TypeORM migrations` to manage the database schema. This decision was made to make it easy to update the database schema and track changes over time.
- Using `Docker` to run a `PostgreSQL container`. This makes it easy to deploy the application and ensures that the same environment is used across different systems.
- Using the latest `Dai ABI` in `src/abi/Dai.json`. This was necessary to interact with the Dai smart contract and perform transactions.
- Using an older version of the ethers library. This was because the latest version had issues with contract listeners during deployment of this coding challange, especially with parsing the args from the contract `Transfer` event.
- Writing the application in `TypeScript`. This was chosen because TypeScript provides type checking and improves the maintainability of the code.
- Using a `NestJS throttler` to limit the number of requests per second to an API endpoint. This was done to prevent excessive traffic to the endpoint and ensure that the application remains responsive.
- Using `Jest` because it is easy to setup and configure. Jest runs test in parallel, so it really reduces test suite runtime.

Overall, these decisions were made to ensure that the Dai Transactions API is scalable, performant and easy to maintain