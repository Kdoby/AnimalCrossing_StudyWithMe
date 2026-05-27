import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../services/conceptVideoService.js', () => ({
  ConceptVideoService: {
    getAll:              vi.fn(),
    createConceptVideo:  vi.fn(),
    getFilePath:         vi.fn(),
  },
}));

vi.mock('../middleware/upload.js', () => ({
  uploadVideo:        vi.fn((req, res, next) => next()),
  uploadConceptVideo: vi.fn((req, res, next) => {
    req.files = { video: [{ filename: 'concept.mp4', originalname: 'concept.mp4' }] };
    next();
  }),
  uploadAudio: vi.fn((req, res, next) => next()),
}));

vi.mock('../utils/streamFile.js', () => ({
  streamFile: vi.fn((req, res) => res.status(206).send('stream')),
}));

import app from '../app.js';
import { ConceptVideoService } from '../services/conceptVideoService.js';
import { uploadConceptVideo as mockUploadMiddleware } from '../middleware/upload.js';
import { streamFile } from '../utils/streamFile.js';

beforeEach(() => vi.clearAllMocks());

// ─────────────────────────────────────────────────────────────────────────────

describe('GET /api/concept-videos', () => {
  it('200 — 컨셉 영상 목록을 반환한다', async () => {
    const mockList = [
      { id: 1, title: '카페 공부방', videoUrl: '/uploads/c1.mp4', thumbnailUrl: null },
      { id: 2, title: '도서관 저녁', videoUrl: '/uploads/c2.mp4', thumbnailUrl: '/uploads/thumb.jpg' },
    ];
    ConceptVideoService.getAll.mockResolvedValue(mockList);

    const res = await request(app).get('/api/concept-videos');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockList);
  });

  it('200 — 영상이 없으면 빈 배열을 반환한다', async () => {
    ConceptVideoService.getAll.mockResolvedValue([]);

    const res = await request(app).get('/api/concept-videos');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('500 — 서비스 오류 시 에러 응답을 반환한다', async () => {
    ConceptVideoService.getAll.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/concept-videos');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/concept-videos/upload', () => {
  it('200 — 컨셉 영상이 정상 업로드된다', async () => {
    const mockResult = {
      id: 1,
      title: '카페 공부방',
      videoUrl: '/uploads/concept.mp4',
      thumbnailUrl: null,
    };
    ConceptVideoService.createConceptVideo.mockResolvedValue(mockResult);

    const res = await request(app)
      .post('/api/concept-videos/upload')
      .send({ title: '카페 공부방' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, title: '카페 공부방' });
    expect(ConceptVideoService.createConceptVideo).toHaveBeenCalledOnce();
  });

  it('200 — 썸네일 포함 업로드 시 thumbnailUrl을 반환한다', async () => {
    mockUploadMiddleware.mockImplementationOnce((req, res, next) => {
      req.files = {
        video: [{ filename: 'concept.mp4', originalname: 'concept.mp4' }],
        thumbnail: [{ filename: 'thumb.jpg', originalname: 'thumb.jpg' }],
      };
      next();
    });
    ConceptVideoService.createConceptVideo.mockResolvedValue({
      id: 2,
      title: '도서관 저녁',
      videoUrl: '/uploads/concept.mp4',
      thumbnailUrl: '/uploads/thumb.jpg',
    });

    const res = await request(app)
      .post('/api/concept-videos/upload')
      .send({ title: '도서관 저녁' });

    expect(res.status).toBe(200);
    expect(res.body.thumbnailUrl).toBe('/uploads/thumb.jpg');
  });

  it('400 — 영상 파일이 없으면 에러를 반환한다', async () => {
    mockUploadMiddleware.mockImplementationOnce((req, res, next) => {
      req.files = {};
      next();
    });

    const res = await request(app)
      .post('/api/concept-videos/upload')
      .send({ title: '카페 공부방' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('파일이 없습니다.');
  });

  it('400 — 제목이 없으면 에러를 반환한다', async () => {
    const res = await request(app)
      .post('/api/concept-videos/upload')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('제목이 없습니다.');
  });

  it('400 — 제목이 공백이면 에러를 반환한다', async () => {
    const res = await request(app)
      .post('/api/concept-videos/upload')
      .send({ title: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('제목이 없습니다.');
  });

  it('500 — 서비스 오류 시 에러 응답을 반환한다', async () => {
    ConceptVideoService.createConceptVideo.mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .post('/api/concept-videos/upload')
      .send({ title: '카페 공부방' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('GET /api/concept-videos/:id', () => {
  it('206 — 컨셉 영상 파일을 스트리밍한다', async () => {
    ConceptVideoService.getFilePath.mockResolvedValue('/server/uploads/concept.mp4');

    const res = await request(app).get('/api/concept-videos/1');

    expect(res.status).toBe(206);
    expect(streamFile).toHaveBeenCalledOnce();
  });

  it('404 — 존재하지 않는 영상은 404를 반환한다', async () => {
    ConceptVideoService.getFilePath.mockResolvedValue(null);

    const res = await request(app).get('/api/concept-videos/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('영상을 찾을 수 없습니다.');
  });

  it('500 — 서비스 오류 시 에러 응답을 반환한다', async () => {
    ConceptVideoService.getFilePath.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/concept-videos/1');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
