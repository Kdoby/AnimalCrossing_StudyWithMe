import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

// ── 모킹 (앱 import 전에 선언해야 vitest가 호이스팅 처리) ─────────────────────

vi.mock('../services/videoService.js', () => ({
  VideoService: {
    getAll:      vi.fn(),
    getSamples:  vi.fn(),
    createVideo: vi.fn(),
    getFilePath: vi.fn(),
  },
}));

vi.mock('../middleware/upload.js', () => ({
  uploadVideo: vi.fn((req, res, next) => {
    req.files = { video: [{ filename: 'test.mp4', originalname: 'test.mp4' }] };
    next();
  }),
  uploadConceptVideo: vi.fn((req, res, next) => next()),
  uploadAudio: vi.fn((req, res, next) => next()),
}));

vi.mock('../utils/streamFile.js', () => ({
  streamFile: vi.fn((req, res) => res.status(206).send('stream')),
}));

import app from '../app.js';
import { VideoService } from '../services/videoService.js';
import { uploadVideo as mockUploadMiddleware } from '../middleware/upload.js';
import { streamFile } from '../utils/streamFile.js';

// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => vi.clearAllMocks());

describe('GET /api/videos', () => {
  it('200 — 영상 목록을 반환한다', async () => {
    const mockList = [
      { id: 1, title: '도서관 뽀야미', animalName: '뽀야미', videoUrl: '/uploads/a.mp4', thumbnailUrl: null },
      { id: 2, title: '카페 잭슨', animalName: '잭슨', videoUrl: '/uploads/b.mp4', thumbnailUrl: null },
    ];
    VideoService.getAll.mockResolvedValue(mockList);

    const res = await request(app).get('/api/videos');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockList);
  });

  it('sort 파라미터를 서비스에 전달한다', async () => {
    VideoService.getAll.mockResolvedValue([]);

    await request(app).get('/api/videos?sort=name');

    expect(VideoService.getAll).toHaveBeenCalledWith('name');
  });

  it('sort 파라미터가 없으면 undefined를 전달한다', async () => {
    VideoService.getAll.mockResolvedValue([]);

    await request(app).get('/api/videos');

    expect(VideoService.getAll).toHaveBeenCalledWith(undefined);
  });

  it('500 — 서비스 오류 시 에러 응답을 반환한다', async () => {
    VideoService.getAll.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/videos');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('GET /api/videos/samples', () => {
  it('200 — 샘플 영상 목록을 반환한다', async () => {
    const mockSamples = [{ id: 1, url: '/uploads/sample.mp4' }];
    VideoService.getSamples.mockResolvedValue(mockSamples);

    const res = await request(app).get('/api/videos/samples');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockSamples);
  });

  it('500 — 서비스 오류 시 에러 응답을 반환한다', async () => {
    VideoService.getSamples.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/videos/samples');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/videos/upload', () => {
  it('200 — 영상이 정상 업로드된다', async () => {
    VideoService.createVideo.mockResolvedValue({ id: 1, url: '/uploads/test.mp4' });

    const res = await request(app)
      .post('/api/videos/upload')
      .send({ title: '도서관 뽀야미', animalName: '뽀야미' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, url: '/uploads/test.mp4' });
    expect(VideoService.createVideo).toHaveBeenCalledOnce();
  });

  it('400 — 영상 파일이 없으면 에러를 반환한다', async () => {
    mockUploadMiddleware.mockImplementationOnce((req, res, next) => {
      req.files = {};
      next();
    });

    const res = await request(app)
      .post('/api/videos/upload')
      .send({ title: '도서관 뽀야미', animalName: '뽀야미' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('파일이 없습니다.');
  });

  it('400 — 제목이 없으면 에러를 반환한다', async () => {
    const res = await request(app)
      .post('/api/videos/upload')
      .send({ animalName: '뽀야미' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('영상 제목이 없습니다.');
  });

  it('400 — 주민 이름이 없으면 에러를 반환한다', async () => {
    const res = await request(app)
      .post('/api/videos/upload')
      .send({ title: '도서관 뽀야미' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('주민 이름이 없습니다.');
  });

  it('400 — 제목이 공백이면 에러를 반환한다', async () => {
    const res = await request(app)
      .post('/api/videos/upload')
      .send({ title: '   ', animalName: '뽀야미' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('영상 제목이 없습니다.');
  });

  it('500 — 서비스 오류 시 에러 응답을 반환한다', async () => {
    VideoService.createVideo.mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .post('/api/videos/upload')
      .send({ title: '도서관 뽀야미', animalName: '뽀야미' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('GET /api/videos/:id', () => {
  it('206 — 영상 파일을 스트리밍한다', async () => {
    VideoService.getFilePath.mockResolvedValue('/server/uploads/test.mp4');

    const res = await request(app).get('/api/videos/1');

    expect(res.status).toBe(206);
    expect(streamFile).toHaveBeenCalledOnce();
  });

  it('404 — 존재하지 않는 영상은 404를 반환한다', async () => {
    VideoService.getFilePath.mockResolvedValue(null);

    const res = await request(app).get('/api/videos/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('영상을 찾을 수 없습니다.');
  });

  it('500 — 서비스 오류 시 에러 응답을 반환한다', async () => {
    VideoService.getFilePath.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/videos/1');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
