# Subscription Expiration System

This system automatically manages subscription expiration for users who pay £20. Subscriptions are valid for exactly **1 year (365 days)** from the payment date.

## How It Works

1. **When a user pays**: The system sets:
   - `paymentStatus = true`
   - `paymentDate = current date/time`
   - `subscriptionExpiryDate = paymentDate + 1 year` (exact same time, 1 year later)
   - `subscriptionStatus = "active"`

2. **Expiration Check**: The system automatically checks for expired subscriptions:
   - **Vercel Cron Job**: Runs every hour (`0 * * * *`)
   - **Manual Trigger**: Can be called via API endpoint
   - **On Status Check**: Automatically checks when user payment status is retrieved

3. **When Expired**: 
   - `subscriptionStatus` changes to `"expired"`
   - `paymentStatus` changes to `false`
   - User loses premium access

## User Model Fields

```javascript
{
  paymentStatus: Boolean,           // false when expired
  paymentDate: Date,                // When payment was made
  subscriptionExpiryDate: Date,     // Exact expiration date/time (paymentDate + 1 year)
  subscriptionStatus: String        // "active", "expired", or "none"
}
```

## API Endpoints

### 1. Get Payment Status (with expiration check)
**GET** `/payment/status/:userId`

Automatically checks expiration and returns current status.

**Response:**
```json
{
  "message": "Payment status retrieved",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com",
    "paymentStatus": true,
    "paymentDate": "2024-01-01T10:30:00.000Z",
    "subscriptionExpiryDate": "2025-01-01T10:30:00.000Z",
    "subscriptionStatus": "active"
  }
}
```

### 2. Manually Trigger Expiration Check
**POST** `/subscription/expire`

Manually trigger subscription expiration check.

**cURL Example:**
```bash
curl -X POST https://serverapis.vercel.app/subscription/expire
```

**Response:**
```json
{
  "message": "Subscription expiration check completed",
  "expired": 5,
  "users": [
    {
      "id": "user_id",
      "username": "username",
      "email": "email@example.com",
      "expiryDate": "2024-01-01T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Subscription Statistics
**GET** `/subscription/stats`

Get statistics about subscriptions.

**cURL Example:**
```bash
curl -X GET https://serverapis.vercel.app/subscription/stats
```

**Response:**
```json
{
  "message": "Subscription statistics retrieved",
  "stats": {
    "active": 150,
    "expired": 25,
    "expiringSoon": 5,
    "total": 175
  }
}
```

## Automatic Expiration

### Vercel Cron Job

The system uses Vercel Cron Jobs to automatically check for expired subscriptions every hour.

**Configuration** (in `vercel.json`):
```json
{
  "crons": [
    {
      "path": "/subscription/expire",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Schedule**: `0 * * * *` = Every hour at minute 0

### Manual Expiration Check

You can also manually trigger expiration checks:

```bash
# Via API endpoint
curl -X POST https://serverapis.vercel.app/subscription/expire

# Or via the route handler
curl -X POST https://serverapis.vercel.app/subscription/expire
```

## Example Flow

1. **User pays £20 on January 1, 2024 at 10:30 AM**
   - `paymentDate`: `2024-01-01T10:30:00.000Z`
   - `subscriptionExpiryDate`: `2025-01-01T10:30:00.000Z` (exactly 1 year later)
   - `subscriptionStatus`: `"active"`

2. **On January 1, 2025 at 10:30 AM** (or later)
   - System detects expiration
   - `subscriptionStatus`: `"expired"`
   - `paymentStatus`: `false`
   - User loses premium access

3. **User tries to access premium features**
   - System checks `subscriptionStatus` and `subscriptionExpiryDate`
   - Returns `paymentStatus: false`
   - User must renew subscription

## Testing

### Test Expiration Manually

1. Create a test user with a past expiry date:
```javascript
// In MongoDB or via API
{
  subscriptionExpiryDate: new Date("2020-01-01"), // Past date
  subscriptionStatus: "active"
}
```

2. Call expiration endpoint:
```bash
curl -X POST https://serverapis.vercel.app/subscription/expire
```

3. Check user status:
```bash
curl -X GET https://serverapis.vercel.app/payment/status/USER_ID
```

## Notes

- Expiration is checked **exactly** at the expiry date/time (same hour, minute, second as payment)
- Expiration checks run automatically every hour via Vercel Cron
- Expiration is also checked when retrieving user payment status
- Once expired, users must make a new payment to reactivate premium access
- The system preserves the original payment date for record-keeping

