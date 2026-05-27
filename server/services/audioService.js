import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Audio } from '../models/Audio.js';

const UPLOADS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../uploads',
);

const toDto = (v) => ({
  id: v.id,
  title: v.title,
  url: `/uploads/${v.filename}`,
});

// "없음" 옵션 — 항상 첫 번째로 노출
const NONE_OPTION = { id: null, title: '없음', url: null };

// DB에 등록된 오디오가 없을 때 보여줄 기본 목록
// client/public/ 에 있는 정적 파일을 가리킴
const STATIC_FALLBACK = [
  { id: 'static-rain',      title: '빗소리',   url: '/forest_rain_bgm.mp3' },
];

export const AudioService = {
  async createAudio(body, files) {
    const audio = await Audio.create({
      title: body.title.trim(),
      filename: files.audio[0].filename,
      original_name: files.audio[0].originalname,
    });
    return toDto(audio);
  },

  async getAll() {
    const rows = await Audio.findAll({ order: [['created_at', 'DESC']] });
    const list = rows.length > 0 ? rows.map(toDto) : STATIC_FALLBACK;
    return [NONE_OPTION, ...list];
  },

  async getFilePath(id) {
    const audio = await Audio.findByPk(id);
    if (!audio) return null;
    const filePath = path.join(UPLOADS_DIR, audio.filename);
    if (!fs.existsSync(filePath)) return null;
    return filePath;
  },
};
