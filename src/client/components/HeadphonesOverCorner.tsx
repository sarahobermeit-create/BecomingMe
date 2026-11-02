export function HeadphonesOverCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 90"
      className={`absolute -top-3.5 -left-3.5 w-16 h-16 pointer-events-none z-30 drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="headbandMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4b5563" />
          <stop offset="50%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="earcupLeather" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2e2b3d" />
          <stop offset="50%" stopColor="#171424" />
          <stop offset="100%" stopColor="#0c0a14" />
        </linearGradient>
        <linearGradient id="earcupCushion" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b374d" />
          <stop offset="60%" stopColor="#211e2f" />
          <stop offset="100%" stopColor="#13101c" />
        </linearGradient>
        <linearGradient id="brassGimbal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#967724" />
          <stop offset="100%" stopColor="#543e0f" />
        </linearGradient>
      </defs>
      <path d="M10 54 C12 28 26 14 54 10" stroke="url(#headbandMetallic)" strokeWidth="7" strokeLinecap="round" />
      <path d="M10 54 C12 28 26 14 54 10" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M18 42 C24 24 34 17 48 13" stroke="#0f1115" strokeWidth="5" strokeLinecap="round" />
      <path d="M20 40 C26 25 35 18 46 14" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.8" />
      <g transform="translate(6, 44) rotate(-35)">
        <rect x="0" y="0" width="6" height="12" rx="2" fill="url(#brassGimbal)" stroke="#3e2e0a" strokeWidth="0.5" />
        <ellipse cx="8" cy="6" rx="9" ry="14" fill="url(#earcupLeather)" stroke="#2d3748" strokeWidth="1" />
        <ellipse cx="9" cy="6" rx="6" ry="10" fill="url(#earcupCushion)" />
        <circle cx="8" cy="6" r="3" fill="#000" opacity="0.7" />
        <circle cx="8" cy="6" r="1.5" fill="#d4af37" />
      </g>
    </svg>
  );
}
