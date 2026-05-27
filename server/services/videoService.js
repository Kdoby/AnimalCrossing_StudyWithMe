import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Video } from "../models/Video.js";

const UPLOADS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../uploads",
);

const toDto = (v) => ({
  id: v.id,
  title: v.title,
  animalName: v.animal_name,
  videoUrl: `/uploads/${v.filename}`,
  thumbnailUrl: v.thumbnail_filename
    ? `/uploads/${v.thumbnail_filename}`
    : null,
});

const SORT_ORDER = {
  latest:  [["created_at", "DESC"]],
  popular: [["views", "DESC"], ["created_at", "DESC"]],
  name:    [["animal_name", "ASC"]],
};

export const VideoService = {
  async getAll(sort = "latest") {
    const order = SORT_ORDER[sort] ?? SORT_ORDER.latest;
    const rows = await Video.findAll({ order });
    return rows.map(toDto);
  },

  async createVideo(body, files) {
    const video = await Video.create({
      title: body.title.trim(),
      animal_name: body.animalName.trim(),
      filename: files.video[0].filename,
      original_name: files.video[0].originalname,
      thumbnail_filename: files.thumbnail?.[0]?.filename ?? null,
      is_sample: false,
    });
    return { id: video.id, url: `/uploads/${video.filename}` };
  },

  async getSamples() {
    const samples = await Video.findAll({ where: { is_sample: true } });
    return samples.map((v) => ({ id: v.id, url: `/uploads/${v.filename}` }));
  },

  async getFilePath(id) {
    const video = await Video.findByPk(id);
    if (!video) return null;
    const filePath = path.join(UPLOADS_DIR, video.filename);
    if (!fs.existsSync(filePath)) return null;
    video.increment("views").catch(() => {});
    return filePath;
  },
};
