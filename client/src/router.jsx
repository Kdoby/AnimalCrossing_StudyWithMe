import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RootLayout from './layouts/RootLayout';

const HomePage           = lazy(() => import('./pages/Home'));
const GalleryPage        = lazy(() => import('./pages/Gallery'));
const ConceptGalleryPage = lazy(() => import('./pages/ConceptGallery'));
const StudyRoomPage      = lazy(() => import('./pages/StudyRoom'));
const UploadPage         = lazy(() => import('./pages/Upload'));

const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream">
    <span className="text-4xl animate-float">🌿</span>
  </div>
);

const wrap = (Page) => (
  <Suspense fallback={<Fallback />}>
    <Page />
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/',           element: wrap(HomePage) },
      { path: '/zoom',       element: wrap(GalleryPage) },
      { path: '/concept',    element: wrap(ConceptGalleryPage) },
      { path: '/study-room', element: wrap(StudyRoomPage) },
      { path: '/upload',     element: wrap(UploadPage) },
      { path: '*',           element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
