import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './router';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 캐시한 데이터를 몇 분 동안 신선하다고 볼 건지 설정
      staleTime: 1000 * 60 * 5,
      // API 호출 실패 시 재시도할 횟수
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
