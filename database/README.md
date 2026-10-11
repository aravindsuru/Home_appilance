# Database Layer — GK Services Repairs

This directory manages the database schema, seeds, migrations, and access policies for the GK Services Appliance Repairs platform.

---

## 📁 Files

- **`schema.sql`**: Full PostgreSQL DDL script creating tables, constraints, automatic `updated_at` triggers, RLS policies, and performance indexes.
- **`seed.sql`**: Realistic test records for washing machines and refrigerators to populate the admin dashboard.

---

## 🗄️ Database Schema: `service_requests`

| Column | Type | Constraints / Default | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | Primary Key | Unique booking ID |
| `mobile_number` | `TEXT` | NOT NULL | Customer 10-digit phone number |
| `appliance_type` | `TEXT` | CHECK in ('Washing Machine', 'Refrigerator') | Type of appliance needing repair |
| `brand` | `TEXT` | NOT NULL | Brand (LG, Samsung, Whirlpool, etc.) |
| `appliance_age` | `TEXT` | NOT NULL | Age range of appliance |
| `customer_name` | `TEXT` | DEFAULT '' | Customer's full name (optional) |
| `customer_area` | `TEXT` | DEFAULT '' | Neighborhood/locality (e.g., Madhapur) |
| `problem_description` | `TEXT` | DEFAULT '' | Description of malfunction/symptoms |
| `preferred_contact_time` | `TEXT` | DEFAULT '' | Preferred time slot for service visit |
| `status` | `TEXT` | DEFAULT 'New', CHECK in ('New', 'Contacted', 'Service Scheduled', 'Completed', 'Cancelled') | Lifecycle state of ticket |
| `admin_notes` | `TEXT` | DEFAULT '' | Private internal technician notes |
| `is_spam` | `BOOLEAN` | DEFAULT FALSE | Flag to filter out test/spam submissions |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Timestamp when request was submitted |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Automatically maintained timestamp |

---

## 🚀 Setup Instructions (Supabase)

1. **Log in to Supabase**: Open [supabase.com](https://supabase.com) and go to your project.
2. **Open SQL Editor**: In the left sidebar, click **SQL Editor**.
3. **Execute Schema**:
   - Copy the entire contents of `database/schema.sql`.
   - Paste into the query editor and click **Run**.
4. **(Optional) Execute Seed Data**:
   - Copy the contents of `database/seed.sql`.
   - Paste and click **Run** to load initial sample requests into your admin dashboard.
5. **Get API Keys for Backend**:
   - Go to **Project Settings** → **API**.
   - Copy the **Project URL** (`https://<project-ref>.supabase.co`).
   - Copy the **`service_role` key** (Secret).
   - Place these inside `backend/.env`.

---

## 🛡️ Security & Row-Level Security (RLS)

- **RLS Enabled**: Row-Level Security is strictly enabled on `service_requests`.
- **Public (Anon)**: Only allowed `INSERT` operations (customer booking). Customers cannot view, edit, or delete any requests.
- **Service Role**: Utilized exclusively by the Node.js Express **backend**, bypassing RLS securely on the server side to power the admin dashboard.
- **No Keys on Frontend**: Client browsers never receive the `service_role` key or database secrets.
