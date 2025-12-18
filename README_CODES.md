# Codes API Documentation

Complete CRUD API for managing codes (like "shahid1122", "kingkon7777", "babyesisto888", etc.)

## Base URL

- **Local**: `http://localhost:8080`
- **Production**: `https://serverapis.vercel.app`

## API Endpoints

### 1. Create a Code
**POST** `/codes`

Creates a new code.

**Request Body:**
```json
{
  "code": "shahid1122",
  "description": "Optional description",
  "discount": 10,
  "isActive": true
}
```

**cURL Example:**
```bash
curl -X POST https://serverapis.vercel.app/codes \
  -H "Content-Type: application/json" \
  -d '{
    "code": "shahid1122",
    "description": "Premium code for Shahid",
    "discount": 10,
    "isActive": true
  }'
```

**Response:**
```json
{
  "message": "Code created successfully",
  "code": {
    "_id": "507f1f77bcf86cd799439011",
    "code": "shahid1122",
    "description": "Premium code for Shahid",
    "discount": 10,
    "isActive": true,
    "usedBy": null,
    "usedAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Get All Codes
**GET** `/codes`

Retrieves all codes with optional filters and pagination.

**Query Parameters:**
- `isActive` (optional): Filter by active status (`true` or `false`)
- `search` (optional): Search codes by code string (case-insensitive)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 100)

**cURL Examples:**

Get all codes:
```bash
curl -X GET https://serverapis.vercel.app/codes
```

Get active codes only:
```bash
curl -X GET "https://serverapis.vercel.app/codes?isActive=true"
```

Search codes:
```bash
curl -X GET "https://serverapis.vercel.app/codes?search=shahid"
```

With pagination:
```bash
curl -X GET "https://serverapis.vercel.app/codes?page=1&limit=10"
```

**Response:**
```json
{
  "message": "Codes retrieved successfully",
  "codes": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "code": "shahid1122",
      "description": "Premium code for Shahid",
      "isActive": true,
      "usedBy": null,
      "usedAt": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 1,
    "pages": 1
  }
}
```

---

### 3. Get Code by ID
**GET** `/codes/:id`

Retrieves a single code by its MongoDB ObjectId.

**cURL Example:**
```bash
curl -X GET https://serverapis.vercel.app/codes/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "message": "Code retrieved successfully",
  "code": {
    "_id": "507f1f77bcf86cd799439011",
    "code": "shahid1122",
    "description": "Premium code for Shahid",
    "isActive": true,
    "usedBy": null,
    "usedAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. Get Code by Code String
**GET** `/codes/code/:code`

Retrieves a code by its code string (e.g., "shahid1122").

**cURL Example:**
```bash
curl -X GET https://serverapis.vercel.app/codes/code/shahid1122
```

**Response:**
```json
{
  "message": "Code retrieved successfully",
  "code": {
    "_id": "507f1f77bcf86cd799439011",
    "code": "shahid1122",
    "description": "Premium code for Shahid",
    "isActive": true,
    "usedBy": null,
    "usedAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Update a Code
**PUT** `/codes/:id`

Updates an existing code.

**Request Body:**
```json
{
  "code": "shahid1122",
  "description": "Updated description",
  "discount": 15,
  "isActive": false
}
```

**cURL Example:**
```bash
curl -X PUT https://serverapis.vercel.app/codes/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description",
    "discount": 15,
    "isActive": false
  }'
```

**Response:**
```json
{
  "message": "Code updated successfully",
  "code": {
    "_id": "507f1f77bcf86cd799439011",
    "code": "shahid1122",
    "description": "Updated description",
    "discount": 15,
    "isActive": false,
    "usedBy": null,
    "usedAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6. Delete a Code
**DELETE** `/codes/:id`

Deletes a code by its ID.

**cURL Example:**
```bash
curl -X DELETE https://serverapis.vercel.app/codes/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "message": "Code deleted successfully",
  "code": {
    "_id": "507f1f77bcf86cd799439011",
    "code": "shahid1122",
    "description": "Premium code for Shahid",
    "isActive": true,
    "usedBy": null,
    "usedAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 7. Create Multiple Codes (Bulk)
**POST** `/codes/bulk`

Creates multiple codes at once.

**Request Body:**
```json
{
  "codes": [
    {
      "code": "shahid1122",
      "description": "Code for Shahid",
      "discount": 10,
      "isActive": true
    },
    {
      "code": "kingkon7777",
      "description": "Code for King",
      "discount": 15,
      "isActive": true
    },
    {
      "code": "babyesisto888",
      "description": "Code for Baby",
      "discount": 20,
      "isActive": true
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST https://serverapis.vercel.app/codes/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "codes": [
      {
        "code": "shahid1122",
        "description": "Code for Shahid",
        "discount": 10,
        "isActive": true
      },
      {
        "code": "kingkon7777",
        "description": "Code for King",
        "discount": 15,
        "isActive": true
      },
      {
        "code": "babyesisto888",
        "description": "Code for Baby",
        "discount": 20,
        "isActive": true
      }
    ]
  }'
```

**Response:**
```json
{
  "message": "3 codes created successfully",
  "codes": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "code": "shahid1122",
      "description": "Code for Shahid",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "code": "kingkon7777",
      "description": "Code for King",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "code": "babyesisto888",
      "description": "Code for Baby",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 3
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": {
    "code": "400",
    "message": "Error message here"
  }
}
```

**Common Error Codes:**
- `400` - Bad Request (invalid input, missing required fields)
- `404` - Not Found (code doesn't exist)
- `409` - Conflict (code already exists)
- `500` - Internal Server Error

---

## Code Model Schema

```javascript
{
  code: String (required, unique),
  description: String (optional),
  isActive: Boolean (default: true),
  usedBy: ObjectId (reference to User, optional),
  usedAt: Date (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

---

## Quick Start Examples

### Add your codes:
```bash
# Add shahid1122
curl -X POST https://serverapis.vercel.app/codes \
  -H "Content-Type: application/json" \
  -d '{"code": "shahid1122"}'

# Add kingkon7777
curl -X POST https://serverapis.vercel.app/codes \
  -H "Content-Type: application/json" \
  -d '{"code": "kingkon7777"}'

# Add babyesisto888
curl -X POST https://serverapis.vercel.app/codes \
  -H "Content-Type: application/json" \
  -d '{"code": "babyesisto888"}'
```

### Get all codes:
```bash
curl -X GET https://serverapis.vercel.app/codes
```

### Update a code:
```bash
curl -X PUT https://serverapis.vercel.app/codes/CODE_ID \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

### Delete a code:
```bash
curl -X DELETE https://serverapis.vercel.app/codes/CODE_ID
```

---

## Notes

- Codes are case-sensitive and must be unique
- The `code` field is trimmed automatically
- Codes can be marked as active/inactive using `isActive`
- Codes can be linked to users via `usedBy` field (for future use)
- All timestamps are automatically managed by MongoDB

