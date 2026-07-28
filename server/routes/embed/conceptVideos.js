import { Router } from "express";
import { getConceptVideos, registerConceptVideo } from "../../controllers/embed/conceptVideoController.js";

const router = Router();

// GET  /api/concept-videos-embed          — 목록 조회
// POST /api/concept-videos-embed/register — YouTube URL 등록
router.get("/", getConceptVideos);
router.post("/register", registerConceptVideo);

export default router;
