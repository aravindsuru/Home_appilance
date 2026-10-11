// ============================================================
// CONFIGURATION — GK Services Frontend Client
// ============================================================
// This configuration contains only public UI settings.
// All database credentials and secret keys are securely stored
// inside backend/.env and NEVER exposed to the browser.
// ============================================================

const CONFIG = {

  // ── Backend API ───────────────────────────────────────────
  // Base URL of the Node.js Express backend service.
  // Change this if deploying the backend to a remote server (e.g. Render, Railway, AWS).
  apiBaseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api',

  // ── Company Details ───────────────────────────────────────
  companyName: 'GK Services',
  tagline: 'Fast. Reliable. Affordable.',
  phoneNumber: '+91 9346598080',        // Displayed on website
  whatsappNumber: '9346598080',           // Digits only for wa.me links
  phoneNumberRaw: '9346598080',           // For tel: links

};
