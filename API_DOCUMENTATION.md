# FindIt API Documentation

Complete REST API documentation for FindIt backend.

**Base URL:** `http://localhost:5000/api` (development) or `https://findit-api.render.com/api` (production)

---

## Authentication

All protected endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained via login and stored in localStorage as `findit_token`.

---

## Endpoints

### Authentication

#### POST `/auth/signup`
Create a new user account

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@presidency.edu",
  "password": "SecurePass123",
  "phone": "+91 98765 43210",
  "department": "Computer Science",
  "year": "3",
  "rollNo": "21CS1234"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "_id": "6789abc...",
    "name": "John Doe",
    "email": "john@presidency.edu",
    "role": "student",
    "department": "Computer Science"
  }
}
```

**Errors:**
- `400` — Invalid email or password < 8 chars
- `409` — Email already exists

---

#### POST `/auth/login`
Authenticate user

**Request:**
```json
{
  "email": "student@presidencyuniversity.in",
  "password": "Student@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "student"
  }
}
```

**Errors:**
- `401` — Invalid credentials
- `400` — Missing fields

---

#### GET `/auth/me`
Get current user profile

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "student",
    "stats": { "lostReported": 2, ... }
  }
}
```

**Errors:**
- `401` — Not authenticated
- `401` — Token expired

---

### Items

#### GET `/items`
List all items with filters and pagination

**Query Parameters:**
- `type` — `lost` | `found`
- `category` — `student-id`, `wallet`, `electronics`, `laptop`, `mobile`, `earphones`, `books`, `stationery`, `keys`, `bags`, `clothing`, `jewelry`, `documents`, `others`
- `status` — `lost` | `found` | `returned`
- `location` — Campus location
- `q` — Search query (searches title, description, location)
- `sort` — `newest` (default) | `oldest` | `views`
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 20, max: 100)

**Request:**
```
GET /items?type=lost&category=wallet&sort=newest&page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "count": 20,
  "total": 156,
  "pages": 8,
  "data": [
    {
      "_id": "...",
      "type": "lost",
      "title": "Blue Wallet",
      "category": "wallet",
      "description": "...",
      "location": "Library",
      "date": "2024-01-15",
      "views": 12,
      "reporter": {
        "_id": "...",
        "name": "Lakshmi Reddy",
        "avatar": "LN"
      }
    }
  ]
}
```

---

#### POST `/items/upload`
Upload images to Cloudinary

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Body:**
- `images` — File array (max 5 files, 5MB each)

**Request:**
```bash
curl -X POST http://localhost:5000/api/items/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.jpg"
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "findit/items/item-123456"
    }
  ]
}
```

**Errors:**
- `400` — No files uploaded
- `413` — File size > 5MB

---

#### GET `/items/:id`
Get item details and increment view count

**Headers:** None (public endpoint)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "type": "lost",
    "title": "Blue Airpods Pro",
    "category": "earphones",
    "description": "...",
    "location": "Engineering Block",
    "date": "2024-01-15",
    "images": [
      {
        "url": "https://...",
        "publicId": "..."
      }
    ],
    "views": 13,
    "reporter": {
      "_id": "...",
      "name": "Lakshmi Reddy",
      "phone": "+91 98765 43211",
      "department": "Computer Science"
    }
  }
}
```

**Errors:**
- `404` — Item not found

---

#### POST `/items`
Create a new item report

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "type": "lost",
  "title": "Blue Airpods Pro",
  "category": "earphones",
  "description": "Lost near cafeteria, has small scratch on case",
  "location": "Engineering Block",
  "date": "2024-01-15",
  "time": "14:30",
  "reward": "₹500",
  "contactPhone": "+91 98765 43211",
  "contactEmail": "student@presidency.edu",
  "images": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "findit/items/..."
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "type": "lost",
    "title": "Blue Airpods Pro",
    "category": "earphones",
    ...
  }
}
```

**Errors:**
- `400` — Missing required fields
- `401` — Not authenticated

---

#### PUT `/items/:id`
Update an item (owner or admin only)

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "returned"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

**Errors:**
- `403` — Not authorized (not owner or admin)
- `404` — Item not found

---

#### DELETE `/items/:id`
Delete an item (owner or admin only)

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed"
}
```

**Errors:**
- `403` — Not authorized
- `404` — Item not found

---

#### GET `/items/:id/matches`
Get AI-matched items (opposite type, same category)

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "type": "found",
      "title": "...",
      "category": "earphones",
      "reporter": { ... }
    }
  ]
}
```

