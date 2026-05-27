import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Video = sequelize.define(
  "Video",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    animal_name: { type: DataTypes.STRING, allowNull: false },
    filename: { type: DataTypes.STRING, allowNull: false },
    original_name: { type: DataTypes.STRING },
    thumbnail_filename: { type: DataTypes.STRING },
    duration: { type: DataTypes.FLOAT },
    is_sample: { type: DataTypes.BOOLEAN, defaultValue: false },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "videos",
    underscored: true,
  },
);
