import React from 'react';

const Logo = ({ className = 'w-9 h-9' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
    {/* Background circle with gradient */}
    <circle cx="20" cy="20" r="18" fill="url(#logoGrad)" />
    {/* Subtle inner ring */}
    <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    {/* Center play button */}
    <polygon points="17,13 27,20 17,27" fill="white" opacity="0.95" />
  </svg>
);

export default Logo;
