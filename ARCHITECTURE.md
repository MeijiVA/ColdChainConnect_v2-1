# Cold Chain Connect - Backend Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                           │
│                   (client/ directory)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Requests (JSON)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   Vite Dev Server                            │
│              Single Port: 8080                               │
├─────────────────────────────────────────────────────────────┤
│                Express.js Server                             │
│  ├── CORS Middleware                                         │
│  ├── JSON Parser                                             │
│  └── Route Handler Middleware                               │
├─────────────────────────────────────────────────────────────┤
│               Authentication & Authorization                 │
│  ├── JWT Token Validation (authMiddleware)                  │
│  ├── Role-Based Access Control (requireRole)                │
│  └── User Context Injection                                 │
├─────────────────────────────────────────────────────────────┤
│                    Route Handlers                            │
│  ├── /api/auth (login, logout, refresh)                     │
│  ├── /api/customers (CRUD)                                  │
│  ├── /api/products (CRUD)                                   │
│  ├── /api/drivers (CRUD)                                    │
│  ├── /api/trucks (CRUD)                                     │
│  ├── /api/batches (CRUD)                                    │
│  ├── /api/bookings (create, list, status)                   │
│  ├── /api/invoices (create, list, status, payment)          │
│  ├── /api/deliveries (create, list, status)                 │
│  └── /api/audit-logs (query)                                │
├─────────────────────────────────────────────────────────────┤
│                   Middleware Layer                           │
│  ├── Error Handling (try/catch)                             │
│  ├── Audit Logging (logAction)                              │
│  ├── Validation (Zod schemas)                               │
│  └── Demo Mode Fallback                                     │
├─────────────────────────────────────────────────────────────┤
│                    Drizzle ORM Layer                         │
│  ├── Database Queries                                       │
│  ├── Type-Safe Operations                                   │
│  ├── Schema Validation                                      │
│  └── Connection Management                                  │
├─────────────────────────────────────────────────────────────┤
│                  PostgreSQL Database                         │
│  ├── 11 Tables (users, customers, products, etc.)          │
│  ├── Relationships & Constraints                            │
│  ├── Audit Trail (audit_logs table)                         │
│  └── Status Enums & Defaults                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### Request Flow (with Authentication)

```
Client Request
    │
    ├─→ POST /api/auth/login
    │   └─→ Verify credentials
    │   └─→ Generate JWT token
    │   └─→ Return token + user info
    │
    ├─→ GET /api/customers (with token)
    │   └─→ Extract token from header
    │   └─→ Verify JWT signature
    │   └─→ Check token expiration
    │   └─→ Load user from token payload
    │   └─→ Check user role (admin/driver)
    │   └─→ Execute query
    │   └─→ Return data
    │
    └─→ POST /api/bookings (with token)
        └─→ Validate token
        └─→ Validate request body
        └─→ Create booking record
        └─→ Create booking items
        └─→ Log action to audit_logs
        └─→ Return created booking
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                        users                                 │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ UUID                                      │
│ username (UNIQUE)│ string                                    │
│ password_hash    │ string (bcrypt)                          │
│ role             │ enum (admin | driver)                    │
│ created_at       │ timestamp                                │
│ updated_at       │ timestamp                                │
└─────────────────────────────────────────────────────────────┘
         │                          │
         ↓                          ↓
    ┌──────────┐            ┌─────────────┐
    │ drivers  │            │ customers   │
    │ (1:1)    │            │ (1:many)    │
    └──────────┘            └─────────────┘
         │                          │
         └──────────┬───────────────┘
                    ↓
            ┌───────────────┐
            │ bookings      │
            │ (1:many)      │
            └───────────────┘
                    │
                    ├─→ booking_items (1:many)
                    │
                    └─→ invoices (1:1)
                         │
                         └─→ delivery_items (1:many)
                              │
                              └─→ deliveries (1:many)
                                   │
                                   └─→ trucks (1:many)

            inventory_batches
            (1:many to products)

            audit_logs
            (tracks all changes)
```

