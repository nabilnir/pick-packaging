"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export interface Announcement {
  id: string;
  message: string;
  href?: string;
}

export interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const count = announcements.length;

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || isPaused) return;
    intervalRef.current = setInterval(advance, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [count, isPaused, advance]);

  if (dismissed || count === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div
      className="w-full bg-[#1c3a2a] text-white flex items-center justify-between px-4 rounded-lg"
      style={{ height: '48px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Message */}
      <div className="flex-1 flex items-center justify-center min-w-0 gap-2">
        {current.href ? (
          <Link
            href={current.href}
            className="text-sm font-medium text-white/90 hover:text-white truncate transition-colors"
          >
            {current.message}
          </Link>
        ) : (
          <p className="text-sm font-medium text-white/90 truncate">
            {current.message}
          </p>
        )}
      </div>

      {/* Right side: dot indicators + dismiss */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        {/* Dot indicators — only when multiple */}
        {count > 1 && (
          <div className="flex items-center gap-1.5">
            {announcements.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to announcement ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentIndex
                    ? 'bg-teal-400 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="text-teal-400 hover:text-teal-300 transition-colors p-1 rounded"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
