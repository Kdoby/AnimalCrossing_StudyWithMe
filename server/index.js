import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import videoRoutes from './routes/videos.js';
import conceptVideoRoutes from './routes/conceptVideos.js';
import audioRoutes from './routes/audio.js';
import { syncDB } from './models/index.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/videos', videoRoutes);
app.use('/api/concept-videos', conceptVideoRoutes);
app.use('/api/audio', audioRoutes);

syncDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB 연결 실패:', err.message);
    console.log('DB 없이 서버를 시작합니다.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
