import { ConceptVideoService } from '../services/conceptVideoService.js';
import { streamFile } from '../utils/streamFile.js';

export async function getConceptVideos(req, res) {
  try {
    res.json(await ConceptVideoService.getAll());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '목록을 불러오지 못했습니다.' });
  }
}

export async function uploadConceptVideo(req, res) {
  if (!req.files?.video?.[0]) return res.status(400).json({ error: '파일이 없습니다.' });
  if (!req.body.title?.trim()) return res.status(400).json({ error: '제목이 없습니다.' });
  try {
    res.json(await ConceptVideoService.createConceptVideo(req.body, req.files));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '저장에 실패했습니다.' });
  }
}

export async function streamConceptVideo(req, res) {
  try {
    const filePath = await ConceptVideoService.getFilePath(req.params.id);
    if (!filePath) return res.status(404).json({ error: '영상을 찾을 수 없습니다.' });
    streamFile(req, res, filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '스트리밍에 실패했습니다.' });
  }
}
