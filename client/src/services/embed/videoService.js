import fetcher from '../../lib/fetcher';

export const getVideosEmbed = (params) => fetcher.get('/videos-embed', { params });

export const registerVideoEmbed = (data) => fetcher.post('/videos-embed/register', data);
