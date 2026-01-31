# Motorcycle Workshop Inventory System

A comprehensive inventory and transaction management system designed for motorcycle workshops. This system facilitates efficient management of items, suppliers, transactions (purchases/sales), and generates insightful reports (inventory, sales, purchases, profit & loss).


## Features

*   **Dashboard:** Displays total counts for Items, Categories, Suppliers, and Transactions. Includes a list of recent data management activities and low stock notifications.
*   **Master Data:** Manage Items (Barang), Categories, and Suppliers.
*   **Transactions:** Record Purchases (Pembelian) and Sales (Penjualan).
*   **Reports:** Generate reports for Sales, Purchases, Inventory Value, and Profit/Loss within date ranges.
*   **Authentication:** Secure Login/Logout with JWT and HttpOnly Cookies.

## Getting Started

### 1. Setup Backend

Navigate to the backend directory:
```bash
cd backend
```

Copy the `.env.example` file into `.env`:

```bash
cp .env.example .env
```
Then, fill in the values accordingly. For example:
```
# DATABASE
# --- DATABASE CONFIGURATION (Neon/PostgreSQL) ---
# Recommended for most uses
DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED="postgresql://user:password@hostname/dbname?sslmode=require"

# Individual Parameters
PGHOST="your-neon-hostname-pooler"
PGHOST_UNPOOLED="your-neon-hostname"
PGUSER="your-db-user"
PGDATABASE="neondb"
PGPASSWORD="your-db-password"

# --- VERCEL POSTGRES TEMPLATES ---
POSTGRES_URL="postgresql://user:password@hostname/dbname?sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://user:password@hostname/dbname?sslmode=require"
POSTGRES_USER="your-db-user"
POSTGRES_HOST="your-neon-hostname-pooler"
POSTGRES_PASSWORD="your-db-password"
POSTGRES_DATABASE="neondb"
POSTGRES_URL_NO_SSL="postgresql://user:password@hostname/dbname"
POSTGRES_PRISMA_URL="postgresql://user:password@hostname/dbname?connect_timeout=15&sslmode=require"

# --- NEON AUTH (Next.js) ---
NEXT_PUBLIC_STACK_PROJECT_ID="your_project_id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your_publishable_key"
STACK_SECRET_SERVER_KEY="your_secret_server_key"

# --- APP CONFIGURATION ---
APP_ENV="development" # development, staging, production
JWT_SECRET_KEY="your_random_secret_key"
FRONTEND_ORIGINS="http://localhost:3000"
```

Install Go dependencies:
```bash
go mod tidy
```

Run the backend server:
```bash
go run main.go
# or for live reload (if air is installed)
air
```

The backend server will start at [http://localhost:8080](http://localhost:8080).

### 2. Setup Frontend

Navigate to the frontend directory:
```bash
cd frontend
```

Create a `.env` file in the `frontend` directory. You can use the provided `.env.example` as a reference:

```bash
cp .env.example .env
```

Ensure the content matches your backend configuration:

```env
# Frontend Environment Variables
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Test Accounts
The system comes with a default admin account seeded automatically:
| Username | Password |
| :--- | :--- |
| admin    | admin123 |


