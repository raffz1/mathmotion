'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, CheckCircle2, XCircle, RefreshCw, Home,
  Star, ChevronDown, ChevronUp, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Grade } from '@/data/questions';
import { playSound } from '@/utils/audio';
import FloatingScrollControls from '@/components/FloatingScrollControls';

export interface AnswerRecord {
  questionNumber: number;
  type: 'HAND' | 'HEAD';
  questionText: string;
  topic: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

interface ResultPageProps {
  studentName: string;
  selectedGrade: Grade;
  score: number;
  answers: AnswerRecord[];
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export default function ResultPage({
  studentName,
  selectedGrade,
  score,
  answers,
  onPlayAgain,
  onBackToHome
}: ResultPageProps) {
  const [filter, setFilter] = useState<'ALL' | 'WRONG' | 'CORRECT'>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const totalQuestions = answers.length || 20;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const wrongCount = totalQuestions - correctCount;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  // ========================================================
  // 1. TOUCHLESS GESTURE STATE & REFS
  // ========================================================
  const [virtualCursor, setVirtualCursor] = useState({
    x: 50,
    y: 50,
    isPinching: false,
    isDetected: false
  });

  const [pinchProgress, setPinchProgress] = useState<number>(0);
  const pinchStartTimeRef = useRef<number | null>(null);
  const hasTriggeredPinchRef = useRef<boolean>(false);
  const lastHoveredKeyRef = useRef<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playAgainBtnRef = useRef<HTMLButtonElement | null>(null);
  const backHomeBtnRef = useRef<HTMLButtonElement | null>(null);
  const filterAllBtnRef = useRef<HTMLButtonElement | null>(null);
  const filterWrongBtnRef = useRef<HTMLButtonElement | null>(null);
  const filterCorrectBtnRef = useRef<HTMLButtonElement | null>(null);
  const accordionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // Initial Celebration
  useEffect(() => {
    playSound('fanfare');
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#FFE600', '#FF70A6', '#00F5D4', '#70D6FF', '#FF9770']
    });
  }, []);

  // ========================================================
  // 2. MEDIAPIPE HAND TRACKING IN RESULT PAGE
  // ========================================================
  useEffect(() => {
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
          console.warn('ResultPage camera start error:', err);
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
  }, []);

