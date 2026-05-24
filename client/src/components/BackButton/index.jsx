export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 text-sm font-medium text-muted hover:text-warm-brown transition-colors duration-150 cursor-pointer"
    >
      <span className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:bg-sand/60">
        <svg
          width="14" height="14" viewBox="0 0 14 14"
          fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M9 2L4 7L9 12" />
        </svg>
      </span>
      <span>돌아가기</span>
    </button>
  );
}
