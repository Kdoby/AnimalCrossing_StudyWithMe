import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Video } from '../models/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../uploads');

export async function uploadVideo(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: '파일이 없습니다.' });
  }
  try {
    const video = await Video.create({
      filename: req.file.filename,
      original_name: req.file.originalname,
      is_sample: false,
    });
    res.json({ id: video.id, url: `/uploads/${video.filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '저장에 실패했습니다.' });
  }
}

export async function getSamples(req, res) {
  try {
    const samples = await Video.findAll({ where: { is_sample: true } });
    res.json(samples.map((v) => ({ id: v.id, url: `/uploads/${v.filename}` })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '샘플 영상을 불러오지 못했습니다.' });
  }
}

export function streamVideo(req, res) {
  const { id } = req.params;
  Video.findByPk(id).then((video) => {
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
