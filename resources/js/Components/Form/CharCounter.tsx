import React from 'react';

interface CharCounterProps {
  current: number;
  max: number;
  className?: string;
}

export default function CharCounter({ current, max, className = '' }: CharCounterProps) {
  const isNearLimit = current >= max * 0.85;
  const isOverLimit = current > max;

  return (
    <span 
      className={`text-[11px] font-semibold transition-colors ${
        isOverLimit 
          ? 'text-red-500 font-bold' 
          : isNearLimit 
          ? 'text-amber-600 font-bold' 
          : 'text-gray-400'
      } ${className}`}
    >
      {current} / {max} karakter
    </span>
  );
}
