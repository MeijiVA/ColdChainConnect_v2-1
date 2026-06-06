# Cold Chain Connect - API Reference

Base URL: `http://localhost:8080/api`

All requests (except login) require Authorization header:
```
Authorization: Bearer {JWT_TOKEN}
```

---

## Authentication

### Login
```
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response: 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "username": "admin",
    "role": "admin"
  }
}
```

### Create User
```
POST /auth/users
Content-Type: application/json

{
  "username": "driver1",
  "password": "secure-pwd",
  "role": "driver"
}

Response: 201
{
  "id": "uuid",
  "username": "driver1",
  "role": "driver"
}
```

### Refresh Token
```
POST /auth/refresh
Authorization: Bearer {TOKEN}

Response: 200
{
  "token": "new-jwt-token"
}
```

### Logout
```
POST /auth/logout

Response: 200
{
  "message": "Logged out successfully"
}
```

---

## Customers

### List Customers
```
GET /customers
Authorization: Bearer {TOKEN}

Response: 200
[
  {
    "id": "uuid",
    "store_name": "ABC Store",
    "location": "Manila",
    "contact_info": "555-1234",
    "agent_id": "uuid",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### Create Customer
```
POST /customers
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "store_name": "XYZ Store",
  "location": "Quezon City",
  "contact_info": "555-5678",
  "agent_id": "uuid"  // optional
}

Response: 201
{
  "id": "uuid",
  "store_name": "XYZ Store",
  "location": "Quezon City",
  "contact_info": "555-5678",
  "agent_id": "uuid",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Update Customer
```
PATCH /customers/:id
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "store_name": "Updated Name",
  "location": "New Location",
  "contact_info": "555-9999"
}

Response: 200
{ ...updated customer... }
```

### Delete Customer
```
DELETE /customers/:id
Authorization: Bearer {TOKEN}

Response: 200
{ "message": "Customer deleted" }
```

---

## Products

### List Products
```
GET /products
Authorization: Bearer {TOKEN}

Response: 200
[
  {
    "id": "uuid",
    "name": "Chicken Breast",
    "price": "150.00",
    "batch_tracking_enabled": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### Create Product
```
POST /products
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "name": "Pork Chops",
  "price": "200.50",
  "batch_tracking_enabled": true
}

Response: 201
{ ...new product... }
```

### Update Product
```
PATCH /products/:id
Authorization: Bearer {TOKEN}

{
  "price": "180.00",
  "batch_tracking_enabled": false
}

Response: 200
{ ...updated product... }
```

---

## Inventory Batches

### List Batches
```
GET /batches
Authorization: Bearer {TOKEN}

