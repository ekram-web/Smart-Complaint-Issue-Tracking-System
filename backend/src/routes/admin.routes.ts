// Admin routes
import { Router } from 'express';
import { getDashboardStats, getUsers, updateUserRole } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate, authorize('ADMIN'));

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

export default router;
