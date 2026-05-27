import { streamFile } from "../utils/streamFile.js";
import { AudioService } from "../services/audioService.js";

export async function uploadAudio(req, res) {
  if (!req.files?.audio?.[0]) return res.status(400).json({ error: "파일이 없습니다." });
  if (!req.body.title?.trim()) return res.status(400).json({ error: "제목이 없습니다." });
  try {
    res.json(await AudioService.createAudio(req.body, req.files));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "저장에 실패했습니다." });
  }
}

export async function getAudioList(req, res) {
  try {
    res.json(await AudioService.getAll());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "배경음악 목록을 불러오지 못했습니다." });
  }
}

export async function streamAudio(req, res) {
  try {
    const filePath = await AudioService.getFilePath(req.params.id);
    if (!filePath) return res.status(404).json({ error: "파일을 찾을 수 없습니다." });
    streamFile(req, res, filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "스트리밍에 실패했습니다." });
  }
}
