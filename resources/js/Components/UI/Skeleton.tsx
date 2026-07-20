import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200/70 rounded-xl ${className}`} />
  );
}

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="w-10 h-10 rounded-2xl" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
}

export function SkeletonChat() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-10 w-2/3 rounded-2xl rounded-tl-none" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex items-end justify-end gap-3">
        <div className="space-y-2 flex flex-col items-end flex-1">
          <Skeleton className="h-12 w-1/2 rounded-2xl rounded-tr-none" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      </div>
      <div className="flex items-start gap-3">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-14 w-3/4 rounded-2xl rounded-tl-none" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
