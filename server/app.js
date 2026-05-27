import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import videoRoutes from './routes/videos.js';
import conceptVideoRoutes from './routes/conceptVideos.js';
import audioRoutes from './routes/audio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/videos', videoRoutes);
app.use('/api/concept-videos', conceptVideoRoutes);
app.use('/api/audio', audioRoutes);

export default app;
