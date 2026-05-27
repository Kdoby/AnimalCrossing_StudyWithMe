import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ConceptVideo } from "../models/ConceptVideo.js";

const UPLOADS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../uploads",
);

const toDto = (v) => ({
  id: v.id,
  title: v.title,
  videoUrl: `/uploads/${v.filename}`,
  thumbnailUrl: v.thumbnail_filename
    ? `/uploads/${v.thumbnail_filename}`
    : null,
});

export const ConceptVideoService = {
  async getAll() {
    const rows = await ConceptVideo.findAll({
      order: [["created_at", "DESC"]],
    });
    return rows.map(toDto);
  },

  async createConceptVideo(body, files) {
    const video = await ConceptVideo.create({
      title: body.title.trim(),
      filename: files.video[0].filename,
      original_name: files.video[0].originalname,
      thumbnail_filename: files.thumbnail?.[0]?.filename ?? null,
    });
    return toDto(video);
  },

  async getFilePath(id) {
    const video = await ConceptVideo.findByPk(id);
    if (!video) return null;
    const filePath = path.join(UPLOADS_DIR, video.filename);
    if (!fs.existsSync(filePath)) return null;
    return filePath;
  },
};
