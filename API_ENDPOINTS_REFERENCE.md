# Cold Chain Connect - API Endpoints Reference

Base URL: `http://localhost:8080/api`

All endpoints require authentication headers except login/logout unless otherwise noted.

---

## 🔐 Authentication Endpoints

### POST /auth/login
Login and get JWT token.

**No auth required**

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "username": "admin",
    "role": "admin"
  }
}
```

---

### POST /auth/logout
Logout (clears session on frontend).

**Request:** No body needed

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### POST /auth/refresh
Get a new JWT token using an existing valid token.

**Headers:** `Authorization: Bearer <token>`

**Request:** No body

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### POST /auth/users
Create a new user account.

**Role Required:** admin

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "username": "newdriver",
  "password": "secure_password_123",
  "role": "driver"
}
```

**Response:**
```json
{
  "id": "user-456",
  "username": "newdriver",
  "role": "driver"
}
```

---

## 👥 Customers Endpoints

### GET /customers
List all customers.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:** None

**Response:**
```json
[
  {
    "id": "cust-001",
    "store_name": "ABC Market - Makati",
    "location": "Makati City",
    "contact_info": "555-0001",
    "agent_id": "user-123",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

---

### POST /customers
Create a new customer.

**Role Required:** admin

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "store_name": "New Store",
  "location": "Downtown",
  "contact_info": "555-1234",
  "agent_id": "optional-user-id"
}
```

**Response:** Created customer object (201 status)

---

### PATCH /customers/:id
Update a customer.

**Role Required:** admin

**Headers:** `Authorization: Bearer <token>`

**Request:** Any subset of fields
```json
{
  "contact_info": "555-5678"
}
```

**Response:** Updated customer object

---

### DELETE /customers/:id
Delete a customer.

**Role Required:** admin

**Headers:** `Authorization: Bearer <token>`

**Response:** 200 OK with message

---

## 📦 Products Endpoints

### GET /products
List all products.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "prod-001",
    "name": "Chicken Breast",
    "price": "150.00",
    "batch_tracking_enabled": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

---

### POST /products
Create a new product.

**Role Required:** admin

**Request:**
```json
{
  "name": "New Product",
  "price": 99.99,
  "batch_tracking_enabled": true
}
```

---

### PATCH /products/:id
Update a product.

**Role Required:** admin

**Request:**
```json
{
  "price": 125.50
}
```

---

### DELETE /products/:id
Delete a product.

**Role Required:** admin

---

## 🚗 Drivers Endpoints

### GET /drivers
List all drivers.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "driver-001",
    "user_id": "user-123",
    "address": "123 Main St",
    "contact_info": "09171234567",
    "is_active": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

---

### POST /drivers
Create a new driver.

**Role Required:** admin

**Request:**
```json
{
  "user_id": "user-123",
  "address": "456 Driver Ave",
  "contact_info": "09179876543"
}
```

---

### PATCH /drivers/:id
Update a driver.

**Role Required:** admin

**Request:**
```json
{
  "is_active": false
}
```

---

### DELETE /drivers/:id
Delete a driver.

**Role Required:** admin

---

## 🚛 Trucks Endpoints

### GET /trucks
List all trucks with status.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "truck-001",
    "name": "Truck A - Metro Manila",
    "district": "Metro Manila",
    "driver_id": "driver-001",
    "status": "available",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

Status values: `available`, `in_transit`, `maintenance`

---

### POST /trucks
Create a new truck.

**Role Required:** admin

**Request:**
```json
{
  "name": "Truck D",
  "district": "Laguna",
  "driver_id": "optional-driver-id",
  "status": "available"
}
```

---

### PATCH /trucks/:id
Update a truck (assign driver, change status, etc.).

**Role Required:** admin

**Request:**
```json
{
  "status": "in_transit",
  "driver_id": "driver-002"
}
```

---

### DELETE /trucks/:id
Delete a truck.

**Role Required:** admin

---

## 📦 Inventory Batches / Pallets Endpoints

### GET /batches
List all inventory batches.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "batch-001",
    "product_id": "prod-001",
    "pallet_id": "P-2024-001",
    "qty_units": 100,
    "expiration_date_note": "2024-02-15",
    "placement_location": "Freezer A",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

---

### POST /batches
Create a new inventory batch.

**Role Required:** admin

**Request:**
```json
{
  "product_id": "prod-001",
  "pallet_id": "P-2024-005",
  "qty_units": 150,
  "expiration_date_note": "2024-03-01",
  "placement_location": "Freezer D"
}
```

---

### PATCH /batches/:id
Update a batch quantity or expiration.

**Role Required:** admin

**Request:**
```json
{
  "qty_units": 80
}
```

---

### DELETE /batches/:id
Delete a batch.

**Role Required:** admin

---

## 📋 Bookings Endpoints

### GET /bookings
List all bookings (filter by status).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `?status=pending` - Filter by status (pending, approved, prep, ready)

