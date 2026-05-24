export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf/40 cursor-pointer';

  const variants = {
    primary:
      'btn-shimmer bg-gradient-to-br from-leaf to-leaf-dark text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:pointer-events-none',
    secondary:
      'bg-white text-warm-brown border-2 border-sand hover:border-sage hover:bg-sage/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:pointer-events-none',
    ghost: 'text-sage hover:text-warm-brown hover:bg-sand/40 active:bg-sand/60',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full justify-center' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
