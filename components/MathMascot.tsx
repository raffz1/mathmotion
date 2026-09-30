import React from 'react';

interface MathMascotProps {
  className?: string;
  size?: number | string;
  bgColor?: string;
}

export const MathMascot: React.FC<MathMascotProps> = ({ 
  className = 'w-11 h-11', 
  size,
  bgColor = '#FF70A6' // Pink Bubblegum by default for vibrant pop against Yellow navbar
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[2.5px_2.5px_0px_#000]"
      >
        {/* Antenna with mini neon Cyan ball */}
        <path
          d="M32 11V5M28 5H36"
          stroke="#000"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="5" r="3.5" fill="#00F5D4" stroke="#000" strokeWidth="2.5" />

        {/* Main Body: Pink Bubblegum Neo-Brutalist Cube */}
        <rect
          x="5"
          y="11"
          width="54"
          height="48"
          rx="12"
          fill={bgColor}
          stroke="#000"
          strokeWidth="3.5"
        />

        {/* Top-left Gloss / Highlight */}
        <path
          d="M13 17H19"
          stroke="#FFF"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Forehead Math Multiply (×) Accent */}
        <path
          d="M30 16L34 20M34 16L30 20"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Left Cheek Blush: Bright Yellow Plus (+) Symbol */}
        <g transform="translate(10, 35)">
          <path d="M0 4H7M3.5 0.5V7.5" stroke="#FFE600" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Right Cheek Blush: Neon Cyan Minus (-) Symbol */}
        <g transform="translate(47, 35)">
          <path d="M0 4H7" stroke="#00F5D4" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Left Eye: Expressive Round Cartoon Eye with Glance Highlights */}
        <ellipse cx="23" cy="28" rx="5.5" ry="6.5" fill="#000" />
        <circle cx="21" cy="26" r="2.2" fill="#FFF" />
        <circle cx="25" cy="29.5" r="1.1" fill="#FFF" />

        {/* Right Eye: Expressive Round Cartoon Eye with Glance Highlights */}
        <ellipse cx="41" cy="28" rx="5.5" ry="6.5" fill="#000" />
        <circle cx="39" cy="26" r="2.2" fill="#FFF" />
        <circle cx="43" cy="29.5" r="1.1" fill="#FFF" />

        {/* Friendly Joyful Open Smile with Yellow tongue */}
        <path
          d="M26 39C27.5 44 36.5 44 38 39"
          stroke="#000"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="#FFE600"
        />
      </svg>
    </div>
  );
};
