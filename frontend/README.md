# Frontend Client — GK Services Appliance Repairs

High-conversion, mobile-first frontend application for GK Services Washing Machine and Refrigerator Repairs.

---

## 📁 Structure

- **`index.html`**: Customer-facing portal with service booking modal, problem quick-selectors, FAQs, and WhatsApp integration.
- **`spares.html`**: Genuine appliance spare parts catalog with category filters and direct WhatsApp ordering.
- **`admin.html`**: Secure administrative dashboard for managing service requests, updating statuses, taking technician notes, and viewing statistics.
- **`app.js`**: Customer-facing application logic. Sends requests to the configured Backend API at `/api/requests`.
- **`admin.js`**: Admin application logic. Authenticates with JWT via the configured Backend API and manages ticket lifecycle.
- **`config.js`**: Public client configuration (company details, phone numbers, API base URL). The API is hosted at `https://home-appilance.onrender.com`. Contains zero database keys or passwords.
- **`style.css` & `spares.css`**: Complete responsive design styles.
- **`images/`**: High-resolution branding, appliance illustrations, and marketing assets.

---

## Hosted Website

- **Customer Portal**: [https://home-appilance.onrender.com](https://home-appilance.onrender.com)
- **Admin Dashboard**: [https://home-appilance.onrender.com/admin.html](https://home-appilance.onrender.com/admin.html)
- **Spare Parts Catalog**: [https://home-appilance.onrender.com/spares.html](https://home-appilance.onrender.com/spares.html)
