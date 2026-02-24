// Ticket Routes - Map URLs to controller functions
import { Router } from 'express';
import {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  addRemark,
} from '../controllers/ticket.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// ALL ROUTES REQUIRE AUTHENTICATION
router.use(authenticate);

// STUDENT can create tickets
router.post('/', createTicket); // POST /api/tickets

// ALL authenticated users can view tickets (filtered by role)
router.get('/', getTickets); // GET /api/tickets
router.get('/:id', getTicket); // GET /api/tickets/:id

// STAFF and ADMIN can update tickets
router.put('/:id', authorize('STAFF', 'ADMIN'), updateTicket); // PUT /api/tickets/:id

// ALL authenticated users can add remarks
router.post('/:id/remarks', addRemark); // POST /api/tickets/:id/remarks

export default router;
