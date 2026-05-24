import fetcher from '../lib/fetcher';

export const getVideos = (params) => fetcher.get('/videos', { params });

export const uploadVideo = (formData) => fetcher.post('/videos/upload', formData);
