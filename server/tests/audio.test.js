import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../services/audioService.js', () => ({
  AudioService: {
    createAudio: vi.fn(),
    getAll:      vi.fn(),
    getFilePath: vi.fn(),
  },
}));

vi.mock('../middleware/upload.js', () => ({
  uploadVideo:        vi.fn((req, res, next) => next()),
  uploadConceptVideo: vi.fn((req, res, next) => next()),
  uploadAudio: vi.fn((req, res, next) => {
    req.files = { audio: [{ filename: 'test.mp3', originalname: 'test.mp3' }] };
    next();
  }),
}));

vi.mock('../utils/streamFile.js', () => ({
  streamFile: vi.fn((req, res) => res.status(206).send('stream')),
}));

import app from '../app.js';
import { AudioService } from '../services/audioService.js';
import { uploadAudio as mockUploadMiddleware } from '../middleware/upload.js';
import { streamFile } from '../utils/streamFile.js';

beforeEach(() => vi.clearAllMocks());

describe('POST /api/audio/upload', () => {
  it('200 — 오디오가 정상 업로드된다', async () => {
    AudioService.createAudio.mockResolvedValue({ id: 1, title: '카페 소음', url: '/uploads/test.mp3' });

    const res = await request(app)
      .post('/api/audio/upload')
      .send({ title: '카페 소음' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, title: '카페 소음', url: '/uploads/test.mp3' });
  });

  it('400 — 파일이 없으면 에러를 반환한다', async () => {
    mockUploadMiddleware.mockImplementationOnce((req, res, next) => {
      req.files = {};
      next();
    });

    const res = await request(app)
      .post('/api/audio/upload')
      .send({ title: '카페 소음' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('파일이 없습니다.');
  });

  it('400 — 제목이 없으면 에러를 반환한다', async () => {
    const res = await request(app)
      .post('/api/audio/upload')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('제목이 없습니다.');
  });

  it('500 — 서비스 오류 시 에러 응답을 반환한다', async () => {
    AudioService.createAudio.mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .post('/api/audio/upload')
      .send({ title: '카페 소음' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/audio', () => {
  it('200 — 배경음악 목록을 반환한다', async () => {
    const mockList = [
      { id: null,         title: '없음',   url: null },
      { id: 1,            title: '빗소리', url: '/uploads/rain.mp3' },
      { id: 'static-rain', title: '빗소리', url: '/forest_rain_bgm.mp3' },
    ];
    AudioService.getAll.mockResolvedValue(mockList);

    const res = await request(app).get('/api/audio');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockList);
  });

  it('"없음" 항목이 첫 번째로 포함된다', async () => {
    AudioService.getAll.mockResolvedValue([
      { id: null, title: '없음', url: null },
      { id: 1,    title: '빗소리', url: '/uploads/rain.mp3' },
    ]);

    const res = await request(app).get('/api/audio');

    expect(res.body[0]).toMatchObject({ id: null, title: '없음', url: null });
  });

  it('각 항목에 id, title, url이 있다', async () => {
    AudioService.getAll.mockResolvedValue([
      { id: null, title: '없음',   url: null },
      { id: 1,    title: '빗소리', url: '/uploads/rain.mp3' },
    ]);

    const res = await request(app).get('/api/audio');

    res.body.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('url');
    });
  });

  it('500 — 서비스 오류 시 에러 응답을 반환한다', async () => {
    AudioService.getAll.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/audio');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/audio/:id', () => {
  it('206 — 오디오 파일을 스트리밍한다', async () => {
    AudioService.getFilePath.mockResolvedValue('/server/uploads/rain.mp3');

    const res = await request(app).get('/api/audio/1');

    expect(res.status).toBe(206);
    expect(streamFile).toHaveBeenCalledOnce();
  });

  it('404 — 존재하지 않는 파일은 404를 반환한다', async () => {
    AudioService.getFilePath.mockResolvedValue(null);

    const res = await request(app).get('/api/audio/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('파일을 찾을 수 없습니다.');
  });

  it('500 — 서비스 오류 시 에러 응답을 반환한다', async () => {
    AudioService.getFilePath.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/audio/1');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
