// Authentication Routes - Map URLs to controller functions
import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// PUBLIC ROUTES (anyone can access)
router.post('/register', register);  // POST /api/auth/register
router.post('/login', login);        // POST /api/auth/login

// PROTECTED ROUTES (must be logged in)
router.get('/profile', authenticate, getProfile);  // GET /api/auth/profile

export default router;
