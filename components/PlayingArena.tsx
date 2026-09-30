'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Trophy, Heart, Smile, Hand, ArrowRight, ArrowLeft,
  Volume2, VolumeX, Flame, CheckCircle2, XCircle
} from 'lucide-react';
import { Grade, HandQuestion, HeadQuestion, generateRandomQuizSession } from '@/data/questions';
import { AnswerRecord } from '@/components/ResultPage';
import { playSound, setSoundMuted, getSoundMuted } from '@/utils/audio';
import { MathMascot } from '@/components/MathMascot';
import FloatingScrollControls from '@/components/FloatingScrollControls';

interface PlayingArenaProps {
  studentName: string;
  selectedGrade: Grade;
  onFinishGame: (finalScore: number, records: AnswerRecord[]) => void;
  onQuitToMenu: () => void;
}

export default function PlayingArena({
  studentName,
  selectedGrade,
  onFinishGame,
  onQuitToMenu
}: PlayingArenaProps) {
  // Quiz Sessions (15 Hand + 5 Head)
  const [quizData] = useState(() => generateRandomQuizSession(selectedGrade));
  const [qIndex, setQIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [answersList, setAnswersList] = useState<AnswerRecord[]>([]);

  // Reset scroll to top instantly & 600ms gesture cooldown on question change
  const [isQuestionCooldown, setIsQuestionCooldown] = useState<boolean>(true);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsQuestionCooldown(true);
    const timer = setTimeout(() => {
      setIsQuestionCooldown(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [qIndex]);

  // Sound Muted State
  const [isMuted, setIsMutedState] = useState<boolean>(getSoundMuted());

  // Screen flash effect on answer
  const [screenEffect, setScreenEffect] = useState<'correct' | 'wrong' | null>(null);

  // Review & Static Feedback State
  const [feedbackState, setFeedbackState] = useState<{
    isOpen: boolean;
    isCorrect: boolean;
    title: string;
    pointsEarned: number;
    explanation: string;
  } | null>(null);

  // Kursor Touchless & Pinch State
  const [virtualCursor, setVirtualCursor] = useState({
    x: 50,
    y: 50,
    isPinching: false,
    isDetected: false
  });
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);

  // Pinch & Hold (750ms) Progress State
  const [pinchProgress, setPinchProgress] = useState<number>(0);
  const pinchStartTimeRef = useRef<number | null>(null);
  const hasTriggeredPinchRef = useRef<boolean>(false);
  const lastHoveredCardRef = useRef<number | null>(null);
  const lastCursorPosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Next Button Dwell / Pinch in Feedback Box
  const nextBtnRef = useRef<HTMLButtonElement | null>(null);
  const [isNextBtnHovered, setIsNextBtnHovered] = useState<boolean>(false);

  // Head Motion Tracking State
  const [headDirection, setHeadDirection] = useState<'LEFT' | 'RIGHT' | 'CENTER'>('CENTER');
  const [headDwellProgress, setHeadDwellProgress] = useState<number>(0);
  const headStartTimeRef = useRef<number | null>(null);

  // MediaPipe References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Phase Determination: 0 - 14 = Hand Quiz (15 Soal); 15 - 19 = Head Quiz (5 Soal)
  const isHeadPhase = qIndex >= 15;
  const currentHandQ: HandQuestion = quizData.handQuestions[qIndex] || quizData.handQuestions[0];
  const currentHeadQ: HeadQuestion = quizData.headQuestions[qIndex - 15] || quizData.headQuestions[0];

  const toggleSound = () => {
    const next = !isMuted;
    setIsMutedState(next);
    setSoundMuted(next);
    if (!next) playSound('pop');
  };

  // ========================================================
  // 1. DYNAMIC MEDIAPIPE INITIALIZATION
  // ========================================================
  useEffect(() => {
    let camera: any = null;
    let hands: any = null;
    let faceMesh: any = null;
    let isActive = true;

    const setupMediaPipe = async () => {
      if (!isActive) return;
      const win = window as any;

      if (!win.Hands || !win.FaceMesh || !win.Camera) {
        setTimeout(setupMediaPipe, 300);
        return;
      }

      // Hands Model
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
        if (!isActive || isHeadPhase) return;
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

      // Face Mesh Model
      faceMesh = new win.FaceMesh({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: false,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
      });

      faceMesh.onResults((results: any) => {
        if (!isActive || !isHeadPhase) return;
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const face = results.multiFaceLandmarks[0];
          const nose = face[1];
          const leftEar = face[234];
          const rightEar = face[454];

          const distToLeft = Math.abs(nose.x - leftEar.x);
          const distToRight = Math.abs(nose.x - rightEar.x);
          const ratio = distToLeft / (distToRight + 0.0001);

          if (ratio < 0.45) {
            setHeadDirection('RIGHT');
          } else if (ratio > 2.2) {
            setHeadDirection('LEFT');
          } else {
            setHeadDirection('CENTER');
          }
        } else {
          setHeadDirection('CENTER');
        }
      });

      if (videoRef.current) {
        try {
          camera = new win.Camera(videoRef.current, {
            onFrame: async () => {
              if (!videoRef.current || !isActive) return;
              try {
                if (isHeadPhase && faceMesh) {
                  await faceMesh.send({ image: videoRef.current });
                } else if (!isHeadPhase && hands) {
                  await hands.send({ image: videoRef.current });
                }
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
  }, [isHeadPhase]);

  // ========================================================
  // 2. SUBMIT ANSWER HANDLER
  // ========================================================
  const handleSubmitAnswer = useCallback((
    isCorrect: boolean,
    studentAnswerText: string,
    correctAnswerText: string,
    explanationText: string,
    topicText: string
  ) => {
    if (feedbackState?.isOpen) return;

    const points = isCorrect ? 100 + streak * 25 : 0;
    
    if (isCorrect) {
      if (streak >= 2) {
        playSound('streak');
      } else {
        playSound('correct');
      }
      setScreenEffect('correct');
      setScore(s => s + points);
      setStreak(st => st + 1);
    } else {
      playSound('wrong');
      setScreenEffect('wrong');
      setStreak(0);
      setLives(l => Math.max(0, l - 1));
    }

    const newRecord: AnswerRecord = {
      questionNumber: qIndex + 1,
      type: isHeadPhase ? 'HEAD' : 'HAND',
      questionText: isHeadPhase ? currentHeadQ.statement : currentHandQ.question,
      topic: topicText,
      studentAnswer: studentAnswerText,
      correctAnswer: correctAnswerText,
      isCorrect,
      explanation: explanationText
    };

    setAnswersList(prev => [...prev, newRecord]);

    // Reset interaction progress
    setPinchProgress(0);
    setHoveredCardIdx(null);
    setHeadDwellProgress(0);
    pinchStartTimeRef.current = null;
    hasTriggeredPinchRef.current = false;
    lastHoveredCardRef.current = null;
    headStartTimeRef.current = null;

    setFeedbackState({
      isOpen: true,
      isCorrect,
      title: isCorrect 
        ? (streak >= 2 ? `Combo Mantap x${streak + 1}! Jawabanmu Tepat!` : `Jawabanmu Benar!`)
        : `Ups, Kurang Tepat!`,
      pointsEarned: points,
      explanation: explanationText
    });

    setTimeout(() => {
      setScreenEffect(null);
    }, 1000);
  }, [feedbackState, streak, qIndex, isHeadPhase, currentHandQ, currentHeadQ]);

  // ========================================================
  // 3. ADVANCE TO NEXT QUESTION OR FINISH
  // ========================================================
  const handleProceedNext = useCallback(() => {
    playSound('pop');
    setFeedbackState(null);
    setPinchProgress(0);
    setIsNextBtnHovered(false);
    pinchStartTimeRef.current = null;
    hasTriggeredPinchRef.current = false;

    if (qIndex + 1 >= 20) {
      onFinishGame(score, answersList);
    } else {
      setQIndex(prev => prev + 1);
    }
  }, [qIndex, score, answersList, onFinishGame]);

  // ========================================================
  // 4. TOUCHLESS HAND INTERACTION (PINCH & HOLD 750ms)
  // ========================================================
  useEffect(() => {
    if (isHeadPhase) return;

    const cursorPxX = (virtualCursor.x / 100) * window.innerWidth;
    const cursorPxY = (virtualCursor.y / 100) * window.innerHeight;

    // A. IF FEEDBACK MODAL IS OPEN: Check hover on Next Button
    if (feedbackState?.isOpen) {
      if (!nextBtnRef.current) return;
      const rect = nextBtnRef.current.getBoundingClientRect();

      const isInside = (
        cursorPxX >= rect.left &&
        cursorPxX <= rect.right &&
        cursorPxY >= rect.top &&
        cursorPxY <= rect.bottom
      );

      setIsNextBtnHovered(isInside);

      // Pinch and hold on Next Button (750ms)
      if (isInside && virtualCursor.isPinching) {
        if (!pinchStartTimeRef.current) {
          pinchStartTimeRef.current = Date.now();
        }

        const elapsed = Date.now() - pinchStartTimeRef.current;
        const prog = Math.min(100, Math.round((elapsed / 750) * 100));
        setPinchProgress(prog);

        if (prog >= 100 && !hasTriggeredPinchRef.current) {
          hasTriggeredPinchRef.current = true;
          handleProceedNext();
        }
      } else {
        pinchStartTimeRef.current = null;
        hasTriggeredPinchRef.current = false;
        setPinchProgress(0);
      }
      return;
    }

    // B. QUIZ PLAYING: Check hover on 3 option cards
    // 1. If in question transition cooldown, disable pinch selection
    if (isQuestionCooldown) {
      pinchStartTimeRef.current = null;
      hasTriggeredPinchRef.current = false;
      setPinchProgress(0);
      return;
    }

    let foundIdx: number | null = null;
    optionRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (
        cursorPxX >= rect.left &&
        cursorPxX <= rect.right &&
        cursorPxY >= rect.top &&
        cursorPxY <= rect.bottom
      ) {
        foundIdx = idx;
      }
    });

    setHoveredCardIdx(foundIdx);

    // Track card change to reset pinch progress if user moves to another card
    if (foundIdx !== null) {
      if (lastHoveredCardRef.current !== foundIdx) {
        lastHoveredCardRef.current = foundIdx;
        pinchStartTimeRef.current = null;
        hasTriggeredPinchRef.current = false;
        setPinchProgress(0);
      }
    } else {
      lastHoveredCardRef.current = null;
      pinchStartTimeRef.current = null;
      hasTriggeredPinchRef.current = false;
      setPinchProgress(0);
      return;
    }

    // Velocity / Fast Movement Filter: reset timer if moving rapidly across cards
    const now = Date.now();
    if (lastCursorPosRef.current) {
      const dt = Math.max(1, now - lastCursorPosRef.current.time);
      const dx = virtualCursor.x - lastCursorPosRef.current.x;
      const dy = virtualCursor.y - lastCursorPosRef.current.y;
      const speed = Math.hypot(dx, dy) / dt; // % / ms

      if (speed > 0.12) {
        pinchStartTimeRef.current = null;
        setPinchProgress(0);
      }
    }
    lastCursorPosRef.current = { x: virtualCursor.x, y: virtualCursor.y, time: now };

    const activeIdx = foundIdx;

    // PINCH & HOLD 750ms SELECTION (ONLY WHEN PINCHING STABLY)
    if (virtualCursor.isPinching) {
      if (!pinchStartTimeRef.current) {
        pinchStartTimeRef.current = Date.now();
      }

      const elapsed = Date.now() - pinchStartTimeRef.current;
      const prog = Math.min(100, Math.round((elapsed / 750) * 100));
      setPinchProgress(prog);

      if (prog >= 100 && !hasTriggeredPinchRef.current) {
        hasTriggeredPinchRef.current = true;
        playSound('pop');
        const isCorrect = activeIdx === currentHandQ.correctIndex;
        handleSubmitAnswer(
          isCorrect,
          currentHandQ.options[activeIdx],
          currentHandQ.options[currentHandQ.correctIndex],
          currentHandQ.explanation,
          currentHandQ.topic
        );
      }
    } else {
      // Released pinch: immediately reset progress (NO dwell / NO hover submit)
      pinchStartTimeRef.current = null;
      hasTriggeredPinchRef.current = false;
      setPinchProgress(0);
    }
  }, [virtualCursor, isHeadPhase, feedbackState, isQuestionCooldown, currentHandQ, handleSubmitAnswer, handleProceedNext]);

  // ========================================================
  // 5. EDGE SCROLLING IN PLAYING ARENA (<18% / >75%)
  // ========================================================
  useEffect(() => {
    if (isHeadPhase || !virtualCursor.isDetected || feedbackState?.isOpen) return;

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
  }, [virtualCursor.y, virtualCursor.isDetected, isHeadPhase, feedbackState]);

  // ========================================================
  // 5. HEAD MOTION LOOP (1.5s STABLE HOLD)
  // ========================================================
  useEffect(() => {
    if (!isHeadPhase || feedbackState?.isOpen) return;

    let timer: NodeJS.Timeout;
    if (headDirection !== 'CENTER') {
      if (!headStartTimeRef.current) {
        headStartTimeRef.current = Date.now();
      }

      timer = setInterval(() => {
        setHeadDwellProgress(prev => {
          if (prev >= 100) {
            const chosenTrue = headDirection === 'RIGHT';
            const isCorrect = chosenTrue === currentHeadQ.isTrue;
            handleSubmitAnswer(
              isCorrect,
              chosenTrue ? 'BENAR / YA' : 'SALAH / TIDAK',
              currentHeadQ.isTrue ? 'BENAR / YA' : 'SALAH / TIDAK',
              currentHeadQ.explanation,
              currentHeadQ.topic
            );
            return 0;
          }
          return prev + 8; // ~1.5s
        });
      }, 120);
    } else {
      headStartTimeRef.current = null;
      setHeadDwellProgress(0);
    }

    return () => clearInterval(timer);
  }, [headDirection, isHeadPhase, feedbackState, currentHeadQ, handleSubmitAnswer]);

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between select-none p-3 md:p-6 transition-all duration-300 ${
      screenEffect === 'correct' 
        ? 'ring-8 ring-[#00F5D4]' 
        : screenEffect === 'wrong' 
        ? 'ring-8 ring-[#FF0055]' 
        : ''
    }`}>

      {/* ======================================================== */}
      {/* TOUCHLESS VIRTUAL CURSOR WITH CIRCULAR PROGRESS RING */}
      {/* ======================================================== */}
      {!isHeadPhase && (
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

            {/* Circular Progress Ring for Pinch & Hold 1.2s */}
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
      {/* TOP HEADER */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* TOP HEADER */}
      {/* ======================================================== */}
      <header className="w-full max-w-4xl mx-auto bg-[#FFE600] border-4 border-black shadow-[5px_5px_0px_#000] p-2.5 md:p-3.5">
        {/* DESKTOP LAYOUT (>= md) */}
        <div className="hidden md:flex items-center justify-between gap-3 w-full">
          {/* Left: Exit + Mascot + Title & Student */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Kembali ke menu utama?')) {
                  onQuitToMenu();
                }
              }}
              className="bg-white hover:bg-gray-100 border-2 border-black px-3 py-1.5 text-xs font-bold uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              ← Keluar
            </button>
            <MathMascot className="w-9 h-9" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase bg-black text-white px-1.5 py-0.5">
                  Kelas {selectedGrade}
                </span>
                <span className="text-xs font-bold text-gray-800">
                  {studentName}
                </span>
              </div>
              <h1 className="font-brand text-xl md:text-2xl font-black uppercase tracking-wider leading-tight drop-shadow-[2px_2px_0px_#FFF] select-none">
                <span className="text-[#FF0055]">MATH</span>
                <span className="text-black">MOTION</span>
              </h1>
            </div>
          </div>

          {/* Right: Stats & HUD */}
          <div className="flex items-center gap-2.5">
            {streak > 1 && (
              <div className="flex items-center gap-1 bg-[#FF70A6] border-2 border-black px-2 py-1 text-xs font-bold shadow-[2px_2px_0px_#000]">
                <Flame className="w-3.5 h-3.5 fill-black" />
                <span>x{streak}</span>
              </div>
            )}

            <div className="flex items-center gap-1 bg-white border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000]">
              <Heart className="w-4 h-4 fill-[#FF0055] text-black" />
              <span className="font-bold text-sm">{lives}</span>
            </div>

            <div className="flex items-center gap-1 bg-[#00F5D4] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000]">
              <Trophy className="w-4 h-4 text-black" />
              <span className="font-bold text-sm">{score}</span>
            </div>

            <button
              onClick={toggleSound}
              className="bg-white hover:bg-gray-100 border-2 border-black p-1.5 shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              title="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-black" /> : <Volume2 className="w-4 h-4 text-black" />}
            </button>

            <div className="bg-black text-white font-mono px-2.5 py-1 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000]">
              {qIndex + 1}/20
            </div>
          </div>
        </div>

        {/* MOBILE COMPACT LAYOUT (< md) */}
        <div className="flex flex-col gap-2 md:hidden w-full">
          {/* Baris Atas (Navigasi & Identitas) */}
          <div className="flex items-center justify-between gap-2">
            {/* Kiri: Tombol Back Compact */}
            <button
              onClick={() => {
                if (confirm('Kembali ke menu utama?')) {
                  onQuitToMenu();
                }
              }}
              className="bg-white hover:bg-gray-100 border-2 border-black p-1.5 shadow-[2px_2px_0px_#000] cursor-pointer shrink-0 active:translate-x-0.5 active:translate-y-0.5"
              title="Kembali ke Menu Utama"
            >
              <ArrowLeft className="w-4 h-4 text-black stroke-[3]" />
            </button>

            {/* Tengah: Logo Maskot + Teks MathMotion + pill Kls & Nama */}
            <div className="flex items-center gap-1.5 min-w-0">
              <MathMascot className="w-7 h-7 shrink-0" />
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-brand font-black text-lg uppercase tracking-wider shrink-0 drop-shadow-[1.5px_1.5px_0px_#FFF] select-none">
                  <span className="text-[#FF0055]">MATH</span>
                  <span className="text-black">MOTION</span>
                </span>
                <span className="text-[10px] font-bold bg-white border border-black px-1.5 py-0.5 shadow-[1px_1px_0px_#000] truncate text-black max-w-[110px]">
                  Kls {selectedGrade} • {studentName}
                </span>
              </div>
            </div>

            {/* Kanan: Tombol Mute Sound */}
            <button
              onClick={toggleSound}
              className="bg-white hover:bg-gray-100 border-2 border-black p-1.5 shadow-[2px_2px_0px_#000] cursor-pointer shrink-0 active:translate-x-0.5 active:translate-y-0.5"
              title="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-black" /> : <Volume2 className="w-4 h-4 text-black" />}
            </button>
          </div>

          {/* Baris Bawah (HUD Game Stats) */}
          <div className="grid grid-cols-3 gap-1.5 w-full">
            {/* 1. Nyawa */}
            <div className="flex items-center justify-center gap-1 bg-white border-2 border-black py-0.5 px-2 text-xs font-bold shadow-[2px_2px_0px_#000]">
              <Heart className="w-3.5 h-3.5 fill-[#FF0055] text-black shrink-0" />
              <span>{lives}</span>
            </div>

            {/* 2. Skor */}
            <div className="flex items-center justify-center gap-1 bg-[#00F5D4] border-2 border-black py-0.5 px-2 text-xs font-bold shadow-[2px_2px_0px_#000]">
              <Trophy className="w-3.5 h-3.5 text-black shrink-0" />
              <span>{score}</span>
              {streak > 1 && (
                <span className="text-[10px] bg-[#FF70A6] text-black px-1 border border-black ml-0.5">
                  x{streak}
                </span>
              )}
            </div>

            {/* 3. Soal */}
            <div className="flex items-center justify-center bg-black text-white font-mono py-0.5 px-2 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000]">
              {qIndex + 1}/20
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN PLAYING STAGE */}
      {/* ======================================================== */}
      <main className="max-w-4xl mx-auto w-full my-auto py-4">

        {/* ---------------------------------------------------- */}
        {/* FASE 1: GESTURE TANGAN (SOAL 1 - 15) */}
        {/* ---------------------------------------------------- */}
        {!isHeadPhase && (
          <div className="flex flex-col items-center space-y-5">
            
            {/* KARTU PERTANYAAN */}
            <div className="w-full bg-[#FFE600] border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_#000] text-center relative">
              <div className="flex justify-between items-center mb-3">
                <span className="bg-black text-white px-2.5 py-0.5 text-xs font-bold uppercase flex items-center gap-1">
                  <Hand className="w-3.5 h-3.5" /> Soal {qIndex + 1} dari 15 • {currentHandQ.topic}
                </span>
              </div>
              <h2 className="text-xl md:text-3xl font-black text-black leading-snug">
                {currentHandQ.question}
              </h2>
            </div>

            {/* 3 PILIHAN KARTU JAWABAN */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentHandQ.options.map((opt, idx) => {
                const isHovered = hoveredCardIdx === idx;
                const cardBg = idx === 0 ? 'bg-[#70D6FF]' : idx === 1 ? 'bg-[#FF70A6]' : 'bg-[#00F5D4]';

                return (
                  <div
                    key={idx}
                    ref={el => { optionRefs.current[idx] = el; }}
                    onClick={() => handleSubmitAnswer(
                      idx === currentHandQ.correctIndex,
                      opt,
                      currentHandQ.options[currentHandQ.correctIndex],
                      currentHandQ.explanation,
                      currentHandQ.topic
                    )}
                    className={`relative cursor-pointer border-4 border-black p-5 md:p-6 text-center transition-all ${cardBg} ${
                      isHovered
                        ? 'shadow-[8px_8px_0px_#000] -translate-y-1'
                        : 'shadow-[4px_4px_0px_#000] hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block mb-2">
                      Pilihan {String.fromCharCode(65 + idx)}
                    </span>
                    
                    <p className="text-2xl md:text-3xl font-black text-black my-1">
                      {opt}
                    </p>

                    {/* PINCH & HOLD PROGRESS BAR (750ms) */}
                    {isHovered && pinchProgress > 0 && (
                      <div className="w-full bg-white h-3.5 mt-3 border-2 border-black overflow-hidden shadow-[1px_1px_0px_#000]">
                        <div
                          className="bg-[#FFE600] h-full transition-all duration-75"
                          style={{ width: `${pinchProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* PETUNJUK KONTROL */}
            <div className="text-center text-xs font-bold text-gray-800 bg-white border-2 border-black px-4 py-2 shadow-[2px_2px_0px_#000]">
              👌 <b>Cara Memilih:</b> Arahkan jari ke kartu & <b>Cubit + Tahan (Pinch-and-Hold) sebentar</b> sampai lingkaran penuh, atau klik aja tombolnya.
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* FASE 2: GESTURE KEPALA (SOAL 16 - 20) */}
        {/* ---------------------------------------------------- */}
        {isHeadPhase && (
          <div className="flex flex-col items-center space-y-5">
            
            {/* PAPAN PERNYATAAN TRUE/FALSE */}
            <div className="w-full bg-[#FF70A6] border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_#000] text-center">
              <div className="flex justify-between items-center mb-3">
                <span className="bg-black text-white px-2.5 py-0.5 text-xs font-bold uppercase flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5" /> True or False (Soal {qIndex + 1}/20)
                </span>
              </div>
              <h2 className="text-xl md:text-3xl font-black text-black leading-snug">
                "{currentHeadQ.statement}"
              </h2>
            </div>

            {/* 2 KARTU BESAR */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* KIRI: SALAH */}
              <div
                onClick={() => handleSubmitAnswer(
                  !currentHeadQ.isTrue,
                  'SALAH / TIDAK',
                  currentHeadQ.isTrue ? 'BENAR / YA' : 'SALAH / TIDAK',
                  currentHeadQ.explanation,
                  currentHeadQ.topic
                )}
                className={`cursor-pointer border-4 border-black p-6 text-center transition-all bg-[#FF9770] ${
                  headDirection === 'LEFT'
                    ? 'shadow-[8px_8px_0px_#000] -translate-y-1 ring-3 ring-black'
                    : 'shadow-[4px_4px_0px_#000]'
                }`}
              >
                <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block mb-1">
                  👈 Geleng ke Kiri
                </span>
                <p className="text-2xl md:text-3xl font-black uppercase text-black my-1">
                  SALAH / TIDAK
                </p>
                {headDirection === 'LEFT' && (
                  <div className="w-full bg-white h-3 mt-3 border-2 border-black overflow-hidden">
                    <div
                      className="bg-black h-full transition-all duration-75"
                      style={{ width: `${headDwellProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* KANAN: BENAR */}
              <div
                onClick={() => handleSubmitAnswer(
                  currentHeadQ.isTrue,
                  'BENAR / YA',
                  currentHeadQ.isTrue ? 'BENAR / YA' : 'SALAH / TIDAK',
                  currentHeadQ.explanation,
                  currentHeadQ.topic
                )}
                className={`cursor-pointer border-4 border-black p-6 text-center transition-all bg-[#00F5D4] ${
                  headDirection === 'RIGHT'
                    ? 'shadow-[8px_8px_0px_#000] -translate-y-1 ring-3 ring-black'
                    : 'shadow-[4px_4px_0px_#000]'
                }`}
              >
                <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block mb-1">
                  Geleng ke Kanan 👉
                </span>
                <p className="text-2xl md:text-3xl font-black uppercase text-black my-1">
                  BENAR / YA
                </p>
                {headDirection === 'RIGHT' && (
                  <div className="w-full bg-white h-3 mt-3 border-2 border-black overflow-hidden">
                    <div
                      className="bg-black h-full transition-all duration-75"
                      style={{ width: `${headDwellProgress}%` }}
                    />
                  </div>
                )}
              </div>

            </div>

            {/* FALLBACK TOMBOL MANUAL */}
            <div className="flex gap-3">
              <button
                onClick={() => handleSubmitAnswer(
                  !currentHeadQ.isTrue,
                  'SALAH / TIDAK',
                  currentHeadQ.isTrue ? 'BENAR / YA' : 'SALAH / TIDAK',
                  currentHeadQ.explanation,
                  currentHeadQ.topic
                )}
                className="bg-white hover:bg-gray-100 border-2 border-black px-3.5 py-1.5 font-bold text-xs uppercase shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Pilih Salah
              </button>
              <button
                onClick={() => handleSubmitAnswer(
                  currentHeadQ.isTrue,
                  'BENAR / YA',
                  currentHeadQ.isTrue ? 'BENAR / YA' : 'SALAH / TIDAK',
                  currentHeadQ.explanation,
                  currentHeadQ.topic
                )}
                className="bg-white hover:bg-gray-100 border-2 border-black px-3.5 py-1.5 font-bold text-xs uppercase shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Pilih Benar
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* 6. STATIC / CALM FEEDBACK BOX */}
      {/* ======================================================== */}
      {feedbackState?.isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg border-4 border-black p-5 md:p-6 shadow-[8px_8px_0px_#000] text-black ${
            feedbackState.isCorrect ? 'bg-[#00F5D4]' : 'bg-[#FF70A6]'
          }`}>
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <div className="flex items-center gap-2">
                {feedbackState.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-black" />
                ) : (
                  <XCircle className="w-6 h-6 text-black" />
                )}
                <h3 className="text-xl font-black uppercase text-black">
                  {feedbackState.title}
                </h3>
              </div>
              {feedbackState.isCorrect && (
                <span className="bg-black text-white text-xs font-bold px-2 py-0.5 uppercase">
                  +{feedbackState.pointsEarned} Poin
                </span>
              )}
            </div>

            {/* Explanation text */}
            <div className="bg-white border-2 border-black p-4 mb-5 shadow-[3px_3px_0px_#000] space-y-1.5">
              <span className="text-xs font-bold uppercase text-gray-600 block">
                Penjelasan:
              </span>
              <p className="text-sm md:text-base font-normal text-gray-900 leading-relaxed">
                {feedbackState.explanation}
              </p>
            </div>

            {/* Tombol Lanjut */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-medium text-gray-800">
                Pinch & Hold atau klik tombol
              </span>

              <button
                ref={nextBtnRef}
                onClick={handleProceedNext}
                className={`relative w-full sm:w-auto bg-[#FFE600] hover:bg-yellow-300 border-3 border-black px-6 py-3 font-black text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer ${
                  isNextBtnHovered ? 'ring-3 ring-black' : ''
                }`}
              >
                <span>{qIndex + 1 >= 20 ? 'Lihat Hasil Akhir' : 'Lanjut ke Soal Berikutnya'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FLOATING SCROLL CONTROLS FOR GESTURE & MOBILE */}
      <FloatingScrollControls 
        virtualCursor={virtualCursor}
        isVisible={!isHeadPhase && virtualCursor.isDetected}
      />

      {/* ======================================================== */}
      {/* 7. WEBCAM PREVIEW */}
      {/* ======================================================== */}
      <footer className="w-full max-w-4xl mx-auto flex items-center justify-between text-xs font-medium text-gray-600 mt-2">
        <span>MathMotion • Kelas {selectedGrade} SD</span>

        <div className="fixed bottom-3 right-3 z-40 flex flex-col items-end">
          <div className="relative border-2 border-black shadow-[3px_3px_0px_#000] bg-black overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-24 h-18 md:w-36 md:h-28 object-cover scale-x-[-1]"
            />
            <div className="absolute top-1 left-1 bg-black/75 text-white font-mono text-[9px] px-1 py-0.5">
              {isHeadPhase ? `Face: ${headDirection}` : (virtualCursor.isDetected ? 'Hand: OK' : 'Mencari...')}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
