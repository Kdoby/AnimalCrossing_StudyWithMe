const THEMES = [
  { gradient: 'from-emerald-100 via-teal-50 to-sky-100', icon: '🌿', clip: 'bg-sage/70' },
  { gradient: 'from-pink-100 via-rose-50 to-orange-100', icon: '🌸', clip: 'bg-peach/70' },
  { gradient: 'from-amber-100 via-yellow-50 to-lime-100', icon: '🍂', clip: 'bg-sky/70' },
  { gradient: 'from-blue-100 via-indigo-50 to-purple-100', icon: '🌙', clip: 'bg-lilac/70' },
];

const FLOAT_DELAYS = ['', 'float-delay-1', 'float-delay-2', 'float-delay-3', 'float-delay-4'];

export default function VideoCard({
  title,
  animalName,
  thumbnailUrl,
  index = 0,
  selected = false,
  selectedOrder = null,
  disabled = false,
  onSelect,
}) {
  const theme = THEMES[index % THEMES.length];
  const delayClass = FLOAT_DELAYS[(index % 4) + 1];
  const displayName = animalName ?? title;

  return (
    <div
      onClick={disabled ? undefined : onSelect}
      className={`group flex-shrink-0 rounded-2xl overflow-hidden shadow-md transition-all duration-300 relative
        ${disabled ? 'opacity-45 saturate-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl hover:-translate-y-2'}
        ${selected ? 'ring-2 ring-leaf ring-offset-2 ring-offset-cream shadow-xl' : ''}`}
    >
      {/* 명찰 클립: 카드 상단에 걸린 작은 탭 */}
      <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-b-md ${theme.clip} pointer-events-none`} />

      {selected && (
        <span className="absolute -top-2 -right-2 z-10 w-9 h-9 rounded-lg bg-leaf text-white flex items-center justify-center shadow-md rotate-6 border-2 border-white">
          <span className="text-sm font-bold leading-none">{selectedOrder}</span>
        </span>
      )}

      <div className={`relative w-full h-44 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden border-2 border-dashed border-white/70 m-1.5 mb-0 rounded-xl`}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={displayName}
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

      <div className="bg-white px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="font-display text-base text-warm-brown truncate">{displayName}</p>
          {animalName && title !== animalName && (
            <p className="text-xs text-muted truncate">{title}</p>
          )}
        </div>
        <div className="flex items-end gap-1 h-5 flex-shrink-0">
          <span className="equalizer-bar equalizer-bar-1" />
          <span className="equalizer-bar equalizer-bar-2" />
          <span className="equalizer-bar equalizer-bar-3" />
        </div>
      </div>
    </div>
  );
}
