import fetcher from '../lib/fetcher';

export const getAudioList = () => fetcher.get('/audio');
