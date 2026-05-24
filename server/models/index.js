import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'dongsoop',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

export const Video = sequelize.define('Video', {
  filename: { type: DataTypes.STRING, allowNull: false },
  original_name: { type: DataTypes.STRING },
  duration: { type: DataTypes.FLOAT },
  is_sample: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'videos',
  underscored: true,
});

export const ConceptVideo = sequelize.define('ConceptVideo', {
  title: { type: DataTypes.STRING, allowNull: false },
  filename: { type: DataTypes.STRING, allowNull: false },
  original_name: { type: DataTypes.STRING },
  thumbnail_filename: { type: DataTypes.STRING },
}, {
  tableName: 'concept_videos',
  underscored: true,
});

export async function syncDB() {
  await sequelize.sync({ alter: true });
  console.log('DB synced');
}
