'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import PlayingArena from '@/components/PlayingArena';
import ResultPage, { AnswerRecord } from '@/components/ResultPage';
import { Grade } from '@/data/questions';

type Stage = 'LANDING' | 'PLAYING' | 'RESULT';

export default function MathMotionArcadeApp() {
  const [stage, setStage] = useState<Stage>('LANDING');
  const [studentName, setStudentName] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(5);

  // Result records
  const [finalScore, setFinalScore] = useState<number>(0);
  const [finalAnswers, setFinalAnswers] = useState<AnswerRecord[]>([]);

  // ========================================================
  // LOAD MEDIAPIPE CDN SCRIPTS SECARA DINAMIS
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

  // Handle Start Game
  const handleStartGame = () => {
    setStage('PLAYING');
  };

  // Handle Game Finish
  const handleFinishGame = (score: number, records: AnswerRecord[]) => {
    setFinalScore(score);
    setFinalAnswers(records);
    setStage('RESULT');
  };

  // Handle Play Again (Replay Same Grade)
  const handlePlayAgain = () => {
    setStage('PLAYING');
  };

  // Handle Back To Home
  const handleBackToHome = () => {
    setStage('LANDING');
  };

  return (
    <div className="relative min-h-screen w-full font-sans antialiased text-black select-none p-3 md:p-6 flex flex-col justify-between">
      
      {/* 1. LANDING PAGE & ALUR MASUK */}
      {stage === 'LANDING' && (
        <LandingPage
          studentName={studentName}
          setStudentName={setStudentName}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          onStartGame={handleStartGame}
        />
      )}

      {/* 2. GESTURE GAMIFIKASI INTI (PLAYING ARENA) */}
      {stage === 'PLAYING' && (
        <PlayingArena
          key={`${selectedGrade}-${Date.now()}`}
          studentName={studentName}
          selectedGrade={selectedGrade}
          onFinishGame={handleFinishGame}
          onQuitToMenu={handleBackToHome}
        />
      )}

      {/* 3. RESULT PAGE (HALAMAN AKHIR) */}
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