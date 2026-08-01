import express from 'express';
import { processResume, getResumes } from '../controllers/resumeController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/process', protect, upload.single('resume'), processResume);
router.get('/', protect, getResumes);

export default router;
