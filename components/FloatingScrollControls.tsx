'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { playSound } from '@/utils/audio';

interface FloatingScrollControlsProps {
  virtualCursor?: { x: number; y: number; isDetected: boolean; isPinching?: boolean };
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  isVisible?: boolean;
}

export default function FloatingScrollControls({
  virtualCursor,
  scrollTargetRef,
  isVisible = true
}: FloatingScrollControlsProps) {
  const upBtnRef = useRef<HTMLButtonElement | null>(null);
  const downBtnRef = useRef<HTMLButtonElement | null>(null);

  const [isUpHovered, setIsUpHovered] = useState<boolean>(false);
  const [isDownHovered, setIsDownHovered] = useState<boolean>(false);

  // Auto-scroll on virtual cursor hover
  useEffect(() => {
    if (!isVisible || !virtualCursor || !virtualCursor.isDetected) {
      setIsUpHovered(false);
      setIsDownHovered(false);
      return;
    }

    const cursorPxX = (virtualCursor.x / 100) * window.innerWidth;
    const cursorPxY = (virtualCursor.y / 100) * window.innerHeight;

    let upInside = false;
    let downInside = false;

    if (upBtnRef.current) {
      const rect = upBtnRef.current.getBoundingClientRect();
      upInside = (
        cursorPxX >= rect.left &&
        cursorPxX <= rect.right &&
        cursorPxY >= rect.top &&
        cursorPxY <= rect.bottom
      );
    }

    if (downBtnRef.current) {
      const rect = downBtnRef.current.getBoundingClientRect();
      downInside = (
        cursorPxX >= rect.left &&
        cursorPxX <= rect.right &&
        cursorPxY >= rect.top &&
        cursorPxY <= rect.bottom
      );
    }

    setIsUpHovered(upInside);
    setIsDownHovered(downInside);

    let scrollInterval: NodeJS.Timeout | null = null;
    const target = scrollTargetRef?.current || window;

    if (upInside) {
      scrollInterval = setInterval(() => {
        target.scrollBy({ top: -18, behavior: 'auto' });
      }, 30);
    } else if (downInside) {
      scrollInterval = setInterval(() => {
        target.scrollBy({ top: 18, behavior: 'auto' });
      }, 30);
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [virtualCursor, isVisible, scrollTargetRef]);

  if (!isVisible) return null;

  const handleScrollUp = () => {
    playSound('pop');
    const target = scrollTargetRef?.current || window;
    target.scrollBy({ top: -250, behavior: 'smooth' });
  };

  const handleScrollDown = () => {
    playSound('pop');
    const target = scrollTargetRef?.current || window;
    target.scrollBy({ top: 250, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-3 bottom-24 md:bottom-28 z-40 flex flex-col gap-2 select-none animate-in fade-in">
      {/* Tombol Scroll Atas */}
      <button
        ref={upBtnRef}
        onClick={handleScrollUp}
        className={`w-10 h-10 md:w-11 md:h-11 border-3 border-black shadow-[3px_3px_0px_#000] flex flex-col items-center justify-center cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 ${
          isUpHovered 
            ? 'bg-[#00F5D4] scale-110 ring-3 ring-black text-black' 
            : 'bg-[#FFE600] hover:bg-yellow-300 text-black'
        }`}
        title="Scroll ke Atas"
        aria-label="Scroll ke Atas"
      >
        <ChevronUp className="w-5 h-5 stroke-[3]" />
        <span className="text-[8px] font-black leading-none uppercase">Atas</span>
      </button>

      {/* Tombol Scroll Bawah */}
      <button
        ref={downBtnRef}
        onClick={handleScrollDown}
        className={`w-10 h-10 md:w-11 md:h-11 border-3 border-black shadow-[3px_3px_0px_#000] flex flex-col items-center justify-center cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 ${
          isDownHovered 
            ? 'bg-[#00F5D4] scale-110 ring-3 ring-black text-black' 
            : 'bg-[#FFE600] hover:bg-yellow-300 text-black'
        }`}
        title="Scroll ke Bawah"
        aria-label="Scroll ke Bawah"
      >
        <ChevronDown className="w-5 h-5 stroke-[3]" />
        <span className="text-[8px] font-black leading-none uppercase">Bawah</span>
      </button>
    </div>
  );
}
