import axios from 'axios';

const fetcher = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

fetcher.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message ?? '요청에 실패했어요.';
    return Promise.reject(new Error(message));
  }
);

export default fetcher;
