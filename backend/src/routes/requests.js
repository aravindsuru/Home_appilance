import { Router } from 'express';
import { supabase } from '../config/db.js';

const router = Router();

/**
 * POST /api/requests
 * Public endpoint: Customer submits a service booking
 */
router.post('/', async (req, res) => {
  try {
    const {
      mobile_number,
      appliance_type,
      brand,
      appliance_age,
      customer_name = '',
      customer_area = '',
      problem_description = '',
      preferred_contact_time = '',
    } = req.body;

    // Validation
    const cleanMobile = String(mobile_number || '').replace(/\D/g, '').slice(0, 10);
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Indian mobile number. Please enter a valid 10-digit mobile number.',
      });
    }

    if (!appliance_type || !['Washing Machine', 'Refrigerator'].includes(appliance_type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid appliance type. Must be "Washing Machine" or "Refrigerator".',
      });
    }

    if (!brand || !brand.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Appliance brand is required.',
      });
    }

    if (!appliance_age || !appliance_age.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Appliance age is required.',
      });
    }

    const payload = {
      mobile_number: cleanMobile,
      appliance_type: appliance_type.trim(),
      brand: brand.trim(),
      appliance_age: appliance_age.trim(),
      customer_name: (customer_name || '').trim(),
      customer_area: (customer_area || '').trim(),
      problem_description: (problem_description || '').trim(),
      preferred_contact_time: (preferred_contact_time || '').trim(),
      status: 'New',
      is_spam: false,
    };

    let { data, error } = await supabase
      .from('service_requests')
      .insert([payload])
      .select()
      .single();

    // Fallback: If customer_area column does not exist yet in Supabase schema
    if (error && error.message && error.message.includes('customer_area')) {
      const fallbackPayload = { ...payload };
      delete fallbackPayload.customer_area;
      const areaNote = `[Area: ${payload.customer_area}]`;
      fallbackPayload.problem_description = fallbackPayload.problem_description
        ? `${areaNote} ${fallbackPayload.problem_description}`
        : areaNote;

      const retryRes = await supabase
        .from('service_requests')
        .insert([fallbackPayload])
        .select()
        .single();

      data = retryRes.data;
      error = retryRes.error;
    }

    if (error) {
      console.error('Database insert error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to record service request in database.',
        details: error.message,
      });
    }

    // Optional webhook notification (non-blocking)
    const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data || payload),
      }).catch((webhookErr) => {
        console.warn('Webhook delivery notice:', webhookErr.message);
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Service request booked successfully.',
      data,
    });
  } catch (err) {
    console.error('Unexpected error in POST /api/requests:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing the request.',
    });
  }
});

export default router;
