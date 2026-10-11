import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { supabase } from '../config/db.js';
import { requireAdminAuth } from '../middleware/auth.js';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gk_services_default_secret_key_change_me';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Vivek2026+-*/';

/**
 * POST /api/admin/login
 * Validates admin credentials and returns a secure JWT token
 */
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: 'Invalid password. Access denied.',
    });
  }

  const token = jwt.sign(
    { role: 'admin', loggedInAt: Date.now() },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Authentication successful.',
    token,
    user: {
      role: 'admin',
    },
  });
});

/**
 * GET /api/admin/requests
 * Fetch requests with optional filtering and ordering
 * Protected by admin authentication
 */
router.get('/requests', requireAdminAuth, async (req, res) => {
  try {
    const {
      search,
      appliance_type,
      status,
      brand,
      appliance_age,
      date,
      limit = 1000,
    } = req.query;

    let query = supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit, 10) || 1000);

    if (appliance_type) {
      query = query.eq('appliance_type', appliance_type);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (brand) {
      query = query.eq('brand', brand);
    }
    if (appliance_age) {
      query = query.eq('appliance_age', appliance_age);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Fetch requests error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve requests from database.',
        details: error.message,
      });
    }

    let results = data || [];

    // Filter by date if provided (YYYY-MM-DD)
    if (date) {
      results = results.filter((r) => r.created_at && r.created_at.slice(0, 10) === date);
    }

    // Filter by search string across mobile, name, and area/problem
    if (search) {
      const q = search.trim().toLowerCase();
      results = results.filter((r) => {
        const mob = (r.mobile_number || '').toLowerCase();
        const name = (r.customer_name || '').toLowerCase();
        const area = (r.customer_area || '').toLowerCase();
        const desc = (r.problem_description || '').toLowerCase();
        return mob.includes(q) || name.includes(q) || area.includes(q) || desc.includes(q);
      });
    }

    return res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error('Unexpected error in GET /api/admin/requests:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while fetching requests.',
    });
  }
});

/**
 * GET /api/admin/stats
 * Aggregate dashboard statistics
 * Protected by admin authentication
 */
router.get('/stats', requireAdminAuth, async (req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to compute stats.',
        details: error.message,
      });
    }

    const all = rows || [];
    const today = new Date().toISOString().slice(0, 10);

    const total = all.length;
    const todayCount = all.filter((r) => r.created_at && r.created_at.slice(0, 10) === today).length;
    const wmCount = all.filter((r) => r.appliance_type === 'Washing Machine').length;
    const fridgeCount = all.filter((r) => r.appliance_type === 'Refrigerator').length;

    // Brand breakdown
    const brandMap = {};
    all.forEach((r) => {
      if (r.brand) brandMap[r.brand] = (brandMap[r.brand] || 0) + 1;
    });

    // Age breakdown
    const ageMap = {};
    all.forEach((r) => {
      if (r.appliance_age) ageMap[r.appliance_age] = (ageMap[r.appliance_age] || 0) + 1;
    });

    return res.json({
      success: true,
      stats: {
        total,
        todayCount,
        wmCount,
        fridgeCount,
        brands: brandMap,
        ages: ageMap,
      },
    });
  } catch (err) {
    console.error('Unexpected error in GET /api/admin/stats:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while calculating statistics.',
    });
  }
});

/**
 * PATCH /api/admin/requests/:id
 * Update status, notes, or spam flag of a request
 * Protected by admin authentication
 */
router.patch('/requests/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, is_spam } = req.body;

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    if (is_spam !== undefined) updates.is_spam = Boolean(is_spam);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid update fields provided.',
      });
    }

    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update request error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update request in database.',
        details: error.message,
      });
    }

    return res.json({
      success: true,
      message: 'Request updated successfully.',
      data,
    });
  } catch (err) {
    console.error('Unexpected error in PATCH /api/admin/requests/:id:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while updating request.',
    });
  }
});

/**
 * DELETE /api/admin/requests/:id
 * Permanently delete a request
 * Protected by admin authentication
 */
router.delete('/requests/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete request error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete request from database.',
        details: error.message,
      });
    }

    return res.json({
      success: true,
      message: `Request ID ${id} deleted successfully.`,
    });
  } catch (err) {
    console.error('Unexpected error in DELETE /api/admin/requests/:id:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while deleting request.',
    });
  }
});

export default router;
