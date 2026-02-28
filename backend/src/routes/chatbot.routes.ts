import { Router } from 'express';
import { chatbotResponse } from '../controllers/chatbot.controller';

const router = Router();

// POST /api/chatbot - Get chatbot response
router.post('/', chatbotResponse);

export default router;
