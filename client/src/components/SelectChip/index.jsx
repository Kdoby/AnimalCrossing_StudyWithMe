function CheckIcon() {
  return (
    <svg
      width="11" height="11" viewBox="0 0 11 11"
      fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M1.5 5.5L4.5 8.5L9.5 2.5" />
    </svg>
  );
}

export default function SelectChip({
  label,
  selected,
  onClick,
  activeClass,
  inactiveClass,
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 cursor-pointer active:scale-95 ${
        selected
          ? activeClass ?? 'bg-leaf text-white border-leaf scale-[1.02] shadow-sm'
          : inactiveClass ?? 'bg-sand/40 text-warm-brown border-sand hover:border-sage hover:bg-sand/60'
      }`}
    >
      {selected && <CheckIcon />}
      {label}
    </button>
  );
}