**Response:**
```json
[
  {
    "id": "booking-001",
    "customer_id": "cust-001",
    "driver_id": "driver-001",
    "status": "approved",
    "booking_items": [
      {
        "id": "item-001",
        "booking_id": "booking-001",
        "product_id": "prod-001",
        "qty_ordered": 50,
        "created_at": "2024-01-15T10:00:00Z"
      }
    ],
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

---

### POST /bookings
Create a new booking with items.

**Role Required:** driver or admin

**Request:**
```json
{
  "customer_id": "cust-001",
  "driver_id": "optional-driver-id",
  "items": [
    {
      "product_id": "prod-001",
      "qty_ordered": 50
    },
    {
      "product_id": "prod-002",
      "qty_ordered": 30
    }
  ]
}
```

**Response:** Created booking with items

---

### PATCH /bookings/:id/status
Update booking status.

**Role Required:** admin

**Request:**
```json
{
  "status": "ready"
}
```

Status values: `pending`, `approved`, `prep`, `ready`

---

## 💰 Invoices Endpoints

### GET /invoices
List all invoices (filter by status and payment).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `?status=issued` - Filter by invoice status (draft, issued, paid)
- `?payment_status=unpaid` - Filter by payment status
- `?unpaid=true` - Get only unpaid invoices

**Response:**
```json
[
  {
    "id": "invoice-001",
    "booking_id": "booking-001",
    "agent_id": "user-123",
    "status": "issued",
    "payment_status": "unpaid",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

---

### POST /invoices
Create a new invoice for a booking.

**Role Required:** admin

**Request:**
```json
{
  "booking_id": "booking-001",
  "agent_id": "user-123"
}
```

**Response:** Created invoice (201 status)

---

### PATCH /invoices/:id/status
Update invoice status (draft → issued → paid).

**Role Required:** admin

**Request:**
```json
{
  "status": "issued"
}
```

---

### PATCH /invoices/:id/payment-status
Update payment status.

**Role Required:** admin

**Request:**
```json
{
  "payment_status": "paid"
}
```

---

## 🚚 Deliveries Endpoints

### GET /deliveries
List all deliveries (filter by status).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `?status=in_transit` - Filter by status (pending, in_transit, completed)

**Response:**
```json
[
  {
    "id": "delivery-001",
    "truck_id": "truck-001",
    "status": "in_transit",
    "delivery_items": [
      {
        "id": "item-001",
        "delivery_id": "delivery-001",
        "invoice_id": "invoice-001",
        "destination_customer_id": "cust-001",
        "status": "pending",
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    ],
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

---

### POST /deliveries
Create a new delivery with destinations.

**Role Required:** admin

**Request:**
```json
{
  "truck_id": "truck-001",
  "destinations": [
    {
      "invoice_id": "invoice-001",
      "destination_customer_id": "cust-001"
    },
    {
      "invoice_id": "invoice-002",
      "destination_customer_id": "cust-002"
    }
  ]
}
```

**Response:** Created delivery with items

---

### PATCH /deliveries/:id/status
Update overall delivery status.

**Role Required:** admin

**Request:**
```json
{
  "status": "in_transit"
}
```

Status values: `pending`, `in_transit`, `completed`

---

### PATCH /deliveries/:deliveryId/items/:itemId/status
Update individual delivery item status.

**Role Required:** admin or driver

**Request:**
```json
{
  "status": "completed"
}
```

---

## 📊 Audit Logs Endpoints

### GET /audit-logs
List audit log entries (admin only).

**Role Required:** admin

**Query Parameters:**
- `?user_id=user-123` - Filter by user
- `?action=create` - Filter by action type (create, update, delete)
- `?start_date=2024-01-01` - Filter from date
- `?end_date=2024-01-31` - Filter to date
- `?limit=50` - Max results (default 100, max 1000)

**Response:**
```json
[
  {
    "id": "log-001",
    "user_id": "user-123",
    "action": "create",
    "resource_type": "customer",
    "resource_id": "cust-001",
    "before_state": null,
    "after_state": "{\"id\":\"cust-001\",\"store_name\":\"ABC Market\"}",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

---

## 🌍 System Endpoints

### GET /health
Health check (no auth required).

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

### GET /ping
Test endpoint (no auth required).

**Response:**
```json
{
  "message": "ping pong"
}
```

---

## 🔑 Using the API in Your Code

### Example: Fetch Customers

```javascript
// Get token
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const { token } = await loginResponse.json();

// Fetch customers with token
const response = await fetch('/api/customers', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const customers = await response.json();
```

### Example: Create a Booking

```javascript
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    customer_id: 'cust-001',
    items: [
      { product_id: 'prod-001', qty_ordered: 50 },
      { product_id: 'prod-002', qty_ordered: 30 }
    ]
  })
});

const booking = await response.json();
```

---

## 🔍 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found |
| 500 | Server error |

---

## 🔒 Role-Based Access

| Endpoint | Admin | Driver | Notes |
|----------|-------|--------|-------|
| GET endpoints | ✓ | ✓ | Both can read |
| POST /customers | ✓ | ✗ | Create only |
| POST /bookings | ✓ | ✓ | Both can create |
| POST /invoices | ✓ | ✗ | Admin only |
| POST /deliveries | ✓ | ✗ | Admin only |
| PATCH /bookings/:id/status | ✓ | ✗ | Admin only |
| PATCH /deliveries/*/status | ✓ | ✗ | Admin only |
| PATCH /deliveries/*/items/*/status | ✓ | ✓ | Both can update items |

---

## 📚 Quick Reference

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Save token from response, then use it:
TOKEN="eyJ..."

# Get customers
curl http://localhost:8080/api/customers \
  -H "Authorization: Bearer $TOKEN"

# Create customer
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "store_name": "New Store",
    "location": "City",
    "contact_info": "555-1234"
  }'

# Update customer
curl -X PATCH http://localhost:8080/api/customers/cust-001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"contact_info": "555-5678"}'

# Delete customer
curl -X DELETE http://localhost:8080/api/customers/cust-001 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚀 Next Steps

1. Set up PostgreSQL (see DATABASE_SETUP.md)
2. Configure .env with DATABASE_URL and JWT_SECRET
3. Run `pnpm db:push` to create tables
4. Run `pnpm db:seed` to add demo data
5. Run `pnpm dev` to start the server
6. Use this reference to test endpoints
7. Integrate with your React frontend
