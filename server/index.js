import dotenv from 'dotenv';
import app from './app.js';
import { syncDB } from './config/database.js';
import { specs, swaggerUi } from './config/swagger.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

syncDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB 연결 실패:', err.message);
    console.log('DB 없이 서버를 시작합니다.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
