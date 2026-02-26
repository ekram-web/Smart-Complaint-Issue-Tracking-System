// Admin routes
import { Router } from 'express';
import { getDashboardStats, getUsers, updateUserRole } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { validate, updateUserRoleSchema } from '../utils/validation';

const router = Router();

// All routes require admin authentication
router.use(authenticate, authorize('ADMIN'));

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id/role', validate(updateUserRoleSchema), updateUserRole);

export default router;
