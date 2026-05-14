# Allo Inventory Management

A distributed inventory reservation system inspired by Amazon/Flipkart checkout architecture.

The system supports:
- Cart + Checkout flow
- Inventory reservation during checkout
- Automatic reservation expiry
- Reservation confirmation/release flow
- Concurrency-safe inventory handling
- Redis-backed BullMQ workers

---

# Tech Stack

- Next.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis
- BullMQ
- Zustand
- Bootstrap

---

# Running Locally

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Setup Environment Variables

Create:

```txt
.env
```

Add:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/allo_inventory"

DIRECT_URL="postgresql://postgres:password@localhost:5432/allo_inventory"

REDIS_URL="redis://localhost:6379"

RESERVATION_DURATION_MINUTES=10

NODE_ENV=development
```

---

## 3. Run Prisma Migrations

```bash
npx prisma migrate dev
```

---

## 4. Seed Database

```bash
npx prisma db seed
```

This creates:
- sample products
- warehouses
- inventory data

---

## 5. Start Application

```bash
npm run dev
```

Application runs at:

```txt
http://localhost:3000
```

---

## 6. Start Worker

Open another terminal:

```bash
npm run worker
```

This worker is required for:
- reservation expiry
- inventory release jobs

---

# Expiry Mechanism (Production)

Reservations are created ONLY during checkout/payment flow.

When a reservation is created:
1. Inventory is marked as reserved.
2. A BullMQ delayed job is scheduled in Redis.
3. The job executes after:
   `RESERVATION_DURATION_MINUTES`

The worker then:
- checks if reservation is still `PENDING`
- marks it `EXPIRED`
- releases reserved inventory
- updates inventory ledger

This approach was chosen because BullMQ provides:
- reliable delayed jobs
- retries
- distributed processing
- crash recovery

This is more reliable than:
- cron jobs
- polling
- in-memory timers

---

# Production Deployment

## Frontend + APIs
- Vercel

## PostgreSQL
- Prisma Postgres

## Redis
- Upstash Redis

## Worker
- Railway

Worker runs separately using:

```bash
npm run worker
```

---

# Trade-offs / Improvements

## 1. Polling Instead of WebSockets

Inventory updates currently use polling for simplicity.

With more time:
- WebSockets or SSE would be implemented for real-time updates.

## 2. Next.js Route Handlers for APIs

Backend APIs are implemented inside Next.js for faster development and simpler deployment.

With more time:
- backend would be separated into dedicated microservices.

---

## 3. No Authentication

Authentication was intentionally skipped to focus on:
- inventory consistency
- concurrency handling
- reservation architecture

With more time:
- JWT authentication
- user accounts
- order history
would be added.

---

# Key Engineering Concepts

- Distributed inventory reservations
- Concurrency-safe transactions
- PostgreSQL row locking
- BullMQ delayed jobs
- Redis-based workers
- Reservation expiry handling
- Atomic inventory updates
- Commerce checkout architecture

---

# Author

Raj Kumar