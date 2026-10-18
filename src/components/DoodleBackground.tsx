import React from 'react';

export const DoodleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <svg
        className="w-full h-full opacity-35"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Top-left pencil */}
        <g transform="translate(180, 50) rotate(-25) scale(0.85)">
          <path d="M0 0L30 -30L40 -20L10 10L-5 15Z" />
          <path d="M-5 15L0 0L10 10Z" fill="#94a3b8" fillOpacity="0.2" />
        </g>

        {/* Paper Airplane - Center Left */}
        <g transform="translate(390, 220) rotate(-15) scale(0.95)">
          <path d="M0 0L45 10L15 25Z" />
          <path d="M45 10L15 25L20 40L28 27" />
          {/* Flight dotted trail */}
          <path d="M-40 20C-20 25 -10 10 0 0" strokeDasharray="3 3" />
        </g>

        {/* Open Book - Top Right */}
        <g transform="translate(820, 80) scale(0.9)">
          <path d="M0 10C15 5 25 6 35 10C45 6 55 5 70 10V35C55 30 45 31 35 35C25 31 15 30 0 35V10Z" />
          <path d="M35 10V35" />
          <line x1="8" y1="18" x2="28" y2="16" strokeDasharray="2 2" />
          <line x1="8" y1="24" x2="28" y2="22" strokeDasharray="2 2" />
          <line x1="42" y1="16" x2="62" y2="18" strokeDasharray="2 2" />
          <line x1="42" y1="22" x2="62" y2="24" strokeDasharray="2 2" />
        </g>

        {/* Pencil - Mid Left */}
        <g transform="translate(480, 360) rotate(40) scale(0.8)">
          <path d="M0 0L40 -40L48 -32L8 8L-4 12Z" />
          <line x1="12" y1="-12" x2="32" y2="8" />
        </g>

        {/* Lightbulb - Far right */}
        <g transform="translate(970, 320) scale(0.85)">
          <path d="M15 0C8 0 2 6 2 14C2 20 6 23 8 26V30H22V26C24 23 28 20 28 14C28 6 22 0 15 0Z" />
          <line x1="10" y1="34" x2="20" y2="34" />
          <line x1="15" y1="-5" x2="15" y2="-10" />
          <line x1="28" y1="5" x2="33" y2="2" />
          <line x1="2" y1="5" x2="-3" y2="2" />
        </g>

        {/* Math compass / angle */}
        <g transform="translate(50, 350) scale(0.9)">
          <circle cx="15" cy="5" r="4" />
          <line x1="13" y1="9" x2="3" y2="40" />
          <line x1="17" y1="9" x2="27" y2="40" />
          <path d="M8 26C12 28 18 28 22 26" />
        </g>

        {/* Notebook / Test paper icon - Mid Right */}
        <g transform="translate(470, 480) scale(0.85)">
          <rect x="0" y="0" width="36" height="46" rx="4" />
          <line x1="8" y1="12" x2="28" y2="12" />
          <line x1="8" y1="20" x2="28" y2="20" />
          <line x1="8" y1="28" x2="20" y2="28" />
        </g>

        {/* Ruler - Bottom Left */}
        <g transform="translate(140, 520) rotate(-15) scale(0.8)">
          <rect x="0" y="0" width="70" height="20" rx="2" />
          <line x1="10" y1="0" x2="10" y2="8" />
          <line x1="20" y1="0" x2="20" y2="5" />
          <line x1="30" y1="0" x2="30" y2="8" />
          <line x1="40" y1="0" x2="40" y2="5" />
          <line x1="50" y1="0" x2="50" y2="8" />
          <line x1="60" y1="0" x2="60" y2="5" />
        </g>

        {/* Small sparkling stars */}
        <g transform="translate(290, 400) scale(0.65)">
          <path d="M10 0L13 7L20 10L13 13L10 20L7 13L0 10L7 7Z" />
        </g>
        <g transform="translate(740, 260) scale(0.6)">
          <path d="M10 0L13 7L20 10L13 13L10 20L7 13L0 10L7 7Z" />
        </g>
      </svg>
    </div>
  );
};
