import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const VideoEmbed = sequelize.define(
  "VideoEmbed",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    animal_name: { type: DataTypes.STRING, allowNull: false },
    youtube_url: { type: DataTypes.STRING(512), allowNull: false },
    thumbnail_url: { type: DataTypes.STRING(512) },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_sample: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "videos_embed",
    underscored: true,
  },
);
