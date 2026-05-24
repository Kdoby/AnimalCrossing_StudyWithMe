const THEMES = [
  { gradient: 'from-violet-100 via-purple-50 to-pink-100', icon: '🌙' },
  { gradient: 'from-amber-100 via-yellow-50 to-orange-100', icon: '☕' },
  { gradient: 'from-sky-100 via-blue-50 to-indigo-100', icon: '🌊' },
  { gradient: 'from-emerald-100 via-teal-50 to-cyan-100', icon: '🌿' },
];

const FLOAT_DELAYS = ['float-delay-1', 'float-delay-2', 'float-delay-3', 'float-delay-4'];

function formatDuration(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  return `${m}분`;
}

export default function ConceptVideoCard({ title, duration, index = 0, selected = false, onSelect }) {
  const theme = THEMES[index % THEMES.length];
  const delayClass = FLOAT_DELAYS[index % 4];

  return (
    <div
      onClick={onSelect}
      className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative
        ${selected ? 'ring-2 ring-leaf ring-offset-2' : ''}`}
    >
      {selected && (
        <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-leaf rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}

      <div className={`relative w-full h-40 bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
        <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
        <span className={`relative text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300 animate-float ${delayClass}`}>
          {theme.icon}
        </span>
      </div>

      <div className="bg-white px-4 py-3">
        <p className="text-sm font-semibold text-warm-brown truncate">{title}</p>
        {duration && (
          <p className="text-xs text-muted mt-0.5">{formatDuration(duration)}</p>
        )}
      </div>
    </div>
  );
}
