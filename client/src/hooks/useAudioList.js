import { useQuery } from '@tanstack/react-query';
import { getAudioList } from '../services/audioService';
import { queryKeys } from '../services/queryKeys';

const FALLBACK_AUDIO = [
  { id: null,          title: '없음',   url: null },
  { id: 'static-rain', title: '빗소리', url: '/forest_rain_bgm.mp3' },
];

export function useAudioList() {
  const { data = FALLBACK_AUDIO } = useQuery({
    queryKey: queryKeys.audio.list(),
    queryFn: getAudioList,
    staleTime: Infinity,
  });
  return data;
}
