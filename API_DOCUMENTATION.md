# API Documentation

## Base URL
All endpoints are relative to: `http://localhost:5000`

---

## 1. Users API

### Create User
* **Method**: `POST`
* **Endpoint**: `/api/users`
* **Purpose**: Registers a new affiliate user.
* **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```
* **Response Example (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": { "_id": "60d...a", "name": "Jane Doe", "email": "jane@example.com" }
  }
  ```
* **Possible Errors**:
  * `400 Bad Request`: Name and email are required.
  * `409 Conflict`: Email already exists.

### Get User by ID
* **Method**: `GET`
* **Endpoint**: `/api/users/:id`
* **Purpose**: Retrieves details of a specific user.
* **Request Body**: None
* **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User retrieved successfully",
    "data": { /* user object */ }
  }
  ```
* **Possible Errors**:
  * `404 Not Found`: User not found.
  * `500 Internal Server Error`: Invalid Object ID format.

---

## 2. Sales API

### Create Sale
* **Method**: `POST`
* **Endpoint**: `/api/sales`
* **Purpose**: Logs a new affiliate sale, setting it to `Pending`.
* **Request Body**:
  ```json
  {
    "userId": "60d...a",
    "earnings": 500
  }
  ```
* **Response Example (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Sale created successfully",
    "data": { "_id": "60d...b", "status": "Pending", "advancePaid": false, ... }
  }
  ```
* **Possible Errors**:
  * `400 Bad Request`: Earnings must be >= 0 / Missing fields.
  * `404 Not Found`: User not found.

### Get All Sales
* **Method**: `GET`
* **Endpoint**: `/api/sales`
* **Purpose**: Fetches sales, supporting optional query filters.
* **Query Params**: `?status=Pending`, `?userId=60d...a`
* **Request Body**: None
* **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Sales retrieved successfully",
    "data": [ { /* sale 1 */ }, { /* sale 2 */ } ]
  }
  ```

### Get Sale by ID
* **Method**: `GET`
* **Endpoint**: `/api/sales/:id`
* **Purpose**: Retrieves details of a single sale record.
* **Request Body**: None
* **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Sale retrieved successfully",
    "data": { /* sale object */ }
  }
  ```
* **Possible Errors**: `404 Not Found`.

### Reconcile Sale
* **Method**: `PATCH`
* **Endpoint**: `/api/sales/:id/reconcile`
* **Purpose**: Approves or Rejects a sale, creating FINAL or ADJUSTMENT payouts.
* **Request Body**:
  ```json
  {
    "status": "Approved"
  }
  ```
* **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Sale reconciled successfully",
    "data": { /* updated sale */ }
  }
  ```
* **Possible Errors**:
  * `400 Bad Request`: Invalid status provided.
  * `404 Not Found`: Sale not found.
  * `409 Conflict`: Sale is already Approved or Rejected.

---

## 3. Payouts API

### Run Advance Payouts (Bulk Process)
* **Method**: `POST`
* **Endpoint**: `/api/payouts/advance`
* **Purpose**: Idempotent trigger that finds all pending sales (without advances) and creates a 10% advance payout.
* **Request Body**: None
* **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Advance payouts processed successfully",
    "data": { "processed": 5, "skipped": 2 }
  }
  ```

### Get User Payouts
* **Method**: `GET`
* **Endpoint**: `/api/payouts/user/:userId`
* **Purpose**: Fetches the payout history (inflow ledger) for a specific user.
* **Request Body**: None
* **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User payouts retrieved successfully",
    "data": [ { "type": "ADVANCE", "amount": 50, ... } ]
  }
  ```

### Get Payout by ID
* **Method**: `GET`
* **Endpoint**: `/api/payouts/:id`
* **Purpose**: Retrieves a specific payout transaction.
* **Request Body**: None
* **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Payout retrieved successfully",
    "data": { /* payout object */ }
  }
  ```
* **Possible Errors**: `404 Not Found`.

---

## 4. Withdrawals API

### Process User Withdrawal
* **Method**: `POST`
* **Endpoint**: `/api/withdrawals`
* **Purpose**: Calculates the user's available balance and processes a full withdrawal if they pass the 24-hour cooldown limit.
* **Request Body**:
  ```json
  {
    "userId": "60d...a"
  }
  ```
* **Response Example (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Withdrawal successful",
    "data": {
      "withdrawnAmount": 450,
      "remainingBalance": 0
    }
  }
  ```
* **Possible Errors**:
  * `400 Bad Request`: Insufficient available balance for withdrawal.
  * `409 Conflict`: A withdrawal was already requested within the last 24 hours.

### Get User Withdrawals
* **Method**: `GET`
* **Endpoint**: `/api/withdrawals/:userId`
* **Purpose**: Retrieves the withdrawal history (outflow ledger) for a specific user.
* **Request Body**: None
* **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User withdrawals retrieved successfully",
    "data": [ { "amount": 450, "status": "SUCCESS", ... } ]
  }
  ```