  // ========================================================
  // 3. EDGE SCROLLING IN RESULT PAGE (<18% / >75%)
  // ========================================================
  useEffect(() => {
    if (!virtualCursor.isDetected) return;

    let scrollInterval: NodeJS.Timeout | null = null;
    if (virtualCursor.y < 18) {
      scrollInterval = setInterval(() => {
        window.scrollBy({ top: -16, behavior: 'auto' });
      }, 30);
    } else if (virtualCursor.y > 75) {
      scrollInterval = setInterval(() => {
        window.scrollBy({ top: 16, behavior: 'auto' });
      }, 30);
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [virtualCursor.y, virtualCursor.isDetected]);

  // ========================================================
  // 4. PINCH & HOLD (750ms) INTERACTION FOR BUTTONS & ACCORDION
  // ========================================================
  useEffect(() => {
    if (!virtualCursor.isDetected) {
      setHoveredKey(null);
      setPinchProgress(0);
      pinchStartTimeRef.current = null;
      hasTriggeredPinchRef.current = false;
      return;
    }

    const cursorPxX = (virtualCursor.x / 100) * window.innerWidth;
    const cursorPxY = (virtualCursor.y / 100) * window.innerHeight;

    let activeKey: string | null = null;
    let activeAction: (() => void) | null = null;

    // Check Play Again Button
    if (playAgainBtnRef.current) {
      const rect = playAgainBtnRef.current.getBoundingClientRect();
      if (cursorPxX >= rect.left && cursorPxX <= rect.right && cursorPxY >= rect.top && cursorPxY <= rect.bottom) {
        activeKey = 'PLAY_AGAIN';
        activeAction = () => {
          playSound('click');
          try { localStorage.setItem('mathmotion_camera_active', 'true'); } catch {}
          onPlayAgain();
        };
      }
    }

    // Check Back Home Button
    if (!activeKey && backHomeBtnRef.current) {
      const rect = backHomeBtnRef.current.getBoundingClientRect();
      if (cursorPxX >= rect.left && cursorPxX <= rect.right && cursorPxY >= rect.top && cursorPxY <= rect.bottom) {
        activeKey = 'BACK_HOME';
        activeAction = () => {
          playSound('click');
          try { localStorage.setItem('mathmotion_camera_active', 'true'); } catch {}
          onBackToHome();
        };
      }
    }

    // Check Filter All Button
    if (!activeKey && filterAllBtnRef.current) {
      const rect = filterAllBtnRef.current.getBoundingClientRect();
      if (cursorPxX >= rect.left && cursorPxX <= rect.right && cursorPxY >= rect.top && cursorPxY <= rect.bottom) {
        activeKey = 'FILTER_ALL';
        activeAction = () => { setFilter('ALL'); playSound('pop'); };
      }
    }

    // Check Filter Wrong Button
    if (!activeKey && filterWrongBtnRef.current) {
      const rect = filterWrongBtnRef.current.getBoundingClientRect();
      if (cursorPxX >= rect.left && cursorPxX <= rect.right && cursorPxY >= rect.top && cursorPxY <= rect.bottom) {
        activeKey = 'FILTER_WRONG';
        activeAction = () => { setFilter('WRONG'); playSound('pop'); };
      }
    }

    // Check Filter Correct Button
    if (!activeKey && filterCorrectBtnRef.current) {
      const rect = filterCorrectBtnRef.current.getBoundingClientRect();
      if (cursorPxX >= rect.left && cursorPxX <= rect.right && cursorPxY >= rect.top && cursorPxY <= rect.bottom) {
        activeKey = 'FILTER_CORRECT';
        activeAction = () => { setFilter('CORRECT'); playSound('pop'); };
      }
    }

    // Check Accordion Items
    if (!activeKey) {
      for (const [qNumStr, el] of Object.entries(accordionRefs.current)) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (cursorPxX >= rect.left && cursorPxX <= rect.right && cursorPxY >= rect.top && cursorPxY <= rect.bottom) {
          const qNum = parseInt(qNumStr, 10);
          activeKey = `ACCORDION_${qNum}`;
          activeAction = () => {
            playSound('pop');
            setExpandedId(prev => (prev === qNum ? null : qNum));
          };
          break;
        }
      }
    }

    setHoveredKey(activeKey);

    // Reset progress if target changed
    if (activeKey !== lastHoveredKeyRef.current) {
      lastHoveredKeyRef.current = activeKey;
      pinchStartTimeRef.current = null;
      hasTriggeredPinchRef.current = false;
      setPinchProgress(0);
    }

    if (!activeKey || !activeAction) {
      pinchStartTimeRef.current = null;
      hasTriggeredPinchRef.current = false;
      setPinchProgress(0);
      return;
    }

    // Pinch and Hold logic
    if (virtualCursor.isPinching) {
      if (!pinchStartTimeRef.current) {
        pinchStartTimeRef.current = Date.now();
      }

      const elapsed = Date.now() - pinchStartTimeRef.current;
      const prog = Math.min(100, Math.round((elapsed / 750) * 100));
      setPinchProgress(prog);

      if (prog >= 100 && !hasTriggeredPinchRef.current) {
        hasTriggeredPinchRef.current = true;
        activeAction();
      }
    } else {
      pinchStartTimeRef.current = null;
      hasTriggeredPinchRef.current = false;
      setPinchProgress(0);
    }
  }, [virtualCursor, onPlayAgain, onBackToHome]);

  let badgeTitle = 'Peserta Tangguh';
  let stars = 3;
  if (accuracy >= 90) {
    badgeTitle = '🌟 AMZINGGGG';
    stars = 5;
  } else if (accuracy >= 75) {
    badgeTitle = '🥇 Mantap, Bagus, Keren';
    stars = 4;
  } else if (accuracy >= 60) {
    badgeTitle = '🥈 Sip, Udah Hebat Banget';
    stars = 3;
  } else {
    badgeTitle = '🥉 Lebih Semangat Lagi Belajar';
    stars = 2;
  }

  const filteredAnswers = answers.filter(a => {
    if (filter === 'WRONG') return !a.isCorrect;
    if (filter === 'CORRECT') return a.isCorrect;
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4 md:py-8 relative">
      
      {/* ======================================================== */}
      {/* TOUCHLESS VIRTUAL CURSOR WITH CIRCULAR PROGRESS RING */}
      {/* ======================================================== */}
      {virtualCursor.isDetected && (
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
      {/* 1. HERO HEADER: SAMBUTAN PERSONAL */}
      {/* ======================================================== */}
      <section className="bg-[#FFE600] border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_#000] text-center space-y-3">
        <span className="bg-black text-white text-xs font-bold uppercase px-3 py-1 inline-block">
          Laporan Hasil Kuis • Kelas {selectedGrade} SD
        </span>
        
        <h1 className="text-2xl md:text-4xl font-black uppercase text-black">
          Hebat Sekali kamu, <span className="bg-white px-2.5 border-2 border-black inline-block shadow-[2px_2px_0px_#000]">{studentName}</span>
        </h1>
        
        <p className="text-sm md:text-base font-medium text-gray-800">
          Kamu udah menyelesaikan seluruh 20 soal matematika dengan penuh semangat!
          Seru ga cubit-cubit sama geleng kepala?
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-7 h-7 stroke-[2.5] ${
                i < stars ? 'fill-[#FF0055] text-black' : 'fill-gray-200 text-gray-400'
              }`}
            />
          ))}
        </div>
        <div>
          <span className="bg-[#00F5D4] border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_#000] inline-block">
            Predikat: {badgeTitle}
          </span>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. STATISTIK HASIL RINGKAS */}
      {/* ======================================================== */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        
        <div className="bg-[#00F5D4] border-3 border-black p-4 text-center shadow-[4px_4px_0px_#000]">
          <span className="text-xs font-bold uppercase text-gray-800 block">Total Skor</span>
          <p className="text-3xl md:text-4xl font-black text-black my-1">{score}</p>
          <span className="text-xs font-medium text-gray-700">Poin Terkumpul</span>
        </div>

        <div className="bg-[#70D6FF] border-3 border-black p-4 text-center shadow-[4px_4px_0px_#000]">
          <span className="text-xs font-bold uppercase text-gray-800 block">Akurasi</span>
          <p className="text-3xl md:text-4xl font-black text-black my-1">{accuracy}%</p>
          <span className="text-xs font-medium text-gray-700">{correctCount} dari 20 Soal</span>
        </div>

        <div className="bg-white border-3 border-black p-4 text-center shadow-[4px_4px_0px_#000]">
          <span className="text-xs font-bold uppercase text-[#00A896] block">Jawaban Benar</span>
          <p className="text-3xl md:text-4xl font-black text-[#00A896] my-1">{correctCount}</p>
          <span className="text-xs font-medium text-gray-600">✓ Tepat</span>
        </div>

        <div className="bg-white border-3 border-black p-4 text-center shadow-[4px_4px_0px_#000]">
          <span className="text-xs font-bold uppercase text-[#FF0055] block">Jawaban Salah</span>
          <p className="text-3xl md:text-4xl font-black text-[#FF0055] my-1">{wrongCount}</p>
          <span className="text-xs font-medium text-gray-600">✗ Perlu Belajar</span>
        </div>

      </section>

      {/* ======================================================== */}
      {/* 3. TOMBOL AKSI */}
      {/* ======================================================== */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          ref={playAgainBtnRef}
          onClick={() => {
            playSound('click');
            try { localStorage.setItem('mathmotion_camera_active', 'true'); } catch {}
            onPlayAgain();
          }}
          className={`w-full sm:w-auto bg-[#FFE600] hover:bg-yellow-300 border-3 border-black px-6 py-3.5 font-black text-sm uppercase shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all ${
            hoveredKey === 'PLAY_AGAIN' ? 'ring-3 ring-black -translate-y-0.5' : ''
          }`}
        >
          <RefreshCw className="w-4 h-4 stroke-[2.5]" /> Mau Main Ulang
        </button>

        <button
          ref={backHomeBtnRef}
          onClick={() => {
            playSound('click');
            try { localStorage.setItem('mathmotion_camera_active', 'true'); } catch {}
            onBackToHome();
          }}
          className={`w-full sm:w-auto bg-white hover:bg-gray-100 border-3 border-black px-6 py-3.5 font-bold text-sm uppercase shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all ${
            hoveredKey === 'BACK_HOME' ? 'ring-3 ring-black -translate-y-0.5' : ''
          }`}
        >
          <Home className="w-4 h-4 stroke-[2.5]" /> Kembali ke Beranda Aja Deh
        </button>
      </section>

      {/* ======================================================== */}
      {/* 4. ACCORDION EVALUASI & PEMBAHASAN SOAL */}
      {/* ======================================================== */}
      <section className="bg-white border-4 border-black p-5 md:p-7 shadow-[6px_6px_0px_#000] space-y-5">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-3">
          <div>
            <h2 className="text-xl font-black uppercase text-black flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-black stroke-[2.5]" /> Pembahasan Soal
            </h2>
            <p className="text-xs font-normal text-gray-600">
              Arahkan kursor & cubit (atau klik) setiap soal untuk melihat penjelasan lengkapnya
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              ref={filterAllBtnRef}
              onClick={() => { setFilter('ALL'); playSound('pop'); }}
              className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-all ${
                filter === 'ALL' ? 'bg-[#FFE600]' : 'bg-white'
              } ${hoveredKey === 'FILTER_ALL' ? 'ring-2 ring-black' : ''}`}
            >
              Semua ({totalQuestions})
            </button>
            <button
              ref={filterWrongBtnRef}
              onClick={() => { setFilter('WRONG'); playSound('pop'); }}
              className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-all ${
                filter === 'WRONG' ? 'bg-[#FF70A6]' : 'bg-white'
              } ${hoveredKey === 'FILTER_WRONG' ? 'ring-2 ring-black' : ''}`}
            >
              Salah ({wrongCount})
            </button>
            <button
              ref={filterCorrectBtnRef}
              onClick={() => { setFilter('CORRECT'); playSound('pop'); }}
              className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-all ${
                filter === 'CORRECT' ? 'bg-[#00F5D4]' : 'bg-white'
              } ${hoveredKey === 'FILTER_CORRECT' ? 'ring-2 ring-black' : ''}`}
            >
              Benar ({correctCount})
            </button>
          </div>
        </div>

        {/* List Soal */}
        <div className="space-y-3">
          {filteredAnswers.map(ans => {
            const isExpanded = expandedId === ans.questionNumber;
            const isTargetHovered = hoveredKey === `ACCORDION_${ans.questionNumber}`;

            return (
              <div
                key={ans.questionNumber}
                ref={el => { accordionRefs.current[ans.questionNumber] = el; }}
                className={`border-3 border-black transition-all ${
                  ans.isCorrect ? 'bg-[#FFFDF0]' : 'bg-red-50'
                } shadow-[3px_3px_0px_#000] ${isTargetHovered ? 'ring-3 ring-black -translate-y-0.5' : ''}`}
              >
                <div
                  onClick={() => {
                    playSound('pop');
                    setExpandedId(isExpanded ? null : ans.questionNumber);
                  }}
                  className="p-3.5 md:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-black/5"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {ans.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-[#00A896] stroke-[2.5]" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#FF0055] stroke-[2.5]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="bg-black text-white text-[10px] font-bold uppercase px-1.5 py-0.2">
                          Soal {ans.questionNumber} ({ans.type === 'HEAD' ? 'True/False' : 'Pilihan Ganda'})
                        </span>
                        <span className="text-[10px] font-medium text-gray-600">
                          {ans.topic}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-black">
                        {ans.questionText}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 border border-black ${
                      ans.isCorrect ? 'bg-[#00F5D4]' : 'bg-[#FF70A6]'
                    }`}>
                      {ans.isCorrect ? 'Benar' : 'Salah'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 border-t-2 border-black space-y-3 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="bg-[#FFFDF0] border border-black p-2.5">
                        <span className="text-[10px] font-medium text-gray-500 block">Jawaban Kamu:</span>
                        <p className={`text-sm font-bold ${ans.isCorrect ? 'text-black' : 'text-[#FF0055]'}`}>
                          {ans.studentAnswer}
                        </p>
                      </div>
                      <div className="bg-[#00F5D4]/15 border border-black p-2.5">
                        <span className="text-[10px] font-medium text-gray-500 block">Kunci Jawaban Benar:</span>
                        <p className="text-sm font-bold text-black">
                          {ans.correctAnswer}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#FFE600]/40 border border-black p-3 space-y-1">
                      <span className="text-xs font-bold text-black block">📖 Penjelasan:</span>
                      <p className="text-xs md:text-sm font-normal text-gray-900 leading-relaxed">
                        {ans.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* FLOATING SCROLL CONTROLS FOR GESTURE & MOBILE */}
      <FloatingScrollControls 
        virtualCursor={virtualCursor}
        isVisible={virtualCursor.isDetected}
      />

      {/* WEBCAM PREVIEW IN RESULT PAGE */}
      <div className="fixed bottom-3 right-3 z-40 flex flex-col items-end">
        <div className="relative border-2 border-black shadow-[3px_3px_0px_#000] bg-black overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-24 h-18 md:w-36 md:h-28 object-cover scale-x-[-1]"
          />
          <div className="absolute top-1 left-1 bg-black/75 text-white font-mono text-[9px] px-1 py-0.5">
            {virtualCursor.isDetected ? 'Hand: OK' : 'Mencari...'}
          </div>
        </div>
      </div>

    </div>
  );
}
