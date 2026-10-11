import { Router } from 'express';
import { supabase } from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  let dbStatus = 'connected';
  let dbError = null;

  try {
    const { error } = await supabase.from('service_requests').select('id').limit(1);
    if (error) {
      dbStatus = 'error';
      dbError = error.message;
    }
  } catch (err) {
    dbStatus = 'unreachable';
    dbError = err.message;
  }

  res.json({
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'GK Services API',
    database: {
      status: dbStatus,
      error: dbError,
    },
  });
});

export default router;
