# Faym User Payout Management System

## Project Overview
The **Faym User Payout Management System** is a robust, scalable backend solution engineered to manage affiliate sales, automate advance payouts, handle reconciliation logic, and securely process user withdrawals. It ensures that affiliates receive correct, timely commissions while protecting the platform against double payouts, premature withdrawals, and data inconsistencies.

## Problem Statement Summary
Affiliate and referral platforms need to track sales and pay commissions. However, payouts require complex lifecycle management including issuing advance percentages, awaiting a "cooling-off" period, handling approvals/rejections (reconciliations), and allowing users to withdraw their available balance. The challenge is to build a transactional, idempotent, and performant backend to automate these workflows accurately.

## Features Implemented
* **User Management**: Creation and retrieval of user accounts.
* **Sales Tracking**: Securely log affiliate sales, keeping them in a `Pending` state initially.
* **Automated Advance Payouts**: Idempotent bulk background processing to pay out a 10% advance on pending sales.
* **Reconciliation Engine**: Handles the final approval or rejection of sales, calculating final payouts or negative adjustments (clawbacks) accordingly.
* **Smart Withdrawal System**: Dynamically calculates the available balance based on historical payouts and withdrawals, strictly enforcing a 24-hour cooldown period between requests.
* **Immutable Ledgers**: Dedicated ledgers for Payouts and Withdrawals ensuring absolute traceability of funds.

## Technology Stack
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB
* **ODM**: Mongoose
* **Environment Management**: dotenv
* **Architecture**: Strict Layered Pattern (Routes ➔ Controllers ➔ Services ➔ Models)

## Installation Steps
1. Clone the repository to your local machine.
2. Navigate into the project directory.
3. Install the required Node.js dependencies using npm:
   ```bash
   npm install
   ```

## Environment Variable Setup
1. Create a `.env` file in the root directory (you can copy `.env.example`).
2. Define the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/faym_payout_system
   ```
   *(Ensure you have a MongoDB instance running locally or provide an Atlas cluster URI).*

## Running Instructions
To start the application, use one of the following commands:

* **Development mode (with nodemon for hot-reloading)**:
  ```bash
  npm run dev
  ```
* **Production mode**:
  ```bash
  npm start
  ```

Upon success, the console will display:
```
✅ MongoDB connection successful
🚀 Server is running on port 5000
➡️  http://localhost:5000
```

## Project Folder Structure
```text
assignment-1-user-payout-system/
├── src/
│   ├── config/          # Database configuration (db.js)
│   ├── controllers/     # Request/Response logic parsing
│   ├── jobs/            # Background cron jobs (reserved for future use)
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Core business logic (calculations, rules)
│   ├── utils/           # Helper functions/constants
│   ├── validators/      # Validation schemas
│   ├── app.js           # Express app setup and route mounting
│   └── server.js        # Server bootstrap and DB connection
├── .env                 # Environment variables
├── .env.example         # Template for environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Project metadata and dependencies
└── README.md            # This file
```

## Testing Flow
To test the application end-to-end, follow this flow using Postman or cURL:
1. **Create User**: `POST /api/users` ➔ Save the `_id`.
2. **Create Sale**: `POST /api/sales` with the user's `_id` and earnings.
3. **Run Advance Payout**: `POST /api/payouts/advance` ➔ Automatically processes 10% advance for pending sales.
4. **Reconcile Sale**: `PATCH /api/sales/:id/reconcile` ➔ Approve or reject the sale.
5. **Check Balance & Withdraw**: `POST /api/withdrawals` ➔ Withdraws the available balance for the user.

## Key Design Decisions
* **Fat Services, Skinny Controllers**: Controllers only parse HTTP payloads and format responses. All business calculations reside in pure JavaScript Service files.
* **Dynamic Balance Calculation**: Instead of storing a static `walletBalance` field which is prone to race conditions, the available balance is calculated dynamically via an aggregation pipeline (Total Payouts - Total Withdrawals).
* **Idempotency via Atomic Updates**: The advance payout service uses `findOneAndUpdate` to guarantee that concurrent cron jobs or HTTP requests will never double-pay an advance on a single sale.
