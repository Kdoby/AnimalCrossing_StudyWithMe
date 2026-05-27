import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import VideoCard from '../../components/VideoCard';
import Button from '../../components/Button';
import SelectChip from '../../components/SelectChip';
import BackButton from '../../components/BackButton';
import { getVideos } from '../../services/videoService';
import { queryKeys } from '../../services/queryKeys';
import { DURATIONS } from '../../constant/durations';
import { useAudioList } from '../../hooks/useAudioList';

const FALLBACK_VIDEOS = [
  { id: 1, title: '뽀야미', videoUrl: null, duration: 12 },
  { id: 2, title: '메이첼', videoUrl: null, duration: 8 },
  { id: 3, title: '시베리아', videoUrl: null, duration: 15 },
  { id: 4, title: '마티', videoUrl: null, duration: 10 },
  { id: 5, title: '미애', videoUrl: null, duration: 14 },
  { id: 6, title: '미첼', videoUrl: null, duration: 9 },
  { id: 7, title: '잭슨', videoUrl: null, duration: 9 },
  { id: 8, title: '쭈니', videoUrl: null, duration: 9 },
];

const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
  { label: '이름순', value: 'name' },
];

export default function GalleryPage() {
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState([]);
  const [sort, setSort] = useState('latest');
  const [duration, setDuration] = useState(null);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [selectedBgm, setSelectedBgm] = useState(null);

  const audioList = useAudioList();

  const { data: videos = FALLBACK_VIDEOS } = useQuery({
    queryKey: queryKeys.videos.list({ sort }),
    queryFn: () => getVideos({ sort }),
  });

  const toggleSelect = (video) => {
    setSelectedIds((prev) => {
      if (prev.includes(video.id)) return prev.filter((id) => id !== video.id);
      if (prev.length >= 6) return prev;
      return [...prev, video.id];
    });
  };

  const handleDurationSelect = (d) => {
    if (d.value === null) {
      setIsCustomDuration(true);
      setDuration(null);
      setCustomMinutes('');
    } else {
      setIsCustomDuration(false);
      setDuration(d.value);
      setCustomMinutes('');
    }
  };

  const actualDuration = isCustomDuration ? (parseInt(customMinutes) || null) : duration;
  const selectedVideos = videos.filter((v) => selectedIds.includes(v.id));
  const canStart = selectedIds.length > 0 && actualDuration !== null && actualDuration > 0;

  const handleStart = () => {
    navigate('/study-room', {
      state: { videos: selectedVideos, duration: actualDuration, mode: 'zoom', bgm: selectedBgm },
    });
  };

  return (
    <div className="min-h-screen bg-cream pb-40">
      <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur-sm border-b border-sand/60">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton onClick={() => navigate('/')} />
            <div>
              <h1 className="text-xl font-bold text-warm-brown">🌿 줌공부</h1>
              <p className="text-xs text-muted mt-0.5">주민을 골라 공부방을 만들어보세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="flex gap-2 mb-6">
          {SORT_OPTIONS.map((opt) => (
            <SelectChip
              key={opt.value}
              label={opt.label}
              selected={sort === opt.value}
              onClick={() => setSort(opt.value)}
            />
          ))}
        </div>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted">
            <span className="text-5xl mb-4">🌿</span>
            <p className="text-sm">아직 업로드된 영상이 없어요</p>
            <button
              onClick={() => navigate('/upload')}
              className="mt-4 text-leaf text-sm font-semibold underline underline-offset-2"
            >
              첫 번째로 올려보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videos.map((video, i) => (
              <VideoCard
                key={video.id}
                title={video.title}
                animalName={video.animalName}
                thumbnailUrl={video.thumbnailUrl}
                index={i}
                selected={selectedIds.includes(video.id)}
                onSelect={() => toggleSelect(video)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-sand shadow-xl">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <p className="text-xs font-bold text-warm-brown mb-3">
              {selectedIds.length}명 선택됨 · 공부 시간을 선택해주세요
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {DURATIONS.map((d) => (
                <SelectChip
                  key={d.label}
                  label={d.label}
                  selected={d.value === null ? isCustomDuration : duration === d.value && !isCustomDuration}
                  onClick={() => handleDurationSelect(d)}
                />
              ))}
            </div>
            {isCustomDuration && (
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="분 입력"
                  className="w-28 px-3 py-2 rounded-xl border border-sand bg-white text-warm-brown text-sm focus:outline-none focus:ring-2 focus:ring-leaf/40"
                  autoFocus
                />
                <span className="text-xs text-muted">분</span>
              </div>
            )}

            <p className="text-xs font-bold text-warm-brown mb-2 mt-1">🎵 배경음악</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {audioList.map((audio) => {
                const isSelected = selectedBgm?.id === audio.id && selectedBgm?.title === audio.title;
                return (
                  <SelectChip
                    key={audio.id ?? 'none'}
                    label={audio.title}
                    selected={isSelected || (selectedBgm === null && audio.id === null)}
                    onClick={() => setSelectedBgm(audio.id === null ? null : audio)}
                  />
                );
              })}
            </div>

            <Button fullWidth disabled={!canStart} onClick={handleStart}>
              공부방 시작하기 →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
