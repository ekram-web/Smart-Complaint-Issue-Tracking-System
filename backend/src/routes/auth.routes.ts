// Authentication Routes - Map URLs to controller functions
import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { validate, registerSchema, loginSchema } from '../utils/validation';

const router = Router();

// PUBLIC ROUTES (anyone can access)
router.post('/register', validate(registerSchema), register);  // POST /api/auth/register
router.post('/login', validate(loginSchema), login);           // POST /api/auth/login

// PROTECTED ROUTES (must be logged in)
router.get('/profile', authenticate, getProfile);     // GET /api/auth/profile
router.put('/profile', authenticate, updateProfile);  // PUT /api/auth/profile

export default router;
