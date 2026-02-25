// Upload Routes - Handle file uploads
import { Router } from 'express';
import { uploadAttachment, getAttachment } from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth';
import { upload } from '../config/multer';

const router = Router();

// ALL ROUTES REQUIRE AUTHENTICATION
router.use(authenticate);

// Upload file to ticket
// upload.single('file') = Multer middleware that handles the file
router.post('/ticket/:ticketId', upload.single('file'), uploadAttachment);

// Get/download attachment
router.get('/:id', getAttachment);

export default router;