---

#### POST `/items/:id/bookmark`
Toggle bookmark for an item

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "isBookmarked": true,
  "data": ["item1_id", "item2_id", "item3_id"]
}
```

---

#### GET `/items/user/bookmarks`
Get all bookmarked items

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "title": "...",
      "category": "...",
      ...
    }
  ]
}
```

---

#### PUT `/items/:id/status`
Update item status (owner or admin)

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "status": "returned"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### Notifications

#### GET `/notifications`
Get user's notifications

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` — Page number
- `limit` — Items per page

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "unread": 2,
  "data": [
    {
      "_id": "...",
      "type": "match",
      "title": "Possible Match Found! 🎯",
      "message": "Your lost item matches a found report",
      "relatedItem": {
        "_id": "...",
        "title": "...",
        "type": "found"
      },
      "read": false,
      "createdAt": "2024-01-15T14:30:00Z"
    }
  ]
}
```

---

#### PUT `/notifications/:id/read`
Mark notification as read

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

#### PUT `/notifications/read/all`
Mark all notifications as read

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

#### DELETE `/notifications/:id`
Delete a notification

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

### Users

#### GET `/users/profile`
Get current user's profile

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "phone": "...",
    "department": "...",
    "year": "...",
    "rollNo": "...",
    "role": "student",
    "stats": {
      "lostReported": 2,
      "foundReported": 1,
      "recovered": 1,
      "helped": 3
    }
  }
}
```

---

#### PUT `/users/profile`
Update user profile

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Updated Name",
  "phone": "+91 98765 43211",
  "department": "Computer Science",
  "year": "4",
  "rollNo": "21CS1234"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

#### GET `/users/dashboard`
Get user dashboard statistics

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "stats": {
      "myLost": 2,
      "myFound": 1,
      "recovered": 1
    }
  }
}
```

---

#### GET `/users`
List all users (admin only)

**Headers:** `Authorization: Bearer {token}` (admin role required)

**Response (200):**
```json
{
  "success": true,
  "count": 45,
  "data": [
    {
      "_id": "...",
      "name": "...",
      "email": "...",
      "role": "student"
    }
  ]
}
```

**Errors:**
- `403` — Admin access required

---

### Health

#### GET `/health`
Check API health status

**Response (200):**
```json
{
  "status": "ok",
  "service": "FindIt API",
  "version": "1.0.0",
  "timestamp": "2024-01-15T14:30:00Z"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK — Request successful |
| 201 | Created — New resource created |
| 400 | Bad Request — Invalid input |
| 401 | Unauthorized — Missing/invalid token |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found — Resource not found |
| 409 | Conflict — Resource already exists |
| 500 | Server Error — Internal error |

---

## Rate Limiting

Free tier limits:
- 100 requests per minute per IP
- Contact support for higher limits

---

## Pagination

All list endpoints support pagination:

```
GET /items?page=2&limit=20
```

Response includes:
- `count` — Items in current page
- `total` — Total items available
- `pages` — Total number of pages

---

## Filtering Examples

```bash
# Search for lost wallets
GET /items?type=lost&category=wallet

# Sort by most viewed
GET /items?sort=views

# Paginate results
GET /items?page=2&limit=10

# Full-text search
GET /items?q=blue+airpods

# Multiple filters
GET /items?type=found&category=electronics&location=Library&sort=newest
```

---

## Authentication Flow

1. **Register/Login** → Get JWT token
2. **Store Token** → localStorage as `findit_token`
3. **Send Token** → In `Authorization` header for protected endpoints
4. **Token Expires** → 30 days (re-login required)
5. **Logout** → Delete token from localStorage

---

## CORS Policy

**Allowed Origins:**
- `http://localhost:5173` (local development)
- `https://findit-client.vercel.app` (production)

**Allowed Methods:** GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:** Content-Type, Authorization

---

## Testing with cURL

```bash
# Get all items
curl http://localhost:5000/api/items

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@findit.local","password":"Admin@123"}'

# Use token for protected endpoint
TOKEN="eyJhbGciOiJIUzI1NiIs..."
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testing with Postman

1. Import collection from `/server/postman-collection.json`
2. Set `base_url` variable to `http://localhost:5000/api`
3. Login to get token
4. Token auto-saved to `Authorization` header

---

**API Version:** 1.0.0  
**Last Updated:** 2026-01-15
