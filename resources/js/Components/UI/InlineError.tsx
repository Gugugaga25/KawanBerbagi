import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InlineErrorProps {
  message?: string;
  className?: string;
}

export default function InlineError({ message, className = '' }: InlineErrorProps) {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-1.5 mt-1.5 text-xs text-red-600 font-semibold ${className}`}>
      <AlertCircle size={14} className="shrink-0 text-red-500" />
      <span>{message}</span>
    </div>
  );
}
