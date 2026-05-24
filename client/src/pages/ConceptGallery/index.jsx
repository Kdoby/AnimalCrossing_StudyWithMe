import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ConceptVideoCard from '../../components/ConceptVideoCard';
import Button from '../../components/Button';
import SelectChip from '../../components/SelectChip';
import BackButton from '../../components/BackButton';
import { getConceptVideos } from '../../services/conceptVideoService';
import { queryKeys } from '../../services/queryKeys';
import { DURATIONS } from '../../constant/durations';

const FALLBACK_CONCEPT_VIDEOS = [
  { id: 1, title: '학교 공부방', videoUrl: '/dongsoop_study_1.mp4' },
  { id: 2, title: '학교 공부방2', videoUrl: '/dongsoop_study_2.mp4' },
  { id: 3, title: '학교 공부방3', videoUrl: '/dongsoop_study_3.mp4' },
  { id: 4, title: '학교 공부방4', videoUrl: '/dongsoop_study_4.mp4' },
  { id: 5, title: '다락방 빗소리', videoUrl: null },
  { id: 6, title: '박물관 조용한 오전', videoUrl: null },
];

export default function ConceptGalleryPage() {
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(null);
  const [duration, setDuration] = useState(null);

  const { data: videos = FALLBACK_CONCEPT_VIDEOS } = useQuery({
    queryKey: queryKeys.conceptVideos.list({}),
    queryFn: () => getConceptVideos({}),
  });

  const toggleSelect = (video) => {
    setSelectedId((prev) => (prev === video.id ? null : video.id));
    setDuration(null);
  };

  const selectedVideo = videos.find((v) => v.id === selectedId) ?? null;
  const canStart = selectedId !== null && duration !== null;

  const handleStart = () => {
    navigate('/study-room', {
      state: { videos: [selectedVideo], duration, mode: 'single' },
    });
  };

  return (
    <div className="min-h-screen bg-cream pb-40">
      <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur-sm border-b border-sand/60">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <BackButton onClick={() => navigate('/')} />
          <div>
            <h1 className="text-xl font-bold text-warm-brown">🎬 컨셉영상</h1>
            <p className="text-xs text-muted mt-0.5">
              영상을 하나 골라 집중해보세요
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted">
            <span className="text-5xl mb-4">🎬</span>
            <p className="text-sm">아직 업로드된 컨셉 영상이 없어요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videos.map((video, i) => (
              <ConceptVideoCard
                key={video.id}
                title={video.title}
                duration={video.duration}
                index={i}
                selected={selectedId === video.id}
                onSelect={() => toggleSelect(video)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedId !== null && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-sand shadow-xl">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <p className="text-xs font-bold text-warm-brown mb-3">
              영상 1개 선택됨 · 공부 시간을 선택해주세요
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {DURATIONS.map((d) => (
                <SelectChip
                  key={d.label}
                  label={d.label}
                  selected={duration === d.value}
                  onClick={() => setDuration(d.value)}
                />
              ))}
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
