import { Router } from "express";
import { uploadConceptVideo as uploadMiddleware } from "../middleware/upload.js";
import {
  getConceptVideos,
  uploadConceptVideo,
  streamConceptVideo,
} from "../controllers/conceptVideoController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ConceptVideos
 *   description: 컨셉 영상 (여러 주민이 함께 있는 분위기 장면)
 */

/**
 * @swagger
 * /api/concept-videos:
 *   get:
 *     summary: 컨셉 영상 목록 조회
 *     description: 전체 컨셉 영상 목록을 최신순으로 반환합니다.
 *     tags: [ConceptVideos]
 *     responses:
 *       200:
 *         description: 컨셉 영상 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                     example: 카페 공부방
 *                   videoUrl:
 *                     type: string
 *                     example: /uploads/video.mp4
 *                   thumbnailUrl:
 *                     type: string
 *                     nullable: true
 *                     example: /uploads/thumb.jpg
 */
router.get("/", getConceptVideos);

/**
 * @swagger
 * /api/concept-videos/upload:
 *   post:
 *     summary: 컨셉 영상 업로드
 *     description: 여러 주민이 함께 있는 분위기 영상과 썸네일(선택)을 업로드합니다. (최대 50MB, 1분 이내)
 *     tags: [ConceptVideos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, video]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 장소/분위기 이름
 *                 example: 도서관 저녁
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 영상 파일
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: 썸네일 이미지 파일 (선택)
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
 *                 videoUrl:
 *                   type: string
 *                 thumbnailUrl:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: 파일 또는 제목 없음
 *       500:
 *         description: 저장 실패
 */
router.post("/upload", uploadMiddleware, uploadConceptVideo);

/**
 * @swagger
 * /api/concept-videos/{id}:
 *   get:
 *     summary: 컨셉 영상 스트리밍
 *     description: 특정 컨셉 영상을 Range 요청 방식으로 스트리밍합니다.
 *     tags: [ConceptVideos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 컨셉 영상 ID
 *     responses:
 *       200:
 *         description: 영상 스트림 (video/mp4)
 *       206:
 *         description: 부분 영상 스트림 (Range 요청)
 *       404:
 *         description: 영상을 찾을 수 없음
 */
router.get("/:id", streamConceptVideo);

export default router;
