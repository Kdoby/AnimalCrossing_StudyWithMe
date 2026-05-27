import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Audio = sequelize.define(
  "Audio",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    filename: { type: DataTypes.STRING, allowNull: false },
    original_name: { type: DataTypes.STRING },
  },
  {
    tableName: "audios",
    underscored: true,
  },
);
