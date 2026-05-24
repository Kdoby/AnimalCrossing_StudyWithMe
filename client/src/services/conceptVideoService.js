import fetcher from '../lib/fetcher';

export const getConceptVideos = (params) => fetcher.get('/concept-videos', { params });

export const uploadConceptVideo = (formData) => fetcher.post('/concept-videos/upload', formData);