---

## 🔐 Authentication & Authorization Flow

```
LOGIN
  │
  └─→ POST /api/auth/login
      ├─→ Username lookup in DB
      ├─→ Password comparison (bcrypt)
      └─→ Generate JWT token
          ├─ userId
          ├─ username
          ├─ role (admin | driver)
          └─ Expires in 24 hours

AUTHENTICATED REQUESTS
  │
  └─→ Bearer token in Authorization header
      │
      ├─→ authMiddleware
      │   ├─→ Extract token
      │   ├─→ Verify signature
      │   ├─→ Check expiration
      │   └─→ Load user to req.user
      │
      ├─→ requireRole middleware (if needed)
      │   └─→ Check req.user.role
      │
      └─→ Handler executes
          └─→ Uses req.user for audit logging
```

---

## 📝 Audit Logging Architecture

```
Every CRUD Operation
  │
  ├─→ Handler executes (POST, PATCH, DELETE)
  │
  ├─→ Get before state (if update/delete)
  │   └─→ db.query.resource.findFirst()
  │
  ├─→ Execute mutation
  │   └─→ db.insert/update/delete()
  │
  ├─→ Get after state
  │   └─→ db.query.resource.findFirst()
  │
  └─→ Log action
      └─→ logAction(userId, action, type, id, before, after)
          └─→ db.insert(audit_logs)
              ├─ user_id
              ├─ action (create|update|delete)
              ├─ resource_type (customer|product|etc)
              ├─ resource_id
              ├─ before_state (JSON)
              ├─ after_state (JSON)
              └─ created_at
```

---

## 🔄 Status Workflows

### Booking Workflow
```
pending → approved → prep → ready
  │
  └─→ Invoice created from booking
```

### Invoice Workflow
```
status:         draft → issued → paid
payment_status: unpaid ←→ paid (independent)

Example:
- Create: status=draft, payment_status=unpaid
- Issue: status=issued, payment_status=unpaid
- Payment received: payment_status=paid (keep status)
- Complete: status=paid (when fully reconciled)
```

### Delivery Workflow
```
Delivery Status:      pending → in_transit → completed
Individual Item:      pending → in_transit → completed

- Delivery can be in_transit while items are pending
- Items can be completed before delivery is marked complete
- Allows fine-grained tracking per destination
```

### Truck Status
```
available → in_transit → maintenance → available
```

---

## 🛣️ Route Structure

```
server/routes/
├── auth.ts
│   ├── POST /api/auth/login (no auth)
│   ├── POST /api/auth/logout (no auth)
│   ├── POST /api/auth/refresh (auth required)
│   └── POST /api/auth/users (admin only)
│
├── customers.ts
│   ├── GET /api/customers (auth)
│   ├── POST /api/customers (admin)
│   ├── PATCH /api/customers/:id (admin)
│   └── DELETE /api/customers/:id (admin)
│
├── products.ts
│   ├── GET /api/products (auth)
│   ├── POST /api/products (admin)
│   ├── PATCH /api/products/:id (admin)
│   └── DELETE /api/products/:id (admin)
│
├── drivers.ts
│   ├── GET /api/drivers (auth)
│   ├── POST /api/drivers (admin)
│   ├── PATCH /api/drivers/:id (admin)
│   └── DELETE /api/drivers/:id (admin)
│
├── trucks.ts
│   ├── GET /api/trucks (auth)
│   ├── POST /api/trucks (admin)
│   ├── PATCH /api/trucks/:id (admin)
│   └── DELETE /api/trucks/:id (admin)
│
├── batches.ts
│   ├── GET /api/batches (auth)
│   ├── POST /api/batches (admin)
│   ├── PATCH /api/batches/:id (admin)
│   └── DELETE /api/batches/:id (admin)
│
├── bookings.ts
│   ├── GET /api/bookings (auth)
│   ├── POST /api/bookings (driver|admin)
│   └── PATCH /api/bookings/:id/status (admin)
│
├── invoices.ts
│   ├── GET /api/invoices (auth)
│   ├── POST /api/invoices (admin)
│   ├── PATCH /api/invoices/:id/status (admin)
│   └── PATCH /api/invoices/:id/payment-status (admin)
│
├── deliveries.ts
│   ├── GET /api/deliveries (auth)
│   ├── POST /api/deliveries (admin)
│   ├── PATCH /api/deliveries/:id/status (admin)
│   └── PATCH /api/deliveries/:id/items/:itemId/status (admin|driver)
│
└── audit.ts
    └── GET /api/audit-logs (admin)
```

