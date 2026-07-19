# Database Design

The system utilizes MongoDB as the primary data store, interacting via Mongoose ORM. It consists of three primary collections.

---

## 1. User
Stores affiliate information.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Auto-generated | Unique identifier. |
| `name` | String | Required, Trimmed | Full name of the user. |
| `email` | String | Required, Unique, Lowercase | User's email address. |
| `createdAt` | Date | Auto-managed | Document creation timestamp. |
| `updatedAt` | Date | Auto-managed | Document update timestamp. |

---

## 2. Withdrawal
Tracks all payout requests from users.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier. |
| `userId` | ObjectId | Required, Ref: 'User' | The user requesting the payout. |
| `amount` | Number | Required, Min: 0 | Financial amount requested. |
| `status` | String | Enum: [PENDING, SUCCESS, FAILED, REJECTED, CANCELLED] | Current lifecycle state. Default is `PENDING`. |
| `gatewayReference` | String | Optional | ID returned by the payment processor. |
| `requestedAt` | Date | Auto-managed in Service | Timestamp of the request. |
| `processedAt` | Date | Optional | Timestamp when state changed from PENDING. |
| `createdAt` | Date | Auto-managed | - |
| `updatedAt` | Date | Auto-managed | - |

**Indexes**:
- `{ userId: 1 }` - For quickly fetching a user's withdrawal history.
- `{ status: 1 }` - For quickly querying all pending or failed withdrawals.

---

## 3. RecoveryTransaction
An immutable append-only ledger that tracks failed payouts for accounting and automated retries.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier. |
| `withdrawalId` | ObjectId | Required, Ref: 'Withdrawal' | The parent withdrawal that failed. |
| `userId` | ObjectId | Required, Ref: 'User' | The affected user. |
| `amount` | Number | Required | The amount to be recovered. |
| `reason` | String | Enum: [FAILED, REJECTED, CANCELLED] | The specific reason for the recovery. |
| `recoveredAt` | Date | Auto-managed in Service | Timestamp of the recovery creation. |
| `createdAt` | Date | Auto-managed | - |
| `updatedAt` | Date | Auto-managed | - |

**Indexes**:
- `{ withdrawalId: 1 }` - To join recovery logs with their parent withdrawal.
- `{ userId: 1 }` - To fetch a user's total failure/recovery history.
