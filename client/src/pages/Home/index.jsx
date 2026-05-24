import { useNavigate } from 'react-router-dom';

const MODES = [
  {
    id: 'zoom',
    label: '줌공부',
    emoji: '🖥️',
    description: '주민들과 함께\n가상 줌 화면으로 공부해요',
    gradient: 'from-emerald-100 via-teal-50 to-sky-100',
    badge: '멀티 셀렉트 · 최대 6명',
    path: '/zoom',
    delayClass: 'anim-delay-1',
  },
  {
    id: 'concept',
    label: '컨셉영상',
    emoji: '🎬',
    description: '스터디윗미 영상과 함께\n풀스크린으로 집중해요',
    gradient: 'from-pink-100 via-rose-50 to-orange-100',
    badge: '싱글 셀렉트 · 풀스크린',
    path: '/concept',
    delayClass: 'anim-delay-2',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="max-w-5xl mx-auto w-full px-6 pt-10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-warm-brown">🌿 Study With Dongsoop</h1>
          <p className="text-xs text-muted mt-0.5">당신의 주민들과 자유롭게 공부하세요</p>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="text-xs font-semibold text-muted hover:text-warm-brown border border-sand rounded-xl px-3 py-2 hover:border-sage transition-all duration-200 cursor-pointer"
        >
          + 영상 업로드
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="text-center mb-10">
          <span className="text-5xl animate-float inline-block mb-4">🌿</span>
          <h2 className="text-2xl font-bold text-warm-brown mb-2">어떻게 공부할까요?</h2>
          <p className="text-sm text-muted">공부 모드를 먼저 선택해주세요</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => navigate(mode.path)}
              className={`group text-left rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-fade-slide-up ${mode.delayClass}`}
            >
              <div className={`relative h-44 bg-gradient-to-br ${mode.gradient} flex items-center justify-center`}>
                <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
                <span className="relative text-6xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300 animate-float float-delay-1">
                  {mode.emoji}
                </span>
                <span className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm text-warm-brown text-xs font-semibold px-2.5 py-1 rounded-full">
                  {mode.badge}
                </span>
              </div>

              <div className="bg-white px-5 py-4">
                <p className="text-base font-bold text-warm-brown mb-1">{mode.label}</p>
                <p className="text-xs text-muted whitespace-pre-line leading-relaxed">{mode.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
