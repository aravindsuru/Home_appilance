# Backend API — GK Services Appliance Repairs

Secure Node.js & Express REST API server connecting the frontend to the database layer (Supabase PostgreSQL).

---

## 🏗️ Architecture & Features

- **Express.js Server**: High-performance, lightweight API server running on port `5000`.
- **Credential Protection**: Database service keys (`SUPABASE_SERVICE_ROLE_KEY`) and master admin credentials are kept strictly on the backend, hidden from client browsers.
- **JWT-Based Authentication**: Admin endpoints require valid signed JSON Web Tokens issued upon password verification.
- **CORS Configured**: Allows cross-origin requests from the frontend client.
- **Input Validation**: Validates 10-digit Indian mobile numbers, appliance types, and brand inputs.
- **Automatic Fallbacks**: Seamlessly handles schema variations (e.g. area column fallbacks).

---

## 🛠️ API Endpoints

### 🌐 Public Endpoints

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/health` | Service health & database connectivity check | None |
| `POST` | `/api/requests` | Submit customer service request | `{ mobile_number, appliance_type, brand, appliance_age, customer_name?, customer_area?, problem_description?, preferred_contact_time? }` |

### 🔒 Admin Endpoints (Require `Authorization: Bearer <token>`)

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/admin/login` | Authenticate admin & receive JWT | `{ password }` |
| `GET` | `/api/admin/requests` | List service requests with search & filters | Query params: `search`, `status`, `appliance_type`, `brand`, `appliance_age`, `date`, `limit` |
| `GET` | `/api/admin/stats` | Aggregated dashboard metrics & breakdowns | None |
| `PATCH` | `/api/admin/requests/:id` | Update request status, notes, or spam status | `{ status?, admin_notes?, is_spam? }` |
| `DELETE` | `/api/admin/requests/:id` | Permanently delete a request | None |

---

## 🚀 Running the Backend

```bash
# 1. Install dependencies (already done)
npm install

# 2. Start server
npm start

# Or start in watch/development mode
npm run dev
```

Server will run at `http://localhost:5000`.
