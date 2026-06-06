# Cold Chain Connect - Getting Started Guide

## Prerequisites

- Node.js 16+ 
- PostgreSQL database (local or cloud like Neon)
- pnpm package manager (or npm/yarn)

## Quick Start (5 minutes)

### 1. Clone & Install
```bash
git clone <repo>
cd <project>
pnpm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database - REQUIRED
DATABASE_URL=postgresql://user:password@localhost:5432/coldchain

# Authentication - Generate a random secret
JWT_SECRET=your-super-secret-key-change-this-in-production

# Server
NODE_ENV=development
PORT=8080
```

### 3. Create Database Tables

```bash
pnpm db:push
```

This will:
- Connect to your PostgreSQL database
- Create all required tables (users, customers, products, etc.)
- Set up relationships and constraints

### 4. Create Admin User

You need to create an initial admin user before you can log in. Use the API:

```bash
curl -X POST http://localhost:8080/api/auth/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "YourSecurePassword123!",
    "role": "admin"
  }'
```

Or use a tool like Postman or REST Client.

### 5. Start Development Server

```bash
pnpm dev
```

Open http://localhost:8080 in your browser and log in with:
- **Username:** admin
- **Password:** YourSecurePassword123!

## Database Management

### View Database with Drizzle Studio
```bash
pnpm db:studio
```
Opens an interactive database viewer at http://local.drizzle.studio

### Run Migrations
```bash
pnpm db:push
```

### Generate Migration Files
```bash
pnpm db:generate
```

## Project Structure

```
client/
├── pages/              # Main page components
│   ├── Login.tsx       # Authentication page
│   ├── Dashboard.tsx   # Main 3-card landing page
│   └── modules/        # Business modules
│       ├── Pricing.tsx
│       ├── Customers.tsx
│       ├── Drivers.tsx
│       ├── BookingSummary.tsx
│       ├── Invoicing.tsx
│       ├── Delivery.tsx
│       ├── AccountsReceivable.tsx
│       └── AuditLog.tsx
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication state management
└── App.tsx             # Main app router

server/
├── db/
│   ├── schema.ts       # Database table definitions
│   └── index.ts        # Drizzle ORM client
├── auth.ts             # JWT utilities
├── middleware/         # Express middlewares
│   ├── auth.ts         # JWT validation
│   └── audit-logger.ts # Audit logging
└── routes/             # API route handlers
    ├── auth.ts
    ├── customers.ts
    ├── products.ts
    ├── batches.ts
    ├── drivers.ts
    ├── trucks.ts
    ├── bookings.ts
    ├── invoices.ts
    ├── deliveries.ts
    └── audit.ts

shared/
└── api.ts              # Shared TypeScript types

drizzle.config.ts       # Database migration config
```

## Key Features Implemented

### Authentication
- JWT-based login/logout
- Role-based access control (admin/driver)
- Secure password hashing with bcrypt
- Token refresh mechanism

### Database
- PostgreSQL with Drizzle ORM
- Type-safe schema definitions
- Automatic migrations
- Audit logging on all changes

### Admin UI
- **Dashboard:** 3-card navigation (Information Management, Booking & Dispatch, Audit)
- **Pricing:** Manage product prices
- **Inventory:** Track pallets and batches
- **Customers:** Store management
- **Drivers:** Driver/agent profiles
- **Booking:** Order management (pending → approved → prep → ready)
- **Invoicing:** Create and manage sales invoices
- **Delivery:** Multi-destination truck dispatch
- **Accounts Receivable:** Unpaid invoice tracking
- **Audit Log:** Complete action history

### API Routes

**Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/users` - Create new user

**Information Management**
- `GET/POST /api/products` - Product pricing
- `GET/POST /api/customers` - Customer stores
- `GET/POST /api/drivers` - Driver profiles
- `GET/POST /api/batches` - Inventory batches/pallets

**Business Operations**
- `GET/POST /api/bookings` - Customer orders
- `GET/POST /api/invoices` - Sales invoices
- `GET/POST /api/deliveries` - Truck deliveries
- `GET /api/trucks` - Truck management

**Audit & Reporting**
- `GET /api/audit-logs` - System audit trail

## Development Tips

### Hot Reload
Both client and server auto-reload on changes. Just save and refresh your browser.

### Type Checking
```bash
pnpm typecheck
```

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

## Common Tasks

### Add a New Product
1. Log in as admin
2. Go to Dashboard → Information Management → Pricing
3. Click "Add Product"
4. Enter product name, price, and batch tracking preference

### Create a Customer Store
1. Go to Dashboard → Information Management → Customers
2. Click "Add Customer"
3. Enter store name, location, and contact info

### Create an Order
1. Go to Dashboard → Booking & Dispatch → Order Summary
2. (Note: Mobile app creates bookings; admin views and processes them)
3. Booking auto-transitions: pending → approved → prep → ready

### Generate an Invoice
1. Go to Dashboard → Booking & Dispatch → Invoicing
2. Click "Create Invoice"
3. Select booking to invoice
4. Mark as issued when sent to customer

### Dispatch a Delivery
1. Go to Dashboard → Booking & Dispatch → Delivery/Dispatch
2. Click "New Delivery"
3. Select truck and add invoice destinations
4. Track delivery status from pending → in_transit → completed

### Check Unpaid Invoices
1. Go to Dashboard → Booking & Dispatch → Accounts Receivable
2. View all unpaid invoices sorted by age
3. Mark as paid when payment received

### View System Activity
1. Go to Dashboard → Audit & Reports → Audit Log
2. See all create/update/delete actions by user and timestamp

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Check that PostgreSQL is running and DATABASE_URL is correct.

### JWT Token Expired
- Tokens expire after 24 hours
- Use `/api/auth/refresh` to get a new token
- Or log in again

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### Types Not Found
```bash
pnpm typecheck
# Fix any errors, then:
pnpm dev
```

## Deployment

### Environment Variables for Production

Set these securely in your hosting platform:

```env
DATABASE_URL=postgresql://prod-user:secure-pwd@prod-host/coldchain
JWT_SECRET=very-secure-random-string-min-32-chars
NODE_ENV=production
```

### Build and Start
```bash
pnpm build
pnpm start
```

### Docker Deployment
(Coming soon)

## Support

For issues or questions, check:
1. IMPLEMENTATION_STATUS.md - What's been built
2. server/db/schema.ts - Database structure
3. shared/api.ts - API types
4. Your browser console for client-side errors

## Next Steps

1. ✅ Set up database and create admin user
2. ✅ Test login flow
3. ✅ Add sample data (customers, products, drivers)
4. ⏳ Test booking flow end-to-end
5. ⏳ Set up mobile app (responsive web)
6. ⏳ Configure payment integration
7. ⏳ Deploy to production

Happy building! 🚀
