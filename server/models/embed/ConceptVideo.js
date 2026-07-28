import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const ConceptVideoEmbed = sequelize.define(
  "ConceptVideoEmbed",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    youtube_url: { type: DataTypes.STRING(512), allowNull: false },
    thumbnail_url: { type: DataTypes.STRING(512) },
  },
  {
    tableName: "concept_videos_embed",
    underscored: true,
  },
);
