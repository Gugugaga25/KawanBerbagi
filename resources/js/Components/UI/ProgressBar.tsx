import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  sublabel?: string;
  isVisible: boolean;
}

export default function ProgressBar({
  progress,
  label = 'Memproses...',
  sublabel,
  isVisible
}: ProgressBarProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
        <div className="flex justify-between items-center text-[#124354]">
          <span className="font-extrabold text-sm tracking-wide">{label}</span>
          <span className="font-bold text-xs bg-[#407E8C]/10 text-[#407E8C] px-2.5 py-1 rounded-full">
            {Math.min(100, Math.max(0, Math.round(progress)))}%
          </span>
        </div>

        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5 border border-gray-200/50">
          <div 
            className="bg-gradient-to-r from-[#124354] to-[#407E8C] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>

        {sublabel && (
          <p className="text-xs text-gray-400 text-center font-medium">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
