
import React from 'react';

interface RomagnaMapSVGProps {
  className?: string;
  children?: React.ReactNode;
}

const RomagnaMapSVG: React.FC<RomagnaMapSVGProps> = ({ className, children }) => {
  return (
    <svg
      viewBox="0 0 500 350"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Definizioni gradienti e pattern migliorati */}
      <defs>
        <pattern id="subtleTexture" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill="rgba(205, 164, 52, 0.03)" />
          <circle cx="3" cy="3" r="0.8" fill="rgba(205, 164, 52, 0.05)" />
        </pattern>
        
        <linearGradient id="coastGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6C866" />
          <stop offset="50%" stopColor="#CDA434" />
          <stop offset="100%" stopColor="#B8941F" />
        </linearGradient>

        <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(205, 164, 52, 0.15)" />
          <stop offset="100%" stopColor="rgba(205, 164, 52, 0.08)" />
        </linearGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Sfondo con texture sottile */}
      <rect width="500" height="350" fill="url(#subtleTexture)" />

      {/* Contorno principale della Romagna - design semplificato */}
      <path
        d="M 80 120 
           Q 120 80 180 85 
           Q 240 90 300 100
           L 350 110
           Q 380 120 400 140
           Q 420 160 415 200
           Q 410 240 395 270
           Q 380 290 350 285
           L 300 280
           Q 240 275 180 270
           Q 120 265 90 240
           Q 70 200 75 160
           Q 78 140 80 120 Z"
        fill="url(#landGradient)"
        stroke="url(#coastGradient)"
        strokeWidth="3"
        filter="url(#glow)"
        opacity="0.9"
      />

      {/* Costa Adriatica - linea principale semplificata */}
      <path
        d="M 350 110 Q 380 120 400 140 Q 420 160 415 200 Q 410 240 395 270 Q 380 290 350 285"
        stroke="url(#coastGradient)"
        strokeWidth="4"
        fill="none"
        filter="url(#glow)"
      />

      {/* Fiumi principali - più semplici e visibili */}
      <path
        d="M 150 180 Q 200 175 250 170 Q 300 165 350 160"
        stroke="url(#coastGradient)"
        strokeWidth="2.5"
        fill="none"
        opacity="0.7"
      />

      <path
        d="M 120 140 Q 170 135 220 130 Q 270 125 320 120"
        stroke="url(#coastGradient)"
        strokeWidth="2.5"
        fill="none"
        opacity="0.7"
      />

      {/* Punti di riferimento geografici migliorati */}
      
      {/* San Leo - collina stilizzata */}
      <g transform="translate(140, 120)">
        <path
          d="M 0 20 L 8 0 L 16 5 L 20 15 L 15 25 L 5 25 Z"
          fill="rgba(205, 164, 52, 0.4)"
          stroke="url(#coastGradient)"
          strokeWidth="2"
        />
        <text x="10" y="35" textAnchor="middle" className="fill-gold-400 text-xs font-medium">
          San Leo
        </text>
      </g>

      {/* San Marino - monte caratteristico */}
      <g transform="translate(100, 160)">
        <path
          d="M 0 25 L 10 0 L 20 8 L 25 20 L 20 30 L 5 30 Z"
          fill="rgba(205, 164, 52, 0.4)"
          stroke="url(#coastGradient)"
          strokeWidth="2"
        />
        <text x="12" y="40" textAnchor="middle" className="fill-gold-400 text-xs font-medium">
          San Marino
        </text>
      </g>

      {/* Rimini - simbolo costiero */}
      <g transform="translate(300, 200)">
        <circle
          cx="8"
          cy="8"
          r="8"
          fill="rgba(205, 164, 52, 0.4)"
          stroke="url(#coastGradient)"
          strokeWidth="2"
        />
        <text x="8" y="25" textAnchor="middle" className="fill-gold-400 text-xs font-medium">
          Rimini
        </text>
      </g>

      {/* Ravenna */}
      <g transform="translate(250, 120)">
        <rect
          x="0"
          y="0"
          width="12"
          height="12"
          fill="rgba(205, 164, 52, 0.4)"
          stroke="url(#coastGradient)"
          strokeWidth="2"
        />
        <text x="6" y="22" textAnchor="middle" className="fill-gold-400 text-xs font-medium">
          Ravenna
        </text>
      </g>

      {/* Rosa dei venti semplificata */}
      <g transform="translate(420, 40)">
        <circle cx="0" cy="0" r="25" fill="none" stroke="url(#coastGradient)" strokeWidth="1" opacity="0.6" />
        <path d="M 0 -20 L 3 -5 L 0 0 L -3 -5 Z" fill="url(#coastGradient)" />
        <text x="0" y="-30" textAnchor="middle" className="fill-gold-400 text-xs font-bold">N</text>
        <path d="M 20 0 L 5 3 L 0 0 L 5 -3 Z" fill="url(#coastGradient)" opacity="0.7" />
        <text x="30" y="3" textAnchor="middle" className="fill-gold-400 text-xs">E</text>
      </g>

      {/* Container per i badge - con posizioni ottimizzate */}
      {children}
    </svg>
  );
};

export default RomagnaMapSVG;
