import React from 'react';

export const HeadphonesOverCorner: React.FC<{ className?: string }> = ({ className = '' }) => (
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

    {/* Upper Padded Headband Arch curving across the corner */}
    <path
      d="M10 54 C12 28 26 14 54 10"
      stroke="url(#headbandMetallic)"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      d="M10 54 C12 28 26 14 54 10"
      stroke="#6b7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.6"
    />

    {/* Padded Leather Headband Cushion Section */}
    <path
      d="M18 42 C24 24 34 17 48 13"
      stroke="#0f1115"
      strokeWidth="5"
      strokeLinecap="round"
    />
    {/* Stitched seam line on cushion */}
    <path
      d="M20 40 C26 25 35 18 46 14"
      stroke="#7c3aed"
      strokeWidth="0.8"
      strokeDasharray="2 2"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Metallic Gimbal / Pivot Bracket holding the ear cup */}
    <rect
      x="8"
      y="48"
      width="8"
      height="11"
      rx="2"
      fill="url(#brassGimbal)"
      stroke="#3b2b0a"
      strokeWidth="1"
    />
    <circle cx="12" cy="53.5" r="2.2" fill="#fef08a" stroke="#713f12" strokeWidth="0.6" />

    {/* Angled Over-Ear Cup Resting Diagonally Over Book Corner */}
    <g transform="rotate(-32 26 52)">
      {/* Outer Ear Cup Shell */}
      <ellipse
        cx="26"
        cy="52"
        rx="14"
        ry="19"
        fill="url(#earcupLeather)"
        stroke="#4c1d95"
        strokeWidth="1.6"
      />

      {/* Memory Foam Leather Cushion Rim */}
      <ellipse
        cx="26"
        cy="52"
        rx="10"
        ry="14.5"
        fill="url(#earcupCushion)"
        stroke="#1e1b2e"
        strokeWidth="1.2"
      />

      {/* Center Acoustic Grille & Metallic Medallion */}
      <circle cx="26" cy="52" r="5.5" fill="#1e1b2e" stroke="url(#brassGimbal)" strokeWidth="1" />
      <circle cx="26" cy="52" r="2.8" fill="#8b5cf6" />
      <circle cx="25" cy="51" r="0.8" fill="#ffffff" opacity="0.9" />
    </g>

    {/* Braided Studio Audio Cable dropping gracefully down */}
    <path
      d="M17 62 C15 70 21 76 25 82"
      stroke="#a78bfa"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M17 62 C15 70 21 76 25 82"
      stroke="#1e1b2e"
      strokeWidth="1"
      strokeLinecap="round"
      strokeDasharray="1.5 1.5"
      fill="none"
    />
  </svg>
);
