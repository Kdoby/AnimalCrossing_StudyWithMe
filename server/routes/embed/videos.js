import { Router } from "express";
import { getVideos, registerVideo } from "../../controllers/embed/videoController.js";

const router = Router();

// GET  /api/videos-embed        — 목록 조회 (sort 쿼리 지원)
// POST /api/videos-embed/register — YouTube URL 등록 (파일 업로드 없음)
router.get("/", getVideos);
router.post("/register", registerVideo);

export default router;
