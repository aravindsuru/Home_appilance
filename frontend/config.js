// ============================================================
// CONFIGURATION — GK Services Frontend Client
// ============================================================
// This configuration contains only public UI settings.
// All database credentials and secret keys are securely stored
// inside backend/.env and NEVER exposed to the browser.
// ============================================================

const CONFIG = {

  // ── Backend API ───────────────────────────────────────────
  // Hosted API used by the frontend.
  apiBaseUrl: 'https://home-appilance.onrender.com',

  // ── Company Details ───────────────────────────────────────
  companyName: 'GK Services',
  tagline: 'Fast. Reliable. Affordable.',
  phoneNumber: '+91 7396917646',        // Displayed on website
  whatsappNumber: '9346598080',           // Digits only for wa.me links
  phoneNumberRaw: '9346598080',           // For tel: links

};
