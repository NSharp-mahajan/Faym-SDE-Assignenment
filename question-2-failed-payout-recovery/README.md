# Failed Payout Recovery System

## Project Overview
This project is a backend service for handling the lifecycle of payout withdrawals and robustly recovering from payout gateway failures. It forms **Question 2** of the Faym SDE Assignment, showcasing a production-ready Node.js API with strict idempotency and an immutable audit trail.

## Problem Statement Summary
In affiliate systems, withdrawals occasionally fail at the payment gateway level. The system must reliably track withdrawal statuses, handle failures (FAILED, REJECTED, CANCELLED) automatically, and securely log the event in a recovery ledger without any risk of duplicate processing under concurrent conditions.

## Features Implemented
- **Withdrawal Lifecycle Management**: Safely request and track withdrawals.
- **Automated Failure Recovery**: Failed/Rejected/Cancelled payouts automatically generate an immutable `RecoveryTransaction`.
- **Absolute Idempotency**: Atomic MongoDB updates prevent race conditions and duplicate recovery records.
- **RESTful API**: Standardized JSON responses across all endpoints.
- **Validation**: Strict schema and request-body validation.

## Technology Stack
- **Node.js & Express.js**: REST API framework.
- **MongoDB & Mongoose**: NoSQL Database and ODM.
- **express-validator**: Request payload validation.

## Folder Structure
```text
question-2-failed-payout-recovery/
├── src/
│   ├── config/       # Database connection
│   ├── controllers/  # Request parsing & HTTP responses
│   ├── middleware/   # Express middlewares (Validation)
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API route definitions
│   ├── services/     # Core business logic
│   ├── utils/        # Helper functions
│   ├── validators/   # express-validator schemas
│   ├── app.js        # Express app initialization
│   └── server.js     # Entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation
1. Clone the repository and navigate into the `question-2-failed-payout-recovery` directory.
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables
Create a `.env` file in the root directory using `.env.example` as a template:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/faym_assignment_2
```

## Running Instructions
To start the development server with hot-reloading:
```bash
npm run dev
```
To start in production mode:
```bash
npm start
```

## Testing Workflow
1. Start the server on `http://localhost:5000`.
2. Hit `GET /` to verify the health check.
3. Trigger `POST /api/withdrawals` to create a pending withdrawal.
4. Trigger `PATCH /api/recoveries/:withdrawalId/status` with `{"status": "FAILED"}` to execute the recovery logic.
5. Hit the PATCH endpoint again to verify the `409 Conflict` idempotency check.

## Key Design Decisions
- **Layered Architecture**: Strict separation of concerns (Routes -> Controllers -> Services -> DB).
- **Atomic Operations**: Used `findOneAndUpdate` with state preconditions (`status: 'PENDING'`) to guarantee that concurrent requests do not trigger multiple recovery transactions.
- **Separation of Ledgers**: Separated `Withdrawal` from `RecoveryTransaction` to optimize indexing and querying for specific financial reconciliation tasks.

## Future Improvements
- Integrate an external webhook receiver to automatically process gateway callbacks instead of manual PATCH requests.
- Implement a message queue (e.g., RabbitMQ, SQS) to process recovery transactions asynchronously under extreme load.
