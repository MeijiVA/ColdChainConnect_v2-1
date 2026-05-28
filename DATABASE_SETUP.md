# Cold Chain Connect - Backend Setup Guide

## 📋 Overview

This guide walks you through setting up the PostgreSQL database and configuring the backend API for Cold Chain Connect.

## Phase 1: PostgreSQL Installation (Native)

### For macOS (using Homebrew)

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

### For Ubuntu/Debian Linux

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start the PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### For Windows

1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run the installer and note the password you set for the `postgres` user
3. Accept default port 5432
4. Complete the installation
5. PostgreSQL will start automatically

---

## Phase 2: Database Setup

### Step 1: Connect to PostgreSQL

**On macOS/Linux:**
```bash
psql -U postgres
```

**On Windows (Command Prompt):**
```cmd
psql -U postgres
```

### Step 2: Create Database & User

Run these SQL commands in the `psql` terminal:

```sql
-- Create the database
CREATE DATABASE coldchain_dev;

-- Create a dedicated user (recommended for production)
CREATE USER coldchain_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
ALTER ROLE coldchain_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE coldchain_dev TO coldchain_user;
GRANT ALL ON SCHEMA public TO coldchain_user;

-- Exit psql
\q
```

### Step 3: Update .env Configuration

Edit `.env` in your project root:

```env
DATABASE_URL=postgresql://coldchain_user:your_secure_password@localhost:5432/coldchain_dev
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=development
PORT=8080
```

> **⚠️ Replace:**
> - `your_secure_password` with the password you set above
> - `your-super-secret-key` with a strong random key (use `openssl rand -base64 32`)

---

## Phase 3: Initialize Database Schema

Once your `.env` is configured, initialize the database:

```bash
# Install dependencies (if not already done)
pnpm install

# Push Drizzle schema to PostgreSQL
pnpm db:push

# This will:
# ✓ Create all tables (users, customers, products, drivers, etc.)
# ✓ Set up relationships and constraints
# ✓ Configure timestamps and defaults
```

---

## Phase 4: Seed Demo Data

Populate the database with sample data for testing:

```bash
pnpm db:seed
```

This creates:
- ✅ Admin user: `admin` / `admin123`
- ✅ 3 Driver users: `driver1`, `driver2`, `driver3` / `driver123`
- ✅ 4 Sample products (Chicken, Pork, Fish, Beef)
- ✅ 3 Sample customers (Makati, BGC, Tagaytay)
- ✅ 3 Sample drivers with profiles
- ✅ 3 Trucks (Metro Manila, Cavite, Tagaytay districts)
- ✅ 4 Inventory batches/pallets

---

## Phase 5: Start Development Server

```bash
pnpm dev
```

The server starts on `http://localhost:8080`

---

## Phase 6: Test API Endpoints

### Option A: Using cURL

```bash
# 1. Login to get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Response: { "token": "eyJhbGc...", "user": { "id": "...", "username": "admin", "role": "admin" } }

# 2. Copy the token, then list customers:
curl -X GET http://localhost:8080/api/customers \
  -H "Authorization: Bearer <paste_token_here>"

# 3. Get products:
curl -X GET http://localhost:8080/api/products \
  -H "Authorization: Bearer <paste_token_here>"
```

### Option B: Using Postman/Insomnia

1. Import the collection below or create requests manually
2. Set base URL: `http://localhost:8080`
3. Create `POST /api/auth/login` request with body:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
4. Copy token from response
5. Use token in `Authorization: Bearer <token>` header for all subsequent requests

### Option C: Using Drizzle Studio (GUI)

```bash
pnpm db:studio
```

This opens a web interface to browse and query your database directly.

---

## All Available Endpoints

### Authentication (No auth required)
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/users` - Create new user (admin only)

### Customers (Admin only for POST/PATCH/DELETE)
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Products (Admin only for POST/PATCH/DELETE)
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Drivers (Admin only for POST/PATCH/DELETE)
- `GET /api/drivers` - List all drivers
- `POST /api/drivers` - Create driver
- `PATCH /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Trucks (Admin only for POST/PATCH/DELETE)
- `GET /api/trucks` - List all trucks
- `POST /api/trucks` - Create truck
- `PATCH /api/trucks/:id` - Update truck
- `DELETE /api/trucks/:id` - Delete truck

