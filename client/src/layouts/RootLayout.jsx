import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorFallback';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  );
}
