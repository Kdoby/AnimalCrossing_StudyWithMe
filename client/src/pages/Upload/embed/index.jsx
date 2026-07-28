import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Button from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import { registerVideoEmbed } from '../../../services/embed/videoService';
import { registerConceptVideoEmbed } from '../../../services/embed/conceptVideoService';
import { extractYouTubeId, getThumbnailUrl, isYouTubeShorts } from '../../../lib/youtube';

const UPLOAD_TYPES = [
  {
    id: 'zoom',
    label: '줌공부',
    emoji: '🌿',
    description: '주민 한 명이 공부하는 순간 (유튜브 URL 등록)',
  },
  {
    id: 'concept',
    label: '컨셉영상',
    emoji: '🎬',
    description: '여러 주민이 함께 있는 분위기 장면 (유튜브 URL 등록)',
  },
];

function YouTubePreview({ url }) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return (
    <img
      src={getThumbnailUrl(videoId)}
      alt="유튜브 썸네일 미리보기"
      className="w-full h-48 object-cover rounded-xl border border-sand"
    />
  );
}

export default function UploadEmbedPage() {
  const navigate = useNavigate();

  const [uploadType, setUploadType] = useState(null);

  const [title, setTitle] = useState('');
  const [animalName, setAnimalName] = useState('');
  const [conceptTitle, setConceptTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState('');

  const resetFields = () => {
    setTitle('');
    setAnimalName('');
    setConceptTitle('');
    setYoutubeUrl('');
    setError('');
  };

  const handleTypeSelect = (typeId) => {
    setUploadType(typeId);
    resetFields();
  };

  const { mutate: mutateZoom, isPending: isPendingZoom } = useMutation({
    mutationFn: registerVideoEmbed,
    onSuccess: () => navigate('/zoom'),
    onError: () => setError('등록에 실패했어요. 다시 시도해주세요.'),
  });

  const { mutate: mutateConcept, isPending: isPendingConcept } = useMutation({
    mutationFn: registerConceptVideoEmbed,
    onSuccess: () => navigate('/concept'),
    onError: () => setError('등록에 실패했어요. 다시 시도해주세요.'),
  });

  const isPending = isPendingZoom || isPendingConcept;

  const handleSubmit = () => {
    if (isYouTubeShorts(youtubeUrl)) {
      setError('YouTube Shorts는 등록할 수 없어요. 일반 영상 URL을 사용해주세요. (youtube.com/watch?v=...)');
      return;
    }
    const videoId = extractYouTubeId(youtubeUrl);
    if (!youtubeUrl.trim() || !videoId) {
      setError('유효한 유튜브 URL을 입력해주세요. (youtube.com/watch?v=... 또는 youtu.be/...)');
      return;
    }

    if (uploadType === 'zoom') {
      if (!title.trim()) { setError('영상 제목을 입력해주세요.'); return; }
      if (!animalName.trim()) { setError('주민 이름을 입력해주세요.'); return; }
      mutateZoom({ title: title.trim(), animalName: animalName.trim(), youtubeUrl: youtubeUrl.trim() });
    } else {
      if (!conceptTitle.trim()) { setError('영상 제목을 입력해주세요.'); return; }
      mutateConcept({ title: conceptTitle.trim(), youtubeUrl: youtubeUrl.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-lg mx-auto px-6 py-12">
        <BackButton onClick={() => navigate('/')} />

        <h1 className="text-2xl font-bold text-warm-brown mt-6 mb-2">
          영상 등록
        </h1>
        <p className="text-sm text-muted mb-8">
          유튜브에 업로드한 영상의 URL을 등록해주세요
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {UPLOAD_TYPES.map((type) => {
            const selected = uploadType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`text-left rounded-2xl border-2 px-4 py-4 transition-all duration-200 cursor-pointer
                  ${
                    selected
                      ? 'border-leaf bg-leaf/5 shadow-sm'
                      : 'border-sand bg-white hover:border-sage hover:bg-sage/5'
                  }`}
              >
                <span className="text-2xl block mb-2">{type.emoji}</span>
                <p
                  className={`text-sm font-bold mb-0.5 ${selected ? 'text-leaf' : 'text-warm-brown'}`}
                >
                  {type.label}
                </p>
                <p className="text-xs text-muted leading-snug">
                  {type.description}
                </p>
              </button>
            );
          })}
        </div>

        {uploadType && (
          <div className="flex flex-col gap-5">
            {uploadType === 'zoom' ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-warm-brown mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 도서관에서 공부하는 쭈니"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-white text-warm-brown text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-leaf/40 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-warm-brown mb-2">
                    주민 이름
                  </label>
                  <input
                    type="text"
                    value={animalName}
                    onChange={(e) => setAnimalName(e.target.value)}
                    placeholder="예: 쭈니, 잭슨, 미첼"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-white text-warm-brown text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-leaf/40 transition-all duration-200"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-warm-brown mb-2">
                  장소 / 분위기 이름
                </label>
                <input
                  type="text"
                  value={conceptTitle}
                  onChange={(e) => setConceptTitle(e.target.value)}
                  placeholder="예: 카페 공부방, 도서관 저녁, 침실 새벽"
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-white text-warm-brown text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-leaf/40 transition-all duration-200"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-warm-brown mb-2">
                유튜브 URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => { setYoutubeUrl(e.target.value); setError(''); }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 rounded-xl border border-sand bg-white text-warm-brown text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-leaf/40 transition-all duration-200"
              />
              <p className="text-xs text-muted mt-1.5">
                유튜브에 일부공개로 올린 영상의 URL을 붙여넣으세요
              </p>
            </div>

            {youtubeUrl && <YouTubePreview url={youtubeUrl} />}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button onClick={handleSubmit} disabled={isPending} fullWidth>
              {isPending ? '등록 중...' : '등록하기'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