### Inventory Batches/Pallets (Admin only)
- `GET /api/batches` - List all batches
- `POST /api/batches` - Create batch
- `PATCH /api/batches/:id` - Update batch
- `DELETE /api/batches/:id` - Delete batch

### Bookings
- `GET /api/bookings` - List bookings (filter by ?status=pending|approved|prep|ready)
- `POST /api/bookings` - Create booking (driver or admin)
- `PATCH /api/bookings/:id/status` - Update booking status (admin only)

### Invoices (Admin only)
- `GET /api/invoices` - List invoices (filter by ?status or ?unpaid=true)
- `POST /api/invoices` - Create invoice
- `PATCH /api/invoices/:id/status` - Update invoice status
- `PATCH /api/invoices/:id/payment-status` - Update payment status

### Deliveries (Admin only for POST/PATCH)
- `GET /api/deliveries` - List deliveries (filter by ?status)
- `POST /api/deliveries` - Create delivery
- `PATCH /api/deliveries/:id/status` - Update delivery status
- `PATCH /api/deliveries/:deliveryId/items/:itemId/status` - Update delivery item status (admin or driver)

### Audit Logs (Admin only)
- `GET /api/audit-logs` - List audit logs (filter by ?user_id, ?action, ?start_date, ?end_date)

---

## Demo Mode (Without Database)

If DATABASE_URL is not set, the app runs in demo mode:
- ✓ Serves demo data instead of database queries
- ✓ No persistence (writes don't save)
- ✓ Perfect for testing frontend UI without setup

To test in demo mode:
1. Leave `DATABASE_URL` empty in `.env`
2. Run `pnpm dev`
3. Endpoints return demo data

---

## Troubleshooting

### "Database connection failed"
- Ensure PostgreSQL is running: `brew services start postgresql@15` (macOS)
- Check DATABASE_URL is correct in .env
- Verify the user/password combination

### "Could not find the "libpq" library"
```bash
# macOS fix:
brew install libpq
brew link libpq --force

# Ubuntu fix:
sudo apt install libpq-dev
```

### "Port 5432 already in use"
PostgreSQL is already running. Either stop it or use a different port:
```bash
# Use different port in DATABASE_URL:
DATABASE_URL=postgresql://user:pass@localhost:5433/coldchain_dev
```

### "createdb: could not connect to database server"
- Ensure PostgreSQL service is running
- Try connecting manually: `psql -U postgres`

### Reset Everything (Start Fresh)
```bash
# Drop the database
psql -U postgres -c "DROP DATABASE IF EXISTS coldchain_dev;"

# Recreate it
psql -U postgres -c "CREATE DATABASE coldchain_dev;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE coldchain_dev TO coldchain_user;"

# Run db:push and db:seed again
pnpm db:push
pnpm db:seed
```

---

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random key: `openssl rand -base64 32`
- [ ] Use a strong password for the database user
- [ ] Enable SSL/TLS on PostgreSQL
- [ ] Use environment variables for sensitive data (not committed to git)
- [ ] Set `NODE_ENV=production`
- [ ] Run `pnpm build` and test the production bundle
- [ ] Set up database backups
- [ ] Enable HTTPS on the frontend
- [ ] Test all endpoints with production data

---

## Next Steps

1. ✅ Install PostgreSQL (this guide)
2. ✅ Create database and user
3. ✅ Update .env configuration
4. ✅ Run `pnpm db:push` to create tables
5. ✅ Run `pnpm db:seed` to populate demo data
6. ✅ Run `pnpm dev` to start the server
7. ✅ Test endpoints using cURL/Postman
8. ✅ Build frontend that calls real API endpoints
9. ✅ Deploy to production (Netlify/Vercel)

---

## Support

- **Drizzle ORM Docs**: https://orm.drizzle.team
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Express Docs**: https://expressjs.com
