# Frontend Client — GK Services Appliance Repairs

High-conversion, mobile-first frontend application for GK Services Washing Machine and Refrigerator Repairs.

---

## 📁 Structure

- **`index.html`**: Customer-facing portal with service booking modal, problem quick-selectors, FAQs, and WhatsApp integration.
- **`spares.html`**: Genuine appliance spare parts catalog with category filters and direct WhatsApp ordering.
- **`admin.html`**: Secure administrative dashboard for managing service requests, updating statuses, taking technician notes, and viewing statistics.
- **`app.js`**: Customer-facing application logic. Sends requests to the Backend API at `/api/requests`.
- **`admin.js`**: Admin application logic. Authenticates with JWT via Backend API `/api/admin/login` and manages ticket lifecycle.
- **`config.js`**: Public client configuration (company details, phone numbers, API base URL). Contains zero database keys or passwords.
- **`style.css` & `spares.css`**: Complete responsive design styles.
- **`images/`**: High-resolution branding, appliance illustrations, and marketing assets.
- **`serve.js`**: Zero-dependency local web server (runs on port 8080).

---

## 🚀 Running the Frontend Locally

```bash
# Start the frontend server (Node.js built-in, zero dependencies)
node frontend/serve.js
```

Then visit:
- **Customer Portal**: [http://localhost:8080/](http://localhost:8080/)
- **Admin Dashboard**: [http://localhost:8080/admin.html](http://localhost:8080/admin.html)
- **Spare Parts Catalog**: [http://localhost:8080/spares.html](http://localhost:8080/spares.html)
