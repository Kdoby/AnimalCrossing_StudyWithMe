import { Router } from 'express';
import { uploadVideo as uploadMiddleware } from '../middleware/upload.js';
import { getVideos, uploadVideo, getSamples, streamVideo } from '../controllers/videoController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: 주민 공부 영상
 */

/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: 주민 영상 목록 조회
 *     description: 전체 주민 영상 목록을 반환합니다. sort 쿼리로 정렬 가능.
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, popular, name]
 *         description: 정렬 기준 (latest=최신순, popular=인기순, name=이름순)
 *     responses:
 *       200:
 *         description: 영상 목록
 */
router.get('/', getVideos);

/**
 * @swagger
 * /api/videos/samples:
 *   get:
 *     summary: 샘플 영상 목록 조회
 *     description: 홈 랜딩 화면에 표시할 샘플 영상 목록을 반환합니다.
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: 샘플 영상 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   url:
 *                     type: string
 *                     example: /uploads/sample.mp4
 */
router.get('/samples', getSamples);

/**
 * @swagger
 * /api/videos/upload:
 *   post:
 *     summary: 주민 영상 업로드
 *     description: 주민 1명이 공부하는 영상을 업로드합니다. (최대 50MB, 1분 이내)
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [video]
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 영상 파일 (mp4, webm 등)
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 url:
 *                   type: string
 *                   example: /uploads/1716000000000-483920.mp4
 *       400:
 *         description: 파일 없음
 *       500:
 *         description: 저장 실패
 */
router.post('/upload', uploadMiddleware, uploadVideo);

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: 영상 스트리밍
 *     description: 특정 주민 영상을 Range 요청 방식으로 스트리밍합니다.
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 영상 ID
 *     responses:
 *       200:
 *         description: 영상 스트림 (video/mp4)
 *       206:
 *         description: 부분 영상 스트림 (Range 요청)
 *       404:
 *         description: 영상을 찾을 수 없음
 */
router.get('/:id', streamVideo);

export default router;
