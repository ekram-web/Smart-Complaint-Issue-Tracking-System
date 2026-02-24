// Category Routes - Map URLs to controller functions
import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// PUBLIC ROUTES (anyone can access)
router.get('/', getCategories);           // GET /api/categories
router.get('/:id', getCategory);          // GET /api/categories/:id

// ADMIN ONLY ROUTES (must be logged in as ADMIN)
router.post('/', authenticate, authorize('ADMIN'), createCategory);      // POST /api/categories
router.put('/:id', authenticate, authorize('ADMIN'), updateCategory);    // PUT /api/categories/:id
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCategory); // DELETE /api/categories/:id

export default router;
