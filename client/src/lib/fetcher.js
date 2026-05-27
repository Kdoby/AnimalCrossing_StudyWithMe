import axios from 'axios';

const fetcher = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// API 요청 발생 -> 서버 응답 도착 -> Axios 내부: 등록된 인터셉터 탐색 -> 있으면 성공/실패 콜백 실행 -> 호출한 쪽으로 결과 전달
fetcher.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ??
      error.response?.data?.message ??
      '요청에 실패했어요.';
    return Promise.reject(new Error(message));
  },
);

export default fetcher;
