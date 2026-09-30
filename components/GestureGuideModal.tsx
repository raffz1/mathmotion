'use client';

import React, { useEffect, useRef } from 'react';
import { X, Sparkles, MousePointer } from 'lucide-react';
import { playSound } from '@/utils/audio';

interface GestureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GestureGuideModal({ isOpen, onClose }: GestureGuideModalProps) {
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  // Reset scroll to top whenever modal opens & lock body scroll
  useEffect(() => {
    if (isOpen) {
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FFFDF0] border-4 border-black shadow-[10px_10px_0px_#000] flex flex-col p-5 md:p-6 overflow-hidden">
        
        {/* HEADER (Statis di Atas) */}
        <div className="bg-[#FFE600] p-3.5 md:p-4 border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#FF70A6] border-2 border-black p-1.5 shadow-[2px_2px_0px_#000]">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black uppercase text-black leading-tight">
                Cara Bermain Pakai Kamera
              </h2>
              <p className="text-[11px] md:text-xs font-medium text-gray-700">
                Mudah dan seru! Cukup gerakkan tangan dan kepalamu.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="bg-white hover:bg-[#FF0055] hover:text-white border-2 border-black p-1.5 font-bold shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0"
            aria-label="Tutup Panduan"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* BODY (3 LANGKAH - Scrollable) */}
        <div 
          ref={modalContentRef} 
          className="overflow-y-auto pr-2 flex-1 my-4 space-y-3"
        >
          {/* Langkah 1 */}
          <div className="bg-white border-3 border-black p-3.5 shadow-[3px_3px_0px_#000] flex items-start gap-3.5">
            <div className="bg-[#00F5D4] border-2 border-black w-11 h-11 shrink-0 flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
              👆
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black uppercase text-black">1. Arahkan Jari Telunjuk</h3>
              <p className="text-xs md:text-sm font-medium text-gray-700 leading-relaxed mt-0.5">
                Angkat tanganmu ke arah kamera. Kursor neon hijau di layar akan langsung mengikuti gerakan ujung jari telunjukmu.
              </p>
            </div>
          </div>

          {/* Langkah 2 */}
          <div className="bg-white border-3 border-black p-3.5 shadow-[3px_3px_0px_#000] flex items-start gap-3.5">
            <div className="bg-[#FFE600] border-2 border-black w-11 h-11 shrink-0 flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
              👌
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black uppercase text-black">2. Cubit & Tahan (0.8 Detik) untuk Memilih</h3>
              <p className="text-xs md:text-sm font-medium text-gray-700 leading-relaxed mt-0.5">
                Satukan jempol dan telunjuk rapat-rapat (Cubit) di atas kartu selama 0.8 detik hingga lingkaran penuh. Hover biasa tidak akan memilih jawaban secara otomatis.
              </p>
            </div>
          </div>

          {/* Langkah 3 */}
          <div className="bg-white border-3 border-black p-3.5 shadow-[3px_3px_0px_#000] flex items-start gap-3.5">
            <div className="bg-[#FF70A6] border-2 border-black w-11 h-11 shrink-0 flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
              👤
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black uppercase text-black">3. Geleng Kepala di Soal Benar/Salah</h3>
              <p className="text-xs md:text-sm font-medium text-gray-700 leading-relaxed mt-0.5">
                Di soal True/False (soal 16-20): Geleng ke <b>Kiri</b> untuk jawaban <span className="text-[#FF0055] font-bold">SALAH</span>, dan geleng ke <b>Kanan</b> untuk jawaban <span className="text-[#00A896] font-bold">BENAR</span>.
              </p>
            </div>
          </div>

          {/* Tips Santai */}
          <div className="bg-[#70D6FF] border-2 border-black p-2.5 text-xs font-medium text-gray-900 flex items-center gap-2 shadow-[2px_2px_0px_#000]">
            <MousePointer className="w-4 h-4 shrink-0 text-black" />
            <span>Mouse biasa atau layar sentuh tetap selalu bisa dipakai kapan saja jika kamera kurang terang.</span>
          </div>
        </div>

        {/* FOOTER (Statis di Bawah) */}
        <div className="pt-2 border-t-2 border-black/20 w-full flex justify-end shrink-0">
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-full sm:w-auto bg-[#FFE600] hover:bg-yellow-300 border-3 border-black px-6 py-2.5 font-black text-xs md:text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Siap, Ayo Mulai! 🚀
          </button>
        </div>

      </div>
    </div>
  );
}