---

## 🎯 Handler Pattern

All route handlers follow the same pattern:

```typescript
export const handler: RequestHandler = async (req: AuthRequest, res) => {
  try {
    // 1. VALIDATE INPUT
    if (!required_field) {
      return res.status(400).json({ error: "Field is required" });
    }

    // 2. FETCH EXISTING (if update/delete)
    const existing = await db.query.resource.findFirst({
      where: eq(resource.id, id)
    });
    if (!existing) {
      return res.status(404).json({ error: "Not found" });
    }

    // 3. EXECUTE OPERATION
    await db.insert/update/delete(resource).values(...);

    // 4. FETCH RESULT
    const result = await db.query.resource.findFirst({
      where: eq(resource.id, id)
    });

    // 5. LOG AUDIT TRAIL
    if (req.user) {
      await logAction(
        req.user.userId,
        "create|update|delete",
        "resource_type",
        id,
        existing,
        result
      );
    }

    // 6. RESPOND
    res.status(201).json(result);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
```

---

## 🧬 Type Safety

```
Shared Types (shared/api.ts)
├── Request/Response interfaces
│   ├── LoginRequest / LoginResponse
│   ├── CreateCustomerRequest / Customer
│   └── ... (all 9 resources)
│
├── Zod Validation Schemas
│   ├── LoginRequestSchema
│   ├── CreateCustomerSchema / UpdateCustomerSchema
│   └── ... (all create/update operations)
│
└── Used by:
    ├── Backend (request validation)
    └── Frontend (type hints)
```

---

## ⚙️ Middleware Stack

```
Request arrives at Vite dev server
    │
    ├─→ vite.config.ts expressPlugin()
    │   └─→ createServer() from server/index.ts
    │
    ├─→ CORS middleware
    │   └─→ Allow cross-origin requests
    │
    ├─→ JSON Parser
    │   └─→ Parse request body
    │
    ├─→ URL-encoded Parser
    │   └─→ Parse form data
    │
    ├─→ Route Matching
    │   └─→ Match to handler
    │
    ├─→ Auth Middleware (if protected route)
    │   └─→ authMiddleware
    │       └─→ Verify token
    │       └─→ Load user to req.user
    │
    ├─→ Role Middleware (if role required)
    │   └─→ requireRole("admin")
    │       └─→ Check permission
    │
    └─→ Handler Execution
        ├─→ Validate input
        ├─→ Query database
        ├─→ Log audit trail
        └─→ Return response
```

---

## 💾 Demo Mode Architecture

```
If DATABASE_URL is NOT set:

Request → Handler → Check DATABASE_URL
                        │
                        ├─→ EXISTS → Query PostgreSQL
                        │
                        └─→ MISSING → Use Demo Data
                            └─→ Return hardcoded objects
                                ├─ demoCustomers
                                ├─ demoProducts
                                └─ demoTrucks

Perfect for:
- Rapid prototyping
- UI testing
- No database setup needed
- Demo deployments
```

---

## 🚀 Deployment Architecture

```
Development
├─→ Vite dev server (single port 8080)
├─→ Hot reload (client & server)
└─→ SQLite or PostgreSQL

Production
├─→ npm run build
├─→ npm run start
├─→ Node.js server (standalone)
├─→ PostgreSQL required
├─→ Deployed to:
│   ├─ Netlify (via MCP)
│   ├─ Vercel (via MCP)
│   └─ Self-hosted (Docker, etc.)
```

