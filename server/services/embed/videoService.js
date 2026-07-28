import { VideoEmbed } from "../../models/embed/Video.js";
import { extractYouTubeId } from "../../utils/youtube.js";

const toDto = (v) => {
  const videoId = extractYouTubeId(v.youtube_url);
  return {
    id: v.id,
    title: v.title,
    animalName: v.animal_name,
    youtubeUrl: v.youtube_url,
    thumbnailUrl:
      v.thumbnail_url ??
      (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null),
  };
};

const SORT_ORDER = {
  latest:  [["created_at", "DESC"]],
  popular: [["views", "DESC"], ["created_at", "DESC"]],
  name:    [["animal_name", "ASC"]],
};

export const VideoEmbedService = {
  async getAll(sort = "latest") {
    const order = SORT_ORDER[sort] ?? SORT_ORDER.latest;
    const rows = await VideoEmbed.findAll({ order });
    return rows.map(toDto);
  },

  async createVideo(body) {
    const video = await VideoEmbed.create({
      title: body.title.trim(),
      animal_name: body.animalName.trim(),
      youtube_url: body.youtubeUrl.trim(),
      thumbnail_url: body.thumbnailUrl?.trim() || null,
    });
    return toDto(video);
  },

  async incrementViews(id) {
    const video = await VideoEmbed.findByPk(id);
    if (video) video.increment("views").catch(() => {});
  },
};
