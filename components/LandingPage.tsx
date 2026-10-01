'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Hand, BookOpen, Play, 
  HelpCircle, Volume2, VolumeX, CheckCircle2, User, Camera, CameraOff,
  ChevronUp, ChevronDown, Calculator
} from 'lucide-react';
import { Grade } from '@/data/questions';
import { LEARNING_MODULES, LearningModule } from '@/data/learningModules';
import LearningModal from '@/components/LearningModal';
import GestureGuideModal from '@/components/GestureGuideModal';
import { MathMascot } from '@/components/MathMascot';
import FloatingScrollControls from '@/components/FloatingScrollControls';
import { playSound, setSoundMuted, getSoundMuted } from '@/utils/audio';

interface LandingPageProps {
  studentName: string;
  setStudentName: (name: string) => void;
  selectedGrade: Grade;
  setSelectedGrade: (grade: Grade) => void;
  onStartGame: () => void;
}

export default function LandingPage({
  studentName,
  setStudentName,
  selectedGrade,
  setSelectedGrade,
  onStartGame
}: LandingPageProps) {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isMuted, setIsMutedState] = useState<boolean>(getSoundMuted());

  // Camera Toggle on Landing Page with LocalStorage Persistence
  const [isCameraActive, setIsCameraActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mathmotion_camera_active');
      return saved !== null ? JSON.parse(saved) : false;
    }
    return false;
  });

  const toggleCamera = (active: boolean) => {
    setIsCameraActive(active);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mathmotion_camera_active', JSON.stringify(active));
      } catch {}
    }
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Virtual Cursor State
  const [virtualCursor, setVirtualCursor] = useState({
    x: 50,
    y: 50,
    isPinching: false,
    isDetected: false
  });

  // Pinch and Hold (750ms) Progress (0 to 100)
  const [pinchProgress, setPinchProgress] = useState<number>(0);
  const pinchStartTimeRef = useRef<number | null>(null);
  const hasTriggeredClickRef = useRef<boolean>(false);

  // Scrolling State with Debounce (>400ms) & Deadzone (y < 10% / y > 92%)
  const [scrollZone, setScrollZone] = useState<'UP' | 'DOWN' | null>(null);
  const scrollStartTimeRef = useRef<{ zone: 'UP' | 'DOWN'; time: number } | null>(null);

  // Modal Scroll Container Ref
  const modalRef = useRef<HTMLDivElement | null>(null);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMutedState(next);
    setSoundMuted(next);
    if (!next) playSound('pop');
  };

  const isFormValid = studentName.trim().length >= 2;
  const currentModules = LEARNING_MODULES.filter(m => m.grade === selectedGrade);

  // ========================================================
  // LOCK BODY SCROLL & RESET SCROLL WHEN MODAL IS OPEN
  // ========================================================
  useEffect(() => {
    if (selectedModule || isGuideOpen) {
      document.body.style.overflow = 'hidden';
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedModule, isGuideOpen]);

  // ========================================================
  // 1. MEDIAPIPE CAMERA ON LANDING PAGE
  // ========================================================
  useEffect(() => {
    if (!isCameraActive) {
      setVirtualCursor(prev => ({ ...prev, isDetected: false }));
      setPinchProgress(0);
      setScrollZone(null);
      scrollStartTimeRef.current = null;
      return;
    }

    let camera: any = null;
    let hands: any = null;
    let isActive = true;

    const setupMediaPipe = async () => {
      if (!isActive) return;
      const win = window as any;

      if (!win.Hands || !win.Camera) {
        setTimeout(setupMediaPipe, 300);
        return;
      }

      hands = new win.Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
      });

      hands.onResults((results: any) => {
        if (!isActive) return;
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const lms = results.multiHandLandmarks[0];
          const indexFinger = lms[8];
          const thumb = lms[4];

          const curX = (1 - indexFinger.x) * 100;
          const curY = indexFinger.y * 100;

          // Pinch distance threshold (< 0.038)
          const pinchDist = Math.hypot(thumb.x - indexFinger.x, thumb.y - indexFinger.y);
          const isPinch = pinchDist < 0.038;

          setVirtualCursor({
            x: Math.max(2, Math.min(98, curX)),
            y: Math.max(2, Math.min(98, curY)),
            isPinching: isPinch,
            isDetected: true
          });
        } else {
          setVirtualCursor(prev => ({ ...prev, isDetected: false }));
        }
      });

      if (videoRef.current) {
        try {
          camera = new win.Camera(videoRef.current, {
            onFrame: async () => {
              if (!videoRef.current || !isActive) return;
              try {
                if (hands) await hands.send({ image: videoRef.current });
              } catch {}
            },
            width: 480,
            height: 360
          });
          camera.start();
        } catch (err) {
          console.warn('Camera start error:', err);
        }
      }
    };

    setupMediaPipe();

    return () => {
      isActive = false;
      if (camera) {
        try { camera.stop(); } catch {}
      }
    };
  }, [isCameraActive]);

  // ========================================================
  // 2. EDGE SCROLLING WITH WIDE ZONES (<18% / >75%) & >300ms DEBOUNCE
  // ========================================================
  useEffect(() => {
    if (!isCameraActive || !virtualCursor.isDetected) {
      setScrollZone(null);
      scrollStartTimeRef.current = null;
      return;
    }

    let scrollInterval: NodeJS.Timeout | null = null;
    const scrollTarget = (selectedModule && modalRef.current) ? modalRef.current : window;
    const now = Date.now();

    if (virtualCursor.y < 18) {
      if (!scrollStartTimeRef.current || scrollStartTimeRef.current.zone !== 'UP') {
        scrollStartTimeRef.current = { zone: 'UP', time: now };
      }

      const elapsed = now - scrollStartTimeRef.current.time;
      if (elapsed > 300) {
        setScrollZone('UP');
        scrollInterval = setInterval(() => {
          scrollTarget.scrollBy({ top: -16, behavior: 'auto' });
        }, 30);
      }
    } else if (virtualCursor.y > 75) {
      if (!scrollStartTimeRef.current || scrollStartTimeRef.current.zone !== 'DOWN') {
        scrollStartTimeRef.current = { zone: 'DOWN', time: now };
      }

      const elapsed = now - scrollStartTimeRef.current.time;
      if (elapsed > 300) {
        setScrollZone('DOWN');
        scrollInterval = setInterval(() => {
          scrollTarget.scrollBy({ top: 16, behavior: 'auto' });
        }, 30);
      }
    } else {
      scrollStartTimeRef.current = null;
      setScrollZone(null);
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [virtualCursor.y, virtualCursor.isDetected, isCameraActive, selectedModule]);

  // ========================================================
  // 3. PINCH & HOLD 750ms CLICK MECHANIC
  // ========================================================
  useEffect(() => {
    if (!isCameraActive || !virtualCursor.isDetected) {
      setPinchProgress(0);
      pinchStartTimeRef.current = null;
      hasTriggeredClickRef.current = false;
      return;
    }

    let progressInterval: NodeJS.Timeout | null = null;

    if (virtualCursor.isPinching) {
      if (!pinchStartTimeRef.current) {
        pinchStartTimeRef.current = Date.now();
      }

      progressInterval = setInterval(() => {
        const elapsed = Date.now() - (pinchStartTimeRef.current || Date.now());
        const prog = Math.min(100, Math.round((elapsed / 750) * 100)); // 750ms hold
        setPinchProgress(prog);

        if (prog >= 100 && !hasTriggeredClickRef.current) {
          hasTriggeredClickRef.current = true;
          playSound('pop');

          const cursorPxX = (virtualCursor.x / 100) * window.innerWidth;
          const cursorPxY = (virtualCursor.y / 100) * window.innerHeight;
          const el = document.elementFromPoint(cursorPxX, cursorPxY) as HTMLElement | null;

          if (el) {
            const clickable = el.closest('button, [role="button"], a, input') as HTMLElement | null;
            if (clickable) {
              clickable.click();
            } else {
              el.click();
            }
          }
        }
      }, 40);
    } else {
      pinchStartTimeRef.current = null;
      hasTriggeredClickRef.current = false;
      setPinchProgress(0);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [virtualCursor.isPinching, virtualCursor.isDetected, isCameraActive, virtualCursor.x, virtualCursor.y]);

  return (
    <div className="min-h-screen w-full flex flex-col justify-between relative">

      {/* ======================================================== */}
      {/* FLOATING SCROLL INDICATOR CUES */}
      {/* ======================================================== */}
      {scrollZone === 'UP' && (
        <div className="scroll-indicator-top animate-pulse">
          <div className="bg-[#FFE600] border-2 border-black px-4 py-1 flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
            <ChevronUp className="w-5 h-5 text-black stroke-[3]" />
            <span className="text-xs font-black uppercase text-black">Menggulung ke Atas</span>
          </div>
        </div>
      )}

      {scrollZone === 'DOWN' && (
        <div className="scroll-indicator-bottom animate-pulse">
          <div className="bg-[#FFE600] border-2 border-black px-4 py-1 flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
            <ChevronDown className="w-5 h-5 text-black stroke-[3]" />
            <span className="text-xs font-black uppercase text-black">Menggulung ke Bawah</span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TOUCHLESS VIRTUAL CURSOR (LANDING PAGE) */}
      {/* ======================================================== */}
      {isCameraActive && virtualCursor.isDetected && (
        <div
          className="fixed pointer-events-none z-[99999] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${virtualCursor.x}%`, top: `${virtualCursor.y}%` }}
        >
          <div className={`relative flex items-center justify-center rounded-full border-4 border-black transition-all ${
            virtualCursor.isPinching
              ? 'w-14 h-14 bg-[#FF0055] scale-110 shadow-[0_0_15px_#FF0055]'
              : 'w-11 h-11 bg-[#00F5D4] shadow-[3px_3px_0px_#000]'
          }`}>
            <span className="text-[10px] font-black uppercase text-black">
              {virtualCursor.isPinching ? 'HOLD' : '👆'}
            </span>

            {/* Circular Progress Ring for Pinch & Hold 750ms */}
            {pinchProgress > 0 && (
              <svg className="absolute -inset-1.5 w-16 h-16 pointer-events-none -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-[#FFE600] fill-none"
                  strokeWidth="5"
                  strokeDasharray="163.36"
                  strokeDashoffset={163.36 - (163.36 * pinchProgress) / 100}
                />
              </svg>
            )}
          </div>
        </div>
      )}
      
      {/* ======================================================== */}
      {/* 1. TOP NAVBAR / HEADER (STICKY FULL-WIDTH) */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 w-full bg-[#FFE600] border-b-4 border-black px-4 md:px-8 py-3 md:py-3.5 shadow-[0px_4px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* CUSTOM MASCOT LOGO */}
          <MathMascot className="w-11 h-11 md:w-12 md:h-12" />
          <div>
            <span className="font-bold text-[11px] tracking-wider text-black/80 uppercase block">
            </span>
            <h1 className="font-brand text-2xl md:text-3xl font-black uppercase tracking-wider leading-tight drop-shadow-[2px_2px_0px_#FFF] select-none">
              <span className="text-[#FF0055]">MATH</span>
              <span className="text-black">MOTION</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* CAMERA GESTURE TOGGLE BUTTON */}
          <button
            onClick={() => {
              const next = !isCameraActive;
              toggleCamera(next);
              playSound('click');
            }}
            className={`border-3 border-black px-3.5 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer transition-all ${
              isCameraActive ? 'bg-[#00F5D4] text-black ring-2 ring-black' : 'bg-white hover:bg-gray-100 text-black'
            }`}
          >
            {isCameraActive ? (
              <>
                <Camera className="w-4 h-4 text-black" />
                <span>Kontrol Gesture ON 🟢</span>
              </>
            ) : (
              <>
                <CameraOff className="w-4 h-4 text-gray-700" />
                <span>Kontrol Gestur OFF 🔴</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              playSound('click');
              setIsGuideOpen(true);
            }}
            className="bg-white hover:bg-[#70D6FF] border-3 border-black px-3 py-2 text-xs font-bold uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" /> Cara Main
          </button>

          <button
            onClick={toggleSound}
            className={`border-3 border-black p-2 text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
              isMuted ? 'bg-gray-200 text-gray-600' : 'bg-[#00F5D4] text-black'
            }`}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Notice on Gesture Camera Active (Full Width Sub-bar) */}
      {isCameraActive && (
        <div className="w-full bg-[#00F5D4] border-b-3 border-black px-4 md:px-8 py-2.5 shadow-[0px_2px_0px_#000] animate-in fade-in">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-black">
            <div className="flex items-center gap-2">
              <Hand className="w-5 h-5 text-black shrink-0" />
              <span>Kamera gesture aktif! Kamu bisa gerakkan telunjukmu, cubit + tahan untuk mengklik, dan arahkan ke atas/bawah layar untuk scroll.</span>
            </div>
            <button
              onClick={() => toggleCamera(false)}
              className="bg-white hover:bg-gray-100 border-2 border-black px-2.5 py-1 font-black uppercase shadow-[1px_1px_0px_#000] text-[10px] cursor-pointer shrink-0"
            >
              Matikan
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN CONTAINER (FULL-WIDTH & LEGA) */}
      {/* ======================================================== */}
      <main className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-10 flex-1">

        {/* ======================================================== */}
        {/* 2. HERO INTRO (CLEAN & NON-CROWDED) */}
        {/* ======================================================== */}
        <section className="space-y-4 py-2 md:py-4">
          <span className="text-xs font-black uppercase bg-[#70D6FF] border-2 border-black px-3 py-1 shadow-[2px_2px_0px_#000] inline-block">
            Belajar Matematika Tanpa Sentuh Layar
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-black leading-tight tracking-tight">
            Asah Fokus dan Matematikamu Lewat Gerakan Kamera AI!
          </h2>
          <p className="text-base md:text-lg font-medium text-gray-700 leading-relaxed max-w-3xl">
            Platform media pembelajaran matematika kinetik tanpa sentuhan fisik berbasis web camera untuk melatih fokus, motorik, dan pemahaman konsep siswa SD.
          </p>
        </section>

        {/* ======================================================== */}
        {/* 3. FORM SISWA & PILIHAN KELAS */}
        {/* ======================================================== */}
        <section className="bg-[#FFFDF0] border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_#000] space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-black pb-3">
            <User className="w-5 h-5 text-black stroke-[2.5]" />
            <h3 className="text-xl font-black uppercase text-black">DIISI DULU, YAK</h3>
          </div>

          <div className="space-y-4">
            
            {/* Input Nama */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 block">
                Nama Kamu
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ketik nama kamu di sini..."
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full bg-white border-3 border-black p-3.5 text-base font-bold text-black placeholder:font-normal placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFE600] shadow-[3px_3px_0px_#000]"
                  maxLength={40}
                />
                {studentName.trim().length >= 2 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#00F5D4] border border-black p-1">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                  </div>
                )}
              </div>
              <p className="text-xs font-normal text-gray-600">
                * Nama akan dicantumkan pada kartu laporan hasil dan piagam prestasi kuis.
              </p>
            </div>

            {/* Pilihan Kelas */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-gray-800 block">
                Kelas Berapa?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGrade(5);
                    playSound('pop');
                  }}
                  className={`border-3 border-black p-4 text-left transition-all cursor-pointer ${
                    selectedGrade === 5
                      ? 'bg-[#FFE600] shadow-[4px_4px_0px_#000] -translate-y-0.5 ring-2 ring-black'
                      : 'bg-white hover:bg-yellow-50 shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5">Tingkat SD</span>
                    {selectedGrade === 5 && <span className="text-xs font-black text-black">✓ Terpilih</span>}
                  </div>
                  <h4 className="text-lg font-black uppercase mt-1">Kelas 5 SD</h4>
                  <p className="text-xs font-medium text-gray-700 mt-0.5">
                    KPK, FPB, Pecahan Senilai, dan Geometri Bangun Datar
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedGrade(6);
                    playSound('pop');
                  }}
                  className={`border-3 border-black p-4 text-left transition-all cursor-pointer ${
                    selectedGrade === 6
                      ? 'bg-[#FF70A6] shadow-[4px_4px_0px_#000] -translate-y-0.5 ring-2 ring-black'
                      : 'bg-white hover:bg-pink-50 shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5">Tingkat SD</span>
                    {selectedGrade === 6 && <span className="text-xs font-black text-black">✓ Terpilih</span>}
                  </div>
                  <h4 className="text-lg font-black uppercase mt-1">Kelas 6 SD</h4>
                  <p className="text-xs font-medium text-gray-700 mt-0.5">
                    Bilangan Negatif, Perkalian Pecahan, Rasio, dan Pola
                  </p>
                </button>

              </div>
            </div>

            {/* Tombol Mulai */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-medium text-gray-700">
                {!isFormValid ? (
                  <span className="text-[#FF0055] font-bold">
                    ⚠️ Kamu WAJIB mengisi nama dan pilih kelas dulu!
                  </span>
                ) : (
                  <span className="text-black font-bold">
                    ✨ Aku udah SIAP! Gas klik tombol MULAI-nya.
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  if (!isFormValid) return;
                  playSound('click');
                  try {
                    localStorage.setItem('mathmotion_camera_active', 'true');
                  } catch {}
                  onStartGame();
                }}
                disabled={!isFormValid}
                className={`w-full sm:w-auto px-8 py-4 font-black text-base uppercase border-4 border-black transition-all flex items-center justify-center gap-2.5 ${
                  isFormValid
                    ? 'bg-[#00F5D4] hover:bg-teal-300 shadow-[5px_5px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer'
                    : 'bg-gray-200 text-gray-400 border-gray-400 shadow-none cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5 fill-current" /> UDAH SIAP NIH, MULAI!
              </button>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. MODUL MATERI & MINI QUIZ */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-2 bg-white border-3 border-black px-4 py-1.5 shadow-[4px_4px_0px_#000]">
              <BookOpen className="w-5 h-5 text-black stroke-[2.5]" />
              <h3 className="font-black text-lg md:text-xl uppercase text-black">
                Materi Belajar Kelas {selectedGrade}
              </h3>
            </div>
            <div className="inline-block bg-white/90 border border-black/20 px-3 py-1 text-xs font-medium text-gray-700 shadow-xs">
              YUK! Buka materi, pelajari studi kasus, dan coba kuis mini sebelum memulai kuis utama
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentModules.map(mod => (
              <div
                key={mod.id}
                className="bg-white border-4 border-black shadow-[5px_5px_0px_#000] flex flex-col justify-between transition-all hover:-translate-y-0.5"
              >
                {/* 1. BADGE & JUDUL */}
                <div className="p-4 border-b-3 border-black" style={{ backgroundColor: mod.color }}>
                  <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 inline-block mb-1.5 shadow-[1px_1px_0px_#000]">
                    {mod.badge}
                  </span>
                  <h4 className="text-base md:text-lg font-black uppercase text-black leading-snug">
                    {mod.title}
                  </h4>
                </div>

                {/* 2. 1 PARAGRAF DESKRIPSI RAMAH ANAK */}
                <div className="p-4 flex-1">
                  <p className="text-sm font-medium text-gray-700 leading-relaxed">
                    {mod.summary}
                  </p>
                </div>

                {/* 3. TOMBOL BUKA MATERI */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      playSound('pop');
                      setSelectedModule(mod);
                    }}
                    className="w-full bg-[#FFE600] hover:bg-yellow-300 border-3 border-black py-2.5 px-3 font-bold text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Buka Materi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ======================================================== */}
      {/* 5. MODALS & BACKGROUND UTILITIES */}
      {/* ======================================================== */}
      <LearningModal 
        module={selectedModule} 
        onClose={() => setSelectedModule(null)} 
        containerRef={modalRef}
      />

      <GestureGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Hidden Video Feed on Landing Page */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="hidden"
      />

      {/* FLOATING SCROLL CONTROLS FOR GESTURE & MOBILE */}
      <FloatingScrollControls 
        virtualCursor={virtualCursor}
        scrollTargetRef={modalRef}
        isVisible={isCameraActive && virtualCursor.isDetected}
      />

      {/* ======================================================== */}
      {/* 6. FOOTER FULL-WIDTH */}
      {/* ======================================================== */}
      <footer className="w-full bg-white border-t-4 border-black py-6 text-center font-bold text-sm mt-12 shadow-[0px_-4px_0px_#000]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm font-bold text-gray-700">
          <span>MathMotion © 2026 • Kurikulum Merdeka Matematika Kinetik SD</span>
          <span className="bg-[#FFE600] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000] text-xs font-black uppercase text-black">
            Platform Edukasi AI Kinetik
          </span>
        </div>
      </footer>

    </div>
  );
}
