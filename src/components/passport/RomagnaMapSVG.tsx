
import React from 'react';

interface RomagnaMapSVGProps {
  className?: string;
  children?: React.ReactNode;
}

const RomagnaMapSVG: React.FC<RomagnaMapSVGProps> = ({ className, children }) => {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Definizione dei gradienti e pattern */}
      <defs>
        <pattern id="paperTexture" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="rgba(205, 164, 52, 0.05)" />
          <circle cx="2" cy="2" r="0.5" fill="rgba(205, 164, 52, 0.1)" />
        </pattern>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CDA434" />
          <stop offset="50%" stopColor="#E6C866" />
          <stop offset="100%" stopColor="#B8941F" />
        </linearGradient>
      </defs>

      {/* Sfondo della mappa con texture */}
      <rect width="400" height="300" fill="url(#paperTexture)" />

      {/* Costa Adriatica - linea principale */}
      <path
        d="M 320 50 Q 330 80 335 120 Q 340 160 335 200 Q 330 240 320 270"
        stroke="url(#goldGradient)"
        strokeWidth="2"
        fill="none"
        className="drop-shadow-sm"
      />

      {/* Fiume Marecchia */}
      <path
        d="M 200 180 Q 240 170 280 160 Q 310 155 320 150"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />

      {/* Fiume Rubicone */}
      <path
        d="M 180 120 Q 220 115 260 110 Q 300 108 320 105"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />

      {/* Collina di San Leo - sagoma stilizzata */}
      <path
        d="M 120 80 L 135 70 L 150 80 L 145 90 L 125 90 Z"
        fill="rgba(205, 164, 52, 0.3)"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
      />

      {/* Gradara - rocca stilizzata */}
      <path
        d="M 180 60 L 190 50 L 200 60 L 195 70 L 185 70 Z"
        fill="rgba(205, 164, 52, 0.3)"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
      />

      {/* San Marino - monte stilizzato */}
      <path
        d="M 100 120 L 120 100 L 140 120 L 130 140 L 110 140 Z"
        fill="rgba(205, 164, 52, 0.3)"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
      />

      {/* Profilo delle colline dell'entroterra */}
      <path
        d="M 50 150 Q 80 140 120 145 Q 160 150 200 155 Q 240 160 280 165"
        stroke="url(#goldGradient)"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />

      {/* Elementi decorativi - piccole onde per il mare */}
      <path
        d="M 340 100 Q 345 95 350 100 Q 355 105 360 100"
        stroke="url(#goldGradient)"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M 340 140 Q 345 135 350 140 Q 355 145 360 140"
        stroke="url(#goldGradient)"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M 340 180 Q 345 175 350 180 Q 355 185 360 180"
        stroke="url(#goldGradient)"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />

      {/* Container per le icone dei badge - posizionate geograficamente */}
      {children}
    </svg>
  );
};

export default RomagnaMapSVG;
