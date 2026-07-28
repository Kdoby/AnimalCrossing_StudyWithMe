import { ConceptVideoEmbedService } from "../../services/embed/conceptVideoService.js";
import { extractYouTubeId } from "../../utils/youtube.js";

export async function getConceptVideos(req, res) {
  try {
    res.json(await ConceptVideoEmbedService.getAll());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "목록을 불러오지 못했습니다." });
  }
}

export async function registerConceptVideo(req, res) {
  const { title, youtubeUrl, thumbnailUrl } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: "제목이 없습니다." });
  if (!youtubeUrl?.trim()) return res.status(400).json({ error: "유튜브 URL이 없습니다." });
  if (!extractYouTubeId(youtubeUrl)) return res.status(400).json({ error: "유효한 유튜브 URL이 아닙니다." });
  try {
    res.json(await ConceptVideoEmbedService.createConceptVideo({ title, youtubeUrl, thumbnailUrl }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "저장에 실패했습니다." });
  }
}
