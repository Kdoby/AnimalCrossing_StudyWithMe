const THEMES = [
  { gradient: 'from-violet-100 via-purple-50 to-pink-100', icon: '🌙', tape: 'bg-lilac/70' },
  { gradient: 'from-amber-100 via-yellow-50 to-orange-100', icon: '☕', tape: 'bg-peach/70' },
  { gradient: 'from-sky-100 via-blue-50 to-indigo-100', icon: '🌊', tape: 'bg-sky/70' },
  { gradient: 'from-emerald-100 via-teal-50 to-cyan-100', icon: '🌿', tape: 'bg-sage/60' },
];

const FLOAT_DELAYS = ['float-delay-1', 'float-delay-2', 'float-delay-3', 'float-delay-4'];

export default function ConceptVideoCard({
  title,
  thumbnailUrl,
  duration,
  index = 0,
  selected = false,
  dimmed = false,
  onSelect,
}) {
  const theme = THEMES[index % THEMES.length];
  const delayClass = FLOAT_DELAYS[index % 4];
  const tiltClass = index % 2 === 0 ? '-rotate-1' : 'rotate-1';
  const tapeTiltClass = index % 3 === 0 ? '-rotate-12' : index % 3 === 1 ? 'rotate-12' : '-rotate-3';

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white p-2 pb-4 rounded-sm shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer
        ${selected ? 'rotate-0 -translate-y-2 shadow-2xl z-10' : `${tiltClass} hover:rotate-0 hover:-translate-y-2 hover:z-10`}
        ${dimmed ? 'opacity-50 saturate-50' : 'opacity-100'}
        ${selected ? 'ring-2 ring-leaf ring-offset-2 ring-offset-cream' : ''}`}
    >
      <span
        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-4 rounded-[2px] shadow-sm pointer-events-none ${theme.tape} ${tapeTiltClass}`}
      />

      {selected && (
        <span className="absolute -top-3 -right-3 z-10 w-11 h-11 rounded-full bg-leaf text-white flex items-center justify-center shadow-md -rotate-12 border-2 border-white">
          <span className="text-[10px] font-bold leading-none text-center">
            선택
            <br />
            완료
          </span>
        </span>
      )}

      <div
        className={`relative w-full h-36 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden border border-sand/40`}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <>
            <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
            <span
              className={`relative text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300 animate-float ${delayClass}`}
            >
              {theme.icon}
            </span>
          </>
        )}
      </div>

      <div className="px-1.5 pt-2.5">
        <p className="font-display text-base text-warm-brown truncate">{title}</p>
        {duration != null && <p className="text-xs text-muted mt-0.5">{duration}분</p>}
      </div>
    </div>
  );
}
