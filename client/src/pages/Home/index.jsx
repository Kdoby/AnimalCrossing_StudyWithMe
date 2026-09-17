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
    delayClass: 'anim-delay-2',
    tiltClass: 'rotate-0 sm:-rotate-3',
    tapeClass: 'bg-sky/70 -rotate-6',
  },
  {
    id: 'concept',
    label: '컨셉영상',
    emoji: '🎬',
    description: '스터디윗미 영상과 함께\n풀스크린으로 집중해요',
    gradient: 'from-pink-100 via-rose-50 to-orange-100',
    badge: '싱글 셀렉트 · 풀스크린',
    path: '/concept',
    delayClass: 'anim-delay-3',
    tiltClass: 'rotate-0 sm:rotate-3',
    tapeClass: 'bg-peach/70 rotate-6',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden flex flex-col">
      {/* 하늘색 그라데이션 (디오라마 상단부) */}
      <div className="absolute inset-x-0 top-0 h-[26rem] bg-gradient-to-b from-sky/25 via-sky/8 to-transparent pointer-events-none" />

      {/* 흘러가는 구름 */}
      <div className="hidden sm:block absolute top-12 left-[10%] w-24 h-11 rounded-full bg-white/70 animate-drift pointer-events-none" />
      <div className="hidden sm:block absolute top-24 right-[14%] w-32 h-14 rounded-full bg-white/60 animate-drift drift-delay-1 pointer-events-none" />

      {/* 떠다니는 나뭇잎 */}
      <span className="hidden sm:inline-block absolute top-20 left-[26%] text-2xl opacity-60 animate-float float-delay-2 pointer-events-none select-none">
        🍃
      </span>
      <span className="hidden sm:inline-block absolute top-40 right-[22%] text-xl opacity-50 animate-float float-delay-3 pointer-events-none select-none">
        🍂
      </span>

      {/* 하단 초원 (디오라마 하단부) */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-sage/20 to-transparent [clip-path:ellipse(80%_100%_at_50%_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pt-8 pb-4 flex items-start justify-between">
        <div className="-rotate-1">
          <h1 className="font-display text-2xl tracking-wide text-warm-brown flex items-center gap-1.5">
            <span>🌿</span> Study With Dongsoop
          </h1>
          <p className="text-xs text-muted mt-1 ml-0.5">당신의 주민들과 자유롭게 공부하세요</p>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="rotate-3 hover:rotate-0 bg-peach/40 border-2 border-dashed border-peach text-xs font-semibold text-warm-brown rounded-xl px-3.5 py-2 shadow-sm hover:bg-peach/60 hover:border-solid hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          + 영상 올리기
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20 pt-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 -rotate-1 bg-white/70 backdrop-blur-sm border border-sand text-warm-brown text-[11px] font-semibold px-3 py-1.5 rounded-full mb-5 shadow-sm">
            🌿 동물의 숲 스타일 스터디윗미
          </span>

          <h2 className="relative inline-block font-display text-3xl sm:text-4xl text-warm-brown mb-3">
            어떻게 공부할까요?
            <svg
              className="absolute left-0 -bottom-2.5 w-full h-3 stroke-sage"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <path d="M2 8 Q 20 2, 40 8 T 80 8 T 120 8 T 160 8 T 198 8" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </h2>
          <p className="text-sm text-muted mt-4">공부 모드를 먼저 골라주세요</p>
        </div>

        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-8 sm:gap-0">
          {MODES.map((mode, index) => (
            <button
              key={mode.id}
              onClick={() => navigate(mode.path)}
              className={`group relative text-left w-full max-w-sm bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:rotate-0 hover:z-20 cursor-pointer animate-fade-slide-up ${mode.delayClass} ${mode.tiltClass} ${
                index === 0 ? 'sm:-mr-7' : ''
              }`}
            >
              <span
                className={`absolute -top-3 left-9 w-14 h-6 rounded-sm shadow-sm opacity-90 pointer-events-none ${mode.tapeClass}`}
              />

              <div
                className={`relative h-40 m-2 mb-0 rounded-2xl overflow-hidden bg-gradient-to-br ${mode.gradient} flex items-center justify-center border-2 border-dashed border-white/70`}
              >
                <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
                <span className="relative text-5xl drop-shadow-sm group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 animate-float float-delay-1">
                  {mode.emoji}
                </span>
                <span className="absolute top-2.5 right-2.5 bg-white/80 backdrop-blur-sm text-warm-brown text-[10px] font-semibold px-2 py-1 rounded-full border border-white">
                  {mode.badge}
                </span>
              </div>

              <div className="px-5 py-4">
                <p className="font-display text-xl text-warm-brown mb-1">{mode.label}</p>
                <p className="text-xs text-muted whitespace-pre-line leading-relaxed">{mode.description}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted mt-16">🐾 오늘도 주민들과 포근한 하루 되세요</p>
      </div>
    </div>
  );
}