---

## 📦 Dependencies

### Runtime
```json
{
  "bcryptjs": "3.0.3",      // Password hashing
  "drizzle-orm": "0.45.2",  // ORM
  "express": "5.1.0",       // Web framework
  "jsonwebtoken": "9.0.3",  // JWT tokens
  "pg": "8.21.0",          // PostgreSQL driver
  "zod": "3.25.76"         // Validation
}
```

### Build & Dev
```json
{
  "vite": "8.0.2",          // Build tool
  "tsx": "4.20.3",         // TypeScript execution
  "typescript": "5.9.2"    // Type system
}
```

---

## 🔍 Error Handling Strategy

```
Error Layer 1: Validation
├─→ Required field check → 400 Bad Request
└─→ Type validation (Zod) → 400 Bad Request

Error Layer 2: Authentication
├─→ Missing token → 401 Unauthorized
├─→ Invalid token → 401 Unauthorized
└─→ Expired token → 401 Unauthorized

Error Layer 3: Authorization
└─→ Insufficient role → 403 Forbidden

Error Layer 4: Resource
└─→ Not found → 404 Not Found

Error Layer 5: Database
└─→ Query failed → 500 Internal Server Error
└─→ Constraint violation → 500 Internal Server Error

All errors:
├─→ Logged to console
├─→ User-friendly message sent
└─→ Audit trail created (if applicable)
```

---

## 📈 Performance Considerations

```
Database Queries
├─→ Use Drizzle's query builder (prevents N+1)
├─→ Eager load relationships (with: {...})
└─→ Index on common fields (id, status, created_at)

Caching
├─→ Client-side caching (frontend's responsibility)
└─→ Server-side: Consider Redis for high-volume reads

Pagination
├─→ Audit logs have limit parameter
└─→ Other endpoints return all (consider adding limits)

Response Times
├─→ JWT validation: ~1ms
├─→ Password hash verification: ~100ms
├─→ Database query: ~10-50ms
└─→ Total typical request: 50-200ms
```

---

## 🔄 Request Lifecycle Example

```
POST /api/bookings with valid JWT

1. Request arrives
   POST /api/bookings
   Header: Authorization: Bearer eyJ...

2. Express middleware
   ├─→ CORS check: ✓
   ├─→ JSON parse: ✓
   └─→ Route match: createBooking handler

3. Auth validation
   ├─→ Extract token
   ├─→ Verify signature
   ├─→ Check expiration: ✓
   └─→ Load user: req.user = {userId: "...", role: "admin"}

4. Handler execution
   ├─→ Validate customer_id and items
   ├─→ Check if customer exists
   ├─→ Create booking record
   ├─→ Create booking_items
   ├─→ Fetch created booking with relations
   └─→ Log audit entry

5. Database operations
   ├─→ INSERT bookings
   ├─→ INSERT booking_items (multiple)
   ├─→ SELECT booking with items
   └─→ INSERT audit_logs

6. Response
   ├─→ Status: 201 Created
   ├─→ Body: {booking object with items}
   └─→ Headers: Content-Type: application/json

7. Frontend receives
   └─→ Updates state with new booking
```

---

## 🎓 Key Design Decisions

### Why Drizzle ORM?
- Type-safe queries
- No runtime overhead
- Simple, intuitive API
- Auto-migration with db:push
- Works with any SQL database

### Why Separate auth.ts?
- Reusable utilities
- Easy to test
- Clear separation of concerns
- Can be used in other routes

### Why logAction() in handlers?
- Fine-grained control
- Can capture before/after states
- Skips sensitive operations if needed
- Explicit audit trail

### Why demo mode?
- Test UI without database
- Deploy everywhere (no DB required)
- Fast prototyping
- Easy debugging

### Why shared/api.ts?
- Single source of truth for types
- Type safety across client & server
- Validation in both layers
- Easy to update API contract

---

This architecture is **production-ready**, **scalable**, and **maintainable**. 🚀
