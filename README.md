# CRM Lead Management System

A full-stack CRM (Customer Relationship Management) application for managing sales leads, built as a portfolio project.

## Tech Stack

- **Frontend:** React.js (Create React App), Tailwind CSS, React Router v6, Axios
- **Backend:** Node.js, Express.js, JWT Authentication, bcryptjs
- **Database:** PostgreSQL
- **Tools:** Git, Nodemon, Morgan

## Features

- JWT-based login and authentication
- Protected routes (redirect to login if not authenticated)
- Dashboard with real-time pipeline stats (total, new, qualified, won, lost leads)
- Full CRUD for leads (create, view, edit, delete)
- Lead notes — add and delete notes per lead
- Quick status update panel on lead detail page
- Filter leads by status, lead source, and assigned salesperson
- Search leads by name, company, or email
- Responsive UI with clean card-based design

## Project Structure

crm-system/

├── backend/

│   ├── src/

│   │   ├── config/        # PostgreSQL connection

│   │   ├── controllers/   # Auth, leads, notes, dashboard, users

│   │   ├── middleware/    # JWT auth middleware

│   │   └── routes/        # Express route definitions

│   ├── .env               # Environment variables (not committed)

│   └── package.json

├── frontend/

│   ├── src/

│   │   ├── components/    # Navbar, StatusBadge, LoadingSpinner, ProtectedRoute

│   │   ├── context/       # AuthContext (JWT + localStorage)

│   │   ├── pages/         # Login, Dashboard, LeadsList, LeadForm, LeadDetail

│   │   ├── services/      # Axios API service

│   │   └── utils/         # Status colors, formatters, constants

│   └── package.json

└── README.md

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/mdewmini/crm-system.git
cd crm-system
```

### 2. Database Setup

Open psql and run:

```sql
CREATE DATABASE crm_db;
\c crm_db

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'salesperson',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  lead_name VARCHAR(150) NOT NULL,
  company_name VARCHAR(150),
  email VARCHAR(150),
  phone VARCHAR(50),
  lead_source VARCHAR(100),
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'New',
  deal_value DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Then seed the admin user (generate hash first):
```bash
cd backend
node -e "const b = require('bcryptjs'); b.hash('password123', 10).then(h => console.log(h));"
```

```sql
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@example.com', 'PASTE_HASH_HERE', 'admin');
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

PORT=8000

DB_HOST=localhost

DB_PORT=5432

DB_NAME=crm_db

DB_USER=your_postgres_username

DB_PASSWORD=

JWT_SECRET=crm_super_secret_key_2024

NODE_ENV=development

Start the backend:
```bash
npm run dev
```

Backend runs on: `http://localhost:8000`

### 4. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## Test Credentials

| Field    | Value               |
|----------|---------------------|
| Email    | admin@example.com   |
| Password | password123         |

## API Endpoints

| Method | Endpoint                  | Description          | Auth |
|--------|---------------------------|----------------------|------|
| POST   | /api/auth/login           | Login                | No   |
| GET    | /api/auth/me              | Get current user     | Yes  |
| GET    | /api/dashboard            | Dashboard stats      | Yes  |
| GET    | /api/leads                | Get all leads        | Yes  |
| POST   | /api/leads                | Create lead          | Yes  |
| GET    | /api/leads/:id            | Get lead by ID       | Yes  |
| PUT    | /api/leads/:id            | Update lead          | Yes  |
| DELETE | /api/leads/:id            | Delete lead          | Yes  |
| POST   | /api/leads/:id/notes      | Add note to lead     | Yes  |
| DELETE | /api/notes/:id            | Delete note          | Yes  |
| GET    | /api/users                | Get all users        | Yes  |

## Known Issues & Notes

- Port 5000 conflicts with macOS AirPlay Receiver — backend runs on port 8000
- No password reset or email verification (future feature)
- Single admin user system (multi-user support planned)

## Reflection

This project was built to practice full-stack development end-to-end. Key learning areas included JWT authentication flow, PostgreSQL relational queries with JOINs, React context for global auth state, and debugging CORS issues in a local development environment.
