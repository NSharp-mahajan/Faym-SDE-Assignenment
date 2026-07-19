# API Documentation

All API responses follow a uniform JSON structure:
```json
{
  "success": true,
  "message": "Human readable message",
  "data": { ... }
}
```

---

## Withdrawals

### 1. Create a Withdrawal
**Purpose**: Initiates a new payout request for a user.

**Endpoint**: `POST /api/withdrawals`

**Request Body**:
```json
{
  "userId": "64a5c73904c3ade029b3d847",
  "amount": 500
}
```

**Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Withdrawal created successfully",
  "data": {
    "_id": "64a5c73e51cb086b5def9b57",
    "userId": "64a5c73904c3ade029b3d847",
    "amount": 500,
    "status": "PENDING",
    "requestedAt": "2023-10-14T10:00:00.000Z"
  }
}
```

**Possible Errors**:
- `400 Bad Request`: Missing fields or `amount <= 0`.
- `400 Bad Request`: User not found.

---

### 2. Get Withdrawal Details
**Purpose**: Fetches the status of a specific withdrawal.

**Endpoint**: `GET /api/withdrawals/:id`

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Withdrawal fetched successfully",
  "data": {
    "_id": "64a5c73e51cb086b5def9b57",
    "status": "PENDING",
    "amount": 500,
    "userId": "64a5c73904c3ade029b3d847"
  }
}
```

**Possible Errors**:
- `404 Not Found`: Invalid or missing ID.

---

## Recoveries

### 3. Update Withdrawal Status (Trigger Recovery)
**Purpose**: Transitions a withdrawal from `PENDING` to a final state. If the state is a failure, it automatically generates a `RecoveryTransaction`.

**Endpoint**: `PATCH /api/recoveries/:withdrawalId/status`

**Request Body**:
```json
{
  "status": "FAILED"
}
```
*(Allowed statuses: SUCCESS, FAILED, REJECTED, CANCELLED)*

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Withdrawal status updated successfully",
  "data": {
    "withdrawal": {
      "_id": "64a5c73e51cb086b5def9b57",
      "status": "FAILED"
    },
    "recoveryTransaction": {
      "_id": "64a5c74051cb086b5def9b5b",
      "withdrawalId": "64a5c73e51cb086b5def9b57",
      "reason": "FAILED"
    }
  }
}
```

**Possible Errors**:
- `409 Conflict`: The withdrawal has already been processed (Idempotency trigger).
- `400 Bad Request`: Invalid status string.
- `404 Not Found`: Withdrawal ID does not exist.

---

### 4. Get User Recovery History
**Purpose**: Retrieves a descending list of all recovery transactions associated with a user.

**Endpoint**: `GET /api/recoveries/user/:userId`

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Recovery history fetched successfully",
  "data": [
    {
      "_id": "64a5c74051cb086b5def9b5b",
      "amount": 500,
      "reason": "FAILED",
      "recoveredAt": "2023-10-14T10:05:00.000Z"
    }
  ]
}
```

**Possible Errors**:
- `400 Bad Request`: Invalid `userId` format.
