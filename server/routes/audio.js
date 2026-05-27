import { Router } from 'express';
import { uploadAudio as uploadMiddleware } from '../middleware/upload.js';
import { uploadAudio, getAudioList, streamAudio } from '../controllers/audioController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Audio
 *   description: 배경음악
 */

/**
 * @swagger
 * /api/audio:
 *   get:
 *     summary: 배경음악 목록 조회
 *     description: 공부방에서 선택 가능한 배경음악 목록을 반환합니다. DB에 등록된 파일이 없으면 기본 목록을 반환합니다.
 *     tags: [Audio]
 *     responses:
 *       200:
 *         description: 배경음악 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     nullable: true
 *                   title:
 *                     type: string
 *                     example: 빗소리
 *                   url:
 *                     type: string
 *                     nullable: true
 *                     example: /uploads/rain.mp3
 */
/**
 * @swagger
 * /api/audio/upload:
 *   post:
 *     summary: 배경음악 업로드
 *     description: 오디오 파일을 업로드하고 DB에 등록합니다. 이후 배경음악 목록에 표시됩니다.
 *     tags: [Audio]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, audio]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 배경음악 이름
 *                 example: 카페 소음
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: 오디오 파일 (mp3, wav 등)
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
 *                 title:
 *                   type: string
 *                 url:
 *                   type: string
 *                   example: /uploads/1716000000000-483920.mp3
 *       400:
 *         description: 파일 또는 제목 없음
 *       500:
 *         description: 저장 실패
 */
router.post('/upload', uploadMiddleware, uploadAudio);

router.get('/', getAudioList);

/**
 * @swagger
 * /api/audio/{id}:
 *   get:
 *     summary: 배경음악 스트리밍
 *     tags: [Audio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 오디오 스트림
 *       404:
 *         description: 파일을 찾을 수 없음
 */
router.get('/:id', streamAudio);

export default router;