Response: 200
[
  {
    "id": "uuid",
    "product_id": "uuid",
    "pallet_id": "P-001",
    "qty_units": 50,
    "expiration_date_note": "2024-02-15",
    "placement_location": "Freezer A",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### Create Batch
```
POST /batches
Authorization: Bearer {TOKEN}

{
  "product_id": "uuid",
  "pallet_id": "P-002",
  "qty_units": 40,
  "expiration_date_note": "2024-02-20",
  "placement_location": "Freezer B"
}

Response: 201
{ ...new batch... }
```

---

## Drivers

### List Drivers
```
GET /drivers
Authorization: Bearer {TOKEN}

Response: 200
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "address": "123 Main St",
    "contact_info": "555-1111",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### Create Driver
```
POST /drivers
Authorization: Bearer {TOKEN}

{
  "user_id": "uuid",
  "address": "456 Oak Ave",
  "contact_info": "555-2222"
}

Response: 201
{ ...new driver... }
```

---

## Trucks

### List Trucks
```
GET /trucks
Authorization: Bearer {TOKEN}

Response: 200
[
  {
    "id": "uuid",
    "name": "Truck A - Manila",
    "district": "Metro Manila",
    "driver_id": "uuid",
    "status": "available",  // available|in_transit|maintenance
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### Create Truck
```
POST /trucks
Authorization: Bearer {TOKEN}

{
  "name": "Truck B - Tagaytay",
  "district": "Cavite",
  "driver_id": "uuid"  // optional
}

Response: 201
{ ...new truck... }
```

---

## Bookings

### List Bookings
```
GET /bookings?status=pending
Authorization: Bearer {TOKEN}

Query Parameters:
- status: pending|approved|prep|ready (optional)

Response: 200
[
  {
    "id": "uuid",
    "customer_id": "uuid",
    "driver_id": "uuid",
    "status": "approved",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "booking_items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "qty_ordered": 10,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
]
```

### Create Booking
```
POST /bookings
Authorization: Bearer {TOKEN}

{
  "customer_id": "uuid",
  "driver_id": "uuid",  // optional
  "items": [
    {
      "product_id": "uuid",
      "qty_ordered": 5
    },
    {
      "product_id": "uuid",
      "qty_ordered": 10
    }
  ]
}

Response: 201
{ ...booking with items... }
```

### Update Booking Status
```
PATCH /bookings/:id/status
Authorization: Bearer {TOKEN}

{
  "status": "prep"  // pending|approved|prep|ready
}

Response: 200
{ ...updated booking... }
```

---

## Invoices

### List Invoices
```
GET /invoices?unpaid=true
Authorization: Bearer {TOKEN}

Query Parameters:
- status: draft|issued|paid
- payment_status: unpaid|paid
- unpaid: true (shorthand for unpaid invoices)

Response: 200
[
  {
    "id": "uuid",
    "booking_id": "uuid",
    "agent_id": "uuid",
    "status": "draft",
    "payment_status": "unpaid",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### Create Invoice
```
POST /invoices
Authorization: Bearer {TOKEN}

{
  "booking_id": "uuid",
  "agent_id": "uuid"
}

Response: 201
{ ...new invoice... }
```

### Update Invoice Status
```
PATCH /invoices/:id/status
Authorization: Bearer {TOKEN}

{
  "status": "issued"  // draft|issued|paid
}

Response: 200
{ ...updated invoice... }
```

### Update Payment Status
```
PATCH /invoices/:id/payment-status
Authorization: Bearer {TOKEN}

{
  "payment_status": "paid"  // unpaid|paid
}

Response: 200
{ ...updated invoice... }
```

---

## Deliveries

### List Deliveries
```
GET /deliveries?status=in_transit
Authorization: Bearer {TOKEN}

Query Parameters:
- status: pending|in_transit|completed

Response: 200
[
  {
    "id": "uuid",
    "truck_id": "uuid",
    "status": "in_transit",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "delivery_items": [
      {
        "id": "uuid",
        "invoice_id": "uuid",
        "destination_customer_id": "uuid",
        "status": "in_transit",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
]
```

### Create Delivery
```
POST /deliveries
Authorization: Bearer {TOKEN}

{
  "truck_id": "uuid",
  "destinations": [
    {
      "invoice_id": "uuid",
      "destination_customer_id": "uuid"
    },
    {
      "invoice_id": "uuid",
      "destination_customer_id": "uuid"
    }
  ]
}

Response: 201
{ ...new delivery with items... }
```

### Update Delivery Status
```
PATCH /deliveries/:id/status
Authorization: Bearer {TOKEN}

{
  "status": "completed"  // pending|in_transit|completed
}

Response: 200
{ ...updated delivery... }
```

### Update Delivery Item Status
```
PATCH /deliveries/:deliveryId/items/:itemId/status
Authorization: Bearer {TOKEN}

{
  "status": "completed"  // pending|in_transit|completed
}

Response: 200
{ ...updated delivery item... }
```

---

## Audit Logs

### List Audit Logs
```
GET /audit-logs?user_id=uuid&action=create&start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer {TOKEN}
(Requires admin role)

Query Parameters:
- user_id: Filter by user (optional)
- action: Filter by action: create|update|delete (optional)
- start_date: ISO date (optional)
- end_date: ISO date (optional)
- limit: Max results, default 100, max 1000 (optional)

Response: 200
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "action": "create",
    "resource_type": "customer",
    "resource_id": "uuid",
    "before_state": null,
    "after_state": "{...json...}",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

## Error Responses

### 401 Unauthorized
```
{
  "error": "Invalid credentials" | "No token provided" | "Invalid token"
}
```

### 403 Forbidden
```
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```
{
  "error": "Customer not found" | "Product not found" | etc.
}
```

### 400 Bad Request
```
{
  "error": "Store name and location are required" | etc.
}
```

### 500 Internal Server Error
```
{
  "error": "Internal server error"
}
```

---

## Common Workflows

### Complete Order to Delivery
1. **Create Booking** → POST /bookings (status: approved)
2. **Create Invoice** → POST /invoices (status: draft)
3. **Issue Invoice** → PATCH /invoices/:id/status → "issued"
4. **Create Delivery** → POST /deliveries with invoice
5. **Update Status** → PATCH /deliveries/:id/status → "in_transit"
6. **Complete Delivery** → PATCH /deliveries/:id/status → "completed"
7. **Mark Paid** → PATCH /invoices/:id/payment-status → "paid"

### Track Customer Aging
1. **Get Unpaid** → GET /invoices?unpaid=true
2. **Filter by date** → Compare created_at to current date
3. **Send reminder** → (implement in UI)

---

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Extract token from response and use it:
TOKEN="eyJhbGc..."

# List customers
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/customers

# Create customer
curl -X POST http://localhost:8080/api/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "store_name":"New Store",
    "location":"Manila",
    "contact_info":"555-1234"
  }'
```

---

## Rate Limiting
Currently no rate limiting. Add as needed for production.

## CORS
CORS is enabled for development. Configure in server/index.ts for production.
