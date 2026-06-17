# CRM Lead Management System

A full-stack CRM application for managing sales leads built with React, Node.js/Express, and PostgreSQL.

## Tech Stack
- **Frontend:** React, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js, JWT Authentication
- **Database:** PostgreSQL

## Features
- JWT-based login/authentication
- Full CRUD for leads
- Lead notes (add/delete)
- Dashboard with pipeline stats
- Filter by status, source, salesperson
- Search by name, company, email
- Status update panel

## Test Credentials
- **Email:** admin@example.com
- **Password:** password123

## Setup Instructions

### 1. Database
```sql
CREATE DATABASE crm_db;
-- Then run all SQL from the README or db/schema.sql
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env  # fill in your DB credentials
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables (backend/.env)
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key

## Known Limitations
- No email sending / lead enrichment (future feature)
- Single-user system (multi-tenant not yet supported)

## Reflection
Built this CRM to practice full-stack development end-to-end, with focus on clean API design, JWT auth, and a usable UI. The biggest challenge was setting up PostgreSQL joins for lead+notes queries cleanly.


