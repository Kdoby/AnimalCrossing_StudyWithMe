import { VideoEmbedService } from "../../services/embed/videoService.js";
import { extractYouTubeId } from "../../utils/youtube.js";

export async function getVideos(req, res) {
  try {
    res.json(await VideoEmbedService.getAll(req.query.sort));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "영상 목록을 불러오지 못했습니다." });
  }
}

export async function registerVideo(req, res) {
  const { title, animalName, youtubeUrl, thumbnailUrl } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: "영상 제목이 없습니다." });
  if (!animalName?.trim()) return res.status(400).json({ error: "주민 이름이 없습니다." });
  if (!youtubeUrl?.trim()) return res.status(400).json({ error: "유튜브 URL이 없습니다." });
  if (!extractYouTubeId(youtubeUrl)) return res.status(400).json({ error: "유효한 유튜브 URL이 아닙니다." });
  try {
    res.json(await VideoEmbedService.createVideo({ title, animalName, youtubeUrl, thumbnailUrl }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "저장에 실패했습니다." });
  }
}
