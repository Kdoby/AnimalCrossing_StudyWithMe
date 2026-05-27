import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import { uploadVideo } from '../../services/videoService';
import { uploadConceptVideo } from '../../services/conceptVideoService';

const UPLOAD_TYPES = [
  {
    id: 'zoom',
    label: '줌공부',
    emoji: '🌿',
    description: '주민 한 명이 공부하는 순간 (1분 이내, 루프 재생)',
  },
  {
    id: 'concept',
    label: '컨셉영상',
    emoji: '🎬',
    description: '여러 주민이 함께 있는 분위기 장면 (1분 이내, 루프 재생)',
  },
];

export default function UploadPage() {
  const navigate = useNavigate();

  const [uploadType, setUploadType] = useState(null);

  // 줌공부용 필드
  const [title, setTitle] = useState('');
  const [animalName, setAnimalName] = useState('');

  // 컨셉영상용 필드
  const [conceptTitle, setConceptTitle] = useState('');

  // 공통 필드
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState('');

  const resetFileFields = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreview(null);
    setError('');
  };

  const handleTypeSelect = (typeId) => {
    setUploadType(typeId);
    resetFileFields();
  };

  const { mutate: mutateZoom, isPending: isPendingZoom } = useMutation({
    mutationFn: uploadVideo,
    onSuccess: () => navigate('/zoom'),
    onError: () => setError('업로드에 실패했어요. 다시 시도해주세요.'),
  });

  const { mutate: mutateConcept, isPending: isPendingConcept } = useMutation({
    mutationFn: uploadConceptVideo,
    onSuccess: () => navigate('/concept'),
    onError: () => setError('업로드에 실패했어요. 다시 시도해주세요.'),
  });

  const isPending = isPendingZoom || isPendingConcept;

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      if (video.duration > 60) {
        setError('1분 이내의 영상만 업로드할 수 있어요.');
        return;
      }
      setVideoFile(file);
      setVideoPreview(url);
      setError('');
    };
    video.src = url;
  };

  const handleSubmit = () => {
    // 줌 스터디
    if (uploadType === 'zoom') {
      if (!title.trim()) {
        setError('영상 제목을 입력해주세요.');
        return;
      }
      if (!animalName.trim()) {
        setError('주민 이름을 입력해주세요.');
        return;
      }
      if (!videoFile) {
        setError('영상 파일을 선택해주세요.');
        return;
      }
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('animalName', animalName.trim());
      formData.append('video', videoFile);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
      mutateZoom(formData);
    }
    // 컨셉 영상 스터디
    else {
      if (!conceptTitle.trim()) {
        setError('영상 제목을 입력해주세요.');
        return;
      }
      if (!videoFile) {
        setError('영상 파일을 선택해주세요.');
        return;
      }
      const formData = new FormData();
      formData.append('title', conceptTitle.trim());
      formData.append('video', videoFile);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
      mutateConcept(formData);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-lg mx-auto px-6 py-12">
        <BackButton onClick={() => navigate('/')} />

        <h1 className="text-2xl font-bold text-warm-brown mt-6 mb-2">
          영상 업로드
        </h1>
        <p className="text-sm text-muted mb-8">어떤 종류의 영상을 올릴까요?</p>

        {/* 업로드 유형 선택 */}
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

        {/* 업로드 유형 선택 후 폼 표시 */}
        {uploadType && (
          <div className="flex flex-col gap-5">
            {uploadType === 'zoom' ? (
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
                <label className="block text-sm font-semibold text-warm-brown mt-5 mb-2">
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
                영상 파일{' '}
                <span className="text-muted font-normal">
                  (1분 이내, 루프 재생)
                </span>
              </label>
              <label
                className={`upload-zone block cursor-pointer rounded-xl overflow-hidden border border-sand ${videoPreview ? 'upload-zone-filled' : ''}`}
              >
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    className="w-full h-48 object-cover"
                    muted
                  />
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center gap-2 text-muted bg-white">
                    <span className="text-3xl">
                      {uploadType === 'zoom' ? '🌿' : '🎬'}
                    </span>
                    <span className="text-sm">클릭해서 영상 선택</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-warm-brown mb-2">
                썸네일 <span className="text-muted font-normal">(선택)</span>
              </label>
              <label className="block w-full px-4 py-3 rounded-xl border border-sand bg-white cursor-pointer text-sm text-muted hover:bg-sand/30 transition-colors duration-200 text-center">
                {thumbnailFile ? thumbnailFile.name : '이미지 파일 선택'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setThumbnailFile(e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button onClick={handleSubmit} disabled={isPending} fullWidth>
              {isPending ? '업로드 중...' : '업로드하기'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
