import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConceptVideo } from '../models/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../uploads');

export async function getConceptVideos(req, res) {
  try {
    const rows = await ConceptVideo.findAll({ order: [['created_at', 'DESC']] });
    res.json(rows.map((v) => ({
      id: v.id,
      title: v.title,
      videoUrl: `/uploads/${v.filename}`,
      thumbnailUrl: v.thumbnail_filename ? `/uploads/${v.thumbnail_filename}` : null,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '목록을 불러오지 못했습니다.' });
  }
}

export async function uploadConceptVideo(req, res) {
  if (!req.file) return res.status(400).json({ error: '파일이 없습니다.' });
  if (!req.body.title?.trim()) return res.status(400).json({ error: '제목이 없습니다.' });

  try {
    const video = await ConceptVideo.create({
      title: req.body.title.trim(),
      filename: req.file.filename,
      original_name: req.file.originalname,
      thumbnail_filename: req.files?.thumbnail?.[0]?.filename ?? null,
    });
    res.json({
      id: video.id,
      title: video.title,
      videoUrl: `/uploads/${video.filename}`,
      thumbnailUrl: video.thumbnail_filename ? `/uploads/${video.thumbnail_filename}` : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '저장에 실패했습니다.' });
  }
}

export function streamConceptVideo(req, res) {
  ConceptVideo.findByPk(req.params.id).then((video) => {
    if (!video) return res.status(404).json({ error: '영상을 찾을 수 없습니다.' });

    const filePath = path.join(UPLOADS_DIR, video.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: '파일이 없습니다.' });

    const stat = fs.statSync(filePath);
    const range = req.headers.range;

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
      const chunkSize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': 'video/mp4' });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}
