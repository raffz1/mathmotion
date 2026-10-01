'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import PlayingArena, { SavedSession } from '@/components/PlayingArena';
import ResultPage, { AnswerRecord } from '@/components/ResultPage';
import { Grade } from '@/data/questions';
import { MathMascot } from '@/components/MathMascot';
import { Trophy, Heart, Play, RotateCcw, Sparkles } from 'lucide-react';
import { playSound } from '@/utils/audio';

type Stage = 'LANDING' | 'PLAYING' | 'RESULT';

export default function MathMotionArcadeApp() {
  const [stage, setStage] = useState<Stage>('LANDING');
  const [studentName, setStudentName] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(5);

  // Active or resumed session state
  const [activeSession, setActiveSession] = useState<SavedSession | null>(null);
  const [pendingResumeSession, setPendingResumeSession] = useState<SavedSession | null>(null);

  // Result records
  const [finalScore, setFinalScore] = useState<number>(0);
  const [finalAnswers, setFinalAnswers] = useState<AnswerRecord[]>([]);

  // ========================================================
  // 1. LOAD MEDIAPIPE CDN SCRIPTS SECARA DINAMIS
  // ========================================================
  useEffect(() => {
    const scripts = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js'
    ];

    scripts.forEach(src => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.crossOrigin = 'anonymous';
        document.body.appendChild(s);
      }
    });
  }, []);

  // ========================================================
  // 2. CHECK SAVED SESSION ON INITIAL LOAD
  // ========================================================
  useEffect(() => {
    try {
      const savedStr = localStorage.getItem('mathmotion_active_session');
      if (savedStr) {
        const session: SavedSession = JSON.parse(savedStr);
        // Valid session must have remaining lives, valid question index (< 20) and studentName
        if (
          session &&
          session.studentName &&
          session.qIndex < 20 &&
          session.lives > 0 &&
          session.quizData
        ) {
          setPendingResumeSession(session);
        } else {
          localStorage.removeItem('mathmotion_active_session');
        }
      }
    } catch (e) {
      console.warn('Could not read saved session from localStorage', e);
    }
  }, []);

  // Handle Resume Saved Session
  const handleResumeSession = () => {
    if (!pendingResumeSession) return;
    playSound('fanfare');
    setStudentName(pendingResumeSession.studentName);
    setSelectedGrade(pendingResumeSession.selectedGrade);
    setActiveSession(pendingResumeSession);
    setPendingResumeSession(null);
    setStage('PLAYING');
  };

  // Handle Dismiss Saved Session & Start Fresh
  const handleDiscardSavedSession = () => {
    playSound('click');
    try {
      localStorage.removeItem('mathmotion_active_session');
    } catch {}
    setPendingResumeSession(null);
    setActiveSession(null);
  };

  // Handle Start New Game
  const handleStartGame = () => {
    setActiveSession(null);
    setStage('PLAYING');
  };

  // Handle Game Finish
  const handleFinishGame = (score: number, records: AnswerRecord[]) => {
    try {
      localStorage.removeItem('mathmotion_active_session');
    } catch {}
    setFinalScore(score);
    setFinalAnswers(records);
    setActiveSession(null);
    setStage('RESULT');
  };

  // Handle Play Again (Replay Same Grade)
  const handlePlayAgain = () => {
    setActiveSession(null);
    setStage('PLAYING');
  };

  // Handle Back To Home
  const handleBackToHome = () => {
    try {
      localStorage.removeItem('mathmotion_active_session');
    } catch {}
    setActiveSession(null);
    setStage('LANDING');
  };

  return (
    <div className="relative min-h-screen w-full font-sans antialiased text-black select-none flex flex-col justify-between">
      
      {/* 1. MODAL RESUME / LANJUTKAN KUIS TERAKHIR */}
      {pendingResumeSession && stage === 'LANDING' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FFFDF0] border-4 border-black shadow-[10px_10px_0px_#000] p-5 md:p-6 space-y-4">
            
            {/* Header Modal */}
            <div className="bg-[#FFE600] border-3 border-black p-3.5 shadow-[3px_3px_0px_#000] flex items-center gap-3">
              <MathMascot className="w-10 h-10 shrink-0" />
              <div>
                <span className="text-[10px] font-black uppercase bg-black text-white px-1.5 py-0.5 inline-block mb-0.5">
                  Sesi Kuis Ditemukan!
                </span>
                <h2 className="text-lg md:text-xl font-black uppercase text-black leading-tight">
                  Lanjutkan Kuis Sebelumnya?
                </h2>
              </div>
            </div>

            {/* Konten Penjelasan */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-800 leading-relaxed">
                Halo <b className="bg-yellow-200 px-1 border border-black">{pendingResumeSession.studentName}</b>! Kamu punya sesi kuis <b className="bg-pink-200 px-1 border border-black">Kelas {pendingResumeSession.selectedGrade}</b> yang belum selesai. Mau lanjut dari soal terakhir?
              </p>

              {/* Status Sesi Sebelumnya */}
              <div className="grid grid-cols-3 gap-2 bg-white border-3 border-black p-3 shadow-[3px_3px_0px_#000]">
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Posisi</span>
                  <span className="text-xs md:text-sm font-black text-black">
                    Soal #{pendingResumeSession.qIndex + 1}/20
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center text-center border-x-2 border-black">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Skor Saat Ini</span>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-black" />
                    <span className="text-xs md:text-sm font-black text-black">{pendingResumeSession.score}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Sisa Nyawa</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-[#FF0055] text-black" />
                    <span className="text-xs md:text-sm font-black text-black">{pendingResumeSession.lives}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={handleResumeSession}
                className="w-full sm:flex-1 bg-[#00F5D4] hover:bg-emerald-300 border-3 border-black py-3 px-4 font-black text-xs md:text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Play className="w-4 h-4 fill-black" /> Lanjutkan Kuis 🚀
              </button>

              <button
                onClick={handleDiscardSavedSession}
                className="w-full sm:w-auto bg-white hover:bg-gray-100 border-3 border-black py-3 px-4 font-bold text-xs md:text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer transition-all text-gray-700"
              >
                <RotateCcw className="w-4 h-4" /> Mulai Baru
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. LANDING PAGE & ALUR MASUK */}
      {stage === 'LANDING' && (
        <LandingPage
          studentName={studentName}
          setStudentName={setStudentName}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          onStartGame={handleStartGame}
        />
      )}

      {/* 3. GESTURE GAMIFIKASI INTI (PLAYING ARENA) */}
      {stage === 'PLAYING' && (
        <PlayingArena
          key={`${selectedGrade}-${activeSession ? activeSession.timestamp : Date.now()}`}
          studentName={studentName}
          selectedGrade={selectedGrade}
          savedSession={activeSession}
          onFinishGame={handleFinishGame}
          onQuitToMenu={handleBackToHome}
        />
      )}

      {/* 4. RESULT PAGE (HALAMAN AKHIR) */}
      {stage === 'RESULT' && (
        <ResultPage
          studentName={studentName || 'Siswa Hebat'}
          selectedGrade={selectedGrade}
          score={finalScore}
          answers={finalAnswers}
          onPlayAgain={handlePlayAgain}
          onBackToHome={handleBackToHome}
        />
      )}

    </div>
  );
}