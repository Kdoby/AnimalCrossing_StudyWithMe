import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Study With Dongsoop API',
      version: '1.0.0',
      description: '동물의 숲 스터디윗미 플랫폼 API 명세',
    },
    servers: [{ url: 'http://localhost:4000' }],
  },
  apis: ['./routes/*.js'],
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
