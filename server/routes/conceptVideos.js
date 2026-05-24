import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConceptVideos, uploadConceptVideo, streamConceptVideo } from '../controllers/conceptVideoController.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/');
    if (allowed) cb(null, true);
    else cb(new Error('영상 또는 이미지 파일만 업로드 가능합니다.'));
  },
});

const router = Router();

router.get('/', getConceptVideos);
router.post('/upload', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), uploadConceptVideo);
router.get('/:id', streamConceptVideo);

export default router;
