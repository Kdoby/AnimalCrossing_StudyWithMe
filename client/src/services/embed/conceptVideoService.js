import fetcher from '../../lib/fetcher';

export const getConceptVideosEmbed = (params) => fetcher.get('/concept-videos-embed', { params });

export const registerConceptVideoEmbed = (data) => fetcher.post('/concept-videos-embed/register', data);
