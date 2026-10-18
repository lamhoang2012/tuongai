import React from 'react';

interface OwlLogoProps {
  className?: string;
  size?: number;
}

export const OwlLogo: React.FC<OwlLogoProps> = ({ className = '', size = 52 }) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Open Book at bottom */}
        <path
          d="M12 78C26 73 38 74 50 78C62 74 74 73 88 78V87C74 82 62 83 50 87C38 83 26 82 12 87V78Z"
          fill="#0284c7"
        />
        {/* Book pages */}
        <path
          d="M14 74C27 70 38 71 50 75C62 71 73 70 86 74V82C73 78 62 79 50 83C38 79 27 78 14 82V74Z"
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth="1.5"
        />
        {/* Book spine & bottom cover */}
        <path
          d="M10 83C25 78 38 79 50 83C62 79 75 78 90 83V88C75 83 62 84 50 88C38 84 25 83 10 88V83Z"
          fill="#ea580c"
        />

        {/* Owl Body */}
        <ellipse cx="50" cy="46" rx="28" ry="30" fill="#0284c7" />
        
        {/* Ear tufts */}
        <path d="M26 24L34 34L23 37L26 24Z" fill="#0369a1" />
        <path d="M74 24L66 34L77 37L74 24Z" fill="#0369a1" />

        {/* Belly */}
        <ellipse cx="50" cy="54" rx="20" ry="19" fill="#f0f9ff" />
        {/* Belly feather marks */}
        <path d="M44 50C47 52 53 52 56 50" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
        <path d="M41 57C45 60 55 60 59 57" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
        <path d="M45 64C48 66 52 66 55 64" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />

        {/* Big White Eyes */}
        <circle cx="37" cy="41" r="13" fill="#ffffff" stroke="#e0f2fe" strokeWidth="1.5" />
        <circle cx="63" cy="41" r="13" fill="#ffffff" stroke="#e0f2fe" strokeWidth="1.5" />

        {/* Pupils (looking friendly and intelligent) */}
        <circle cx="37" cy="41" r="7" fill="#0f172a" />
        <circle cx="63" cy="41" r="7" fill="#0f172a" />
        {/* Highlights */}
        <circle cx="35" cy="38" r="2.5" fill="#ffffff" />
        <circle cx="61" cy="38" r="2.5" fill="#ffffff" />
        <circle cx="39" cy="43" r="1.2" fill="#ffffff" />
        <circle cx="65" cy="43" r="1.2" fill="#ffffff" />

        {/* Smart Round Glasses */}
        <circle cx="37" cy="41" r="14" fill="none" stroke="#0f172a" strokeWidth="3" />
        <circle cx="63" cy="41" r="14" fill="none" stroke="#0f172a" strokeWidth="3" />
        {/* Glasses Bridge */}
        <path d="M51 40C50 38 50 38 49 40" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
        {/* Glasses sides */}
        <path d="M23 41L18 39" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M77 41L82 39" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

        {/* Orange Beak */}
        <path d="M50 45L45 52C48 55 52 55 55 52L50 45Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />

        {/* Little Feet on the book */}
        <path d="M40 73C40 76 38 78 35 78" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M43 73C44 76 43 78 41 78" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M57 73C56 76 57 78 59 78" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M60 73C60 76 62 78 65 78" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};
