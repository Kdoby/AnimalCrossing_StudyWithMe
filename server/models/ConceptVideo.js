import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ConceptVideo = sequelize.define(
  "ConceptVideo",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    filename: { type: DataTypes.STRING, allowNull: false },
    original_name: { type: DataTypes.STRING },
    thumbnail_filename: { type: DataTypes.STRING },
    duration: { type: DataTypes.FLOAT },
  },
  {
    tableName: "concept_videos",
    underscored: true,
  },
);
