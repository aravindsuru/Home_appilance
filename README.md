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

### Deploy the website to Render

Configure the Render web service to use the repository root, with this build command:

```text
npm install --prefix backend
```

Set the start command to:

```text
npm start
```

Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, and `JWT_SECRET` as private Render environment variables. Push these project changes to the branch connected to Render and wait for its deployment to finish.

The deployed site and API will then be available at:

- **Customer Website**: [https://home-appilance.onrender.com](https://home-appilance.onrender.com)
- **Admin Dashboard**: [https://home-appilance.onrender.com/admin.html](https://home-appilance.onrender.com/admin.html)
- **Spare Parts Catalog**: [https://home-appilance.onrender.com/spares.html](https://home-appilance.onrender.com/spares.html)
- **Backend API health check**: [https://home-appilance.onrender.com/api/health](https://home-appilance.onrender.com/api/health)

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
