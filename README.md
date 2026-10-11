# GK Services Appliance Repairs — 3-Tier Architecture

Professional enterprise separation of **Frontend**, **Backend API**, and **Database Layer** for the GK Services Appliance Repairs platform.

---

## 🏛️ Architecture Overview

Previously, all frontend files, admin logic, and database master keys were mingled together in a single folder, directly querying Supabase from the client's browser.

The codebase is now completely restructured into a **clean 3-tier architecture**:

```
gksolutions33/
│
├── 🌐 frontend/                # Presentation Layer (Client Browser)
│   ├── index.html              # Customer booking portal
│   ├── admin.html              # Admin management dashboard
│   ├── spares.html             # Genuine spare parts catalog
│   ├── app.js                  # Customer client scripts (calls /api/requests)
│   ├── admin.js                # Admin client scripts (JWT auth & API calls)
│   ├── config.js               # Clean public UI configs (NO secrets or passwords)
│   ├── style.css & spares.css  # UI stylesheets
│   ├── images/                 # Branding and imagery
│   ├── serve.js                # Zero-dependency local web server (Port 8080)
│   └── README.md
│
├── ⚙️ backend/                 # Application Layer (Node.js & Express API)
│   ├── src/
│   │   ├── config/db.js        # Supabase / PostgreSQL connection client
│   │   ├── middleware/auth.js  # JWT verification for admin routes
│   │   ├── routes/
│   │   │   ├── requests.js     # POST /api/requests (validation & submission)
│   │   │   ├── admin.js        # Admin login, CRUD, stats, & spam controls
│   │   │   └── health.js       # Healthcheck endpoint
│   │   └── server.js           # Express app, CORS, error handling (Port 5000)
│   ├── .env                    # Real secrets (Supabase keys, JWT secret, Admin password)
│   ├── .env.example            # Environment variables template
│   ├── package.json            # Node.js dependencies
│   └── README.md
│
├── 🗄️ database/               # Data Layer (PostgreSQL / Supabase)
│   ├── schema.sql              # DDL schema: tables, constraints, triggers, RLS, indexes
│   ├── seed.sql                # Realistic sample test records
│   └── README.md               # Database setup guide & data dictionary
│
├── start.bat                   # 1-Click launcher for Windows
├── start.js                    # Concurrent process orchestrator
├── package.json                # Project root runner
└── README.md                   # System documentation
```

---

## 🔒 Security Improvements

1. **Zero Database Secrets in Frontend**: `SUPABASE_SERVICE_ROLE_KEY` is completely removed from the browser client and stored securely in `backend/.env`.
2. **Server-Side Authentication**: Plaintext passwords are no longer in `config.js`. Admin login issues cryptographically signed JWT tokens verified on the server.
3. **Data Shielding**: Customers can never inspect API keys or query other customers' private booking details.
4. **Input Validation**: Indian phone numbers (10 digits starting 6–9), appliance types, and brands are strictly validated server-side.

---

## ⚡ Quick Start

### 1. Start Both Frontend and Backend

Run either of the following:

- **Option A (Terminal)**:
  ```bash
  node start.js
  ```
- **Option B (Windows 1-Click)**:
  Double-click `start.bat`.

### 2. Access the Application

- **Customer Website**: [http://localhost:8080/](http://localhost:8080/)
- **Admin Dashboard**: [http://localhost:8080/admin.html](http://localhost:8080/admin.html)
- **Spare Parts Catalog**: [http://localhost:8080/spares.html](http://localhost:8080/spares.html)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 API Reference

| Endpoint | Method | Access | Purpose |
|---|---|---|---|
| `/api/health` | `GET` | Public | Server & database connection status |
| `/api/requests` | `POST` | Public | Customer service booking |
| `/api/admin/login` | `POST` | Public | Admin authentication (returns JWT) |
| `/api/admin/requests` | `GET` | Admin (JWT) | Fetch service requests with filters |
| `/api/admin/stats` | `GET` | Admin (JWT) | Metric totals, daily counts, breakdowns |
| `/api/admin/requests/:id` | `PATCH` | Admin (JWT) | Update status, admin notes, or spam status |
| `/api/admin/requests/:id` | `DELETE` | Admin (JWT) | Permanently delete request |
