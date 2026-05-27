const THEMES = [
  { gradient: 'from-violet-100 via-purple-50 to-pink-100', icon: '🌙' },
  { gradient: 'from-amber-100 via-yellow-50 to-orange-100', icon: '☕' },
  { gradient: 'from-sky-100 via-blue-50 to-indigo-100', icon: '🌊' },
  { gradient: 'from-emerald-100 via-teal-50 to-cyan-100', icon: '🌿' },
];

const FLOAT_DELAYS = ['float-delay-1', 'float-delay-2', 'float-delay-3', 'float-delay-4'];

export default function ConceptVideoCard({ title, thumbnailUrl, duration, index = 0, selected = false, onSelect }) {
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

      <div className={`relative w-full h-40 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden`}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <>
            <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
            <span className={`relative text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300 animate-float ${delayClass}`}>
              {theme.icon}
            </span>
          </>
        )}
      </div>

      <div className="bg-white px-4 py-3">
        <p className="text-sm font-semibold text-warm-brown truncate">{title}</p>
        {duration != null && (
          <p className="text-xs text-muted mt-0.5">{duration}분</p>
        )}
      </div>
    </div>
  );
}
