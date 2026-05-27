import { VideoService } from "../services/videoService.js";
import { streamFile } from "../utils/streamFile.js";

export async function getVideos(req, res) {
  try {
    res.json(await VideoService.getAll(req.query.sort));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "영상 목록을 불러오지 못했습니다." });
  }
}

export async function uploadVideo(req, res) {
  if (!req.files?.video?.[0]) return res.status(400).json({ error: "파일이 없습니다." });
  if (!req.body.title?.trim()) return res.status(400).json({ error: "영상 제목이 없습니다." });
  if (!req.body.animalName?.trim()) return res.status(400).json({ error: "주민 이름이 없습니다." });
  try {
    res.json(await VideoService.createVideo(req.body, req.files));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "저장에 실패했습니다." });
  }
}

export async function getSamples(req, res) {
  try {
    res.json(await VideoService.getSamples());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "샘플 영상을 불러오지 못했습니다." });
  }
}

export async function streamVideo(req, res) {
  try {
    // 실제 파일 리소스로 매핑
    const filePath = await VideoService.getFilePath(req.params.id);
    if (!filePath)
      return res.status(404).json({ error: "영상을 찾을 수 없습니다." });
    streamFile(req, res, filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "스트리밍에 실패했습니다." });
  }
}
