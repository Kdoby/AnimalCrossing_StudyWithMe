import { ConceptVideoEmbed } from "../../models/embed/ConceptVideo.js";
import { extractYouTubeId } from "../../utils/youtube.js";

const toDto = (v) => {
  const videoId = extractYouTubeId(v.youtube_url);
  return {
    id: v.id,
    title: v.title,
    youtubeUrl: v.youtube_url,
    thumbnailUrl:
      v.thumbnail_url ??
      (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null),
  };
};

export const ConceptVideoEmbedService = {
  async getAll() {
    const rows = await ConceptVideoEmbed.findAll({
      order: [["created_at", "DESC"]],
    });
    return rows.map(toDto);
  },

  async createConceptVideo(body) {
    const video = await ConceptVideoEmbed.create({
      title: body.title.trim(),
      youtube_url: body.youtubeUrl.trim(),
      thumbnail_url: body.thumbnailUrl?.trim() || null,
    });
    return toDto(video);
  },
};
