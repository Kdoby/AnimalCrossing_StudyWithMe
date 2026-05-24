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

// 서버 연결 전까지 보여줄 임시 데이터
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
  // useNavigate: 버튼 클릭 등 이벤트에서 페이지를 이동할 때 사용
  const navigate = useNavigate();

  // 선택된 영상들의 id 배열. 예: [1, 3, 5]
  const [selectedIds, setSelectedIds] = useState([]);
  // 현재 정렬 기준
  const [sort, setSort] = useState('latest');
  // 선택한 공부 시간 (분 단위). null이면 아직 미선택
  const [duration, setDuration] = useState(null);

  // useQuery: 서버에서 영상 목록을 가져오고 캐싱까지 자동으로 처리
  // - queryKey: 캐시를 구분하는 키. sort가 바뀌면 자동으로 다시 fetch
  // - queryFn: 실제 API 호출 함수
  // - data가 없으면(서버 연결 전) FALLBACK_VIDEOS를 기본값으로 사용
  const { data: videos = FALLBACK_VIDEOS } = useQuery({
    queryKey: queryKeys.videos.list({ sort }),
    queryFn: () => getVideos({ sort }),
  });

  // 영상 카드 클릭 시 선택/해제 토글
  const toggleSelect = (video) => {
    setSelectedIds((prev) => {
      if (prev.includes(video.id)) {
        return prev.filter((id) => id !== video.id); // 이미 선택됐으면 제거
      }
      if (prev.length >= 6) return prev;
      return [...prev, video.id]; // 선택 안 됐으면 추가
    });
  };

  // selectedIds 기준으로 실제 영상 객체 배열을 만들어둠 (공부방 진입 시 전달용)
  const selectedVideos = videos.filter((v) => selectedIds.includes(v.id));

  // 공부 시작 버튼 활성화 조건: 영상 1개 이상 선택 + 시간 선택
  const canStart = selectedIds.length > 0 && duration !== null;

  const handleStart = () => {
    navigate('/study-room', { state: { videos: selectedVideos, duration, mode: 'zoom' } });
  };

  return (
    // min-h-screen: 최소 높이를 화면 전체로 / pb-40: 하단 패널에 가리지 않도록 여백
    <div className="min-h-screen bg-cream pb-40">
      {/* 상단 헤더 - sticky: 스크롤해도 항상 화면 상단에 고정 */}
      <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur-sm border-b border-sand/60">
        {/* max-w-5xl mx-auto: 콘텐츠 최대 너비 제한 + 가운데 정렬 */}
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton onClick={() => navigate('/')} />
            <div>
              <h1 className="text-xl font-bold text-warm-brown">🌿 줌공부</h1>
              <p className="text-xs text-muted mt-0.5">
                주민을 골라 공부방을 만들어보세요
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        {/* 정렬 칩 목록 */}
        <div className="flex gap-2 mb-6">
          {SORT_OPTIONS.map((opt) => (
            <SelectChip
              key={opt.value}
              label={opt.label}
              selected={sort === opt.value} // 현재 선택된 정렬과 같으면 활성화 스타일
              onClick={() => setSort(opt.value)}
            />
          ))}
        </div>

        {/* 영상이 없을 때 빈 상태 UI, 있을 때 그리드 */}
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
          // grid-cols-2: 기본 2열 / sm:3열 / md:4열 (반응형)
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videos.map((video, i) => (
              <VideoCard
                key={video.id}
                title={video.title}
                index={i}
                selected={selectedIds.includes(video.id)}
                onSelect={() => toggleSelect(video)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 하단 패널 - 영상을 1개 이상 선택했을 때만 나타남 */}
      {selectedIds.length > 0 && (
        // fixed: 스크롤과 무관하게 화면 하단에 고정
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-sand shadow-xl">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <p className="text-xs font-bold text-warm-brown mb-3">
              {selectedIds.length}명 선택됨 · 공부 시간을 선택해주세요
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
            {/* disabled: canStart가 false일 때 버튼 비활성화 */}
            <Button fullWidth disabled={!canStart} onClick={handleStart}>
              공부방 시작하기 →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
