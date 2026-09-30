'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, CheckCircle2, XCircle, RefreshCw, Home,
  Star, ChevronDown, ChevronUp, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Grade } from '@/data/questions';
import { playSound } from '@/utils/audio';

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

  useEffect(() => {
    playSound('fanfare');
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#FFE600', '#FF70A6', '#00F5D4', '#70D6FF', '#FF9770']
    });
  }, []);

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
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4 md:py-8">
      
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
          onClick={() => {
            playSound('click');
            onPlayAgain();
          }}
          className="w-full sm:w-auto bg-[#FFE600] hover:bg-yellow-300 border-3 border-black px-6 py-3.5 font-black text-sm uppercase shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RefreshCw className="w-4 h-4 stroke-[2.5]" /> Mau Main Ulang
        </button>

        <button
          onClick={() => {
            playSound('click');
            onBackToHome();
          }}
          className="w-full sm:w-auto bg-white hover:bg-gray-100 border-3 border-black px-6 py-3.5 font-bold text-sm uppercase shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
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
              Klik setiap soal untuk melihat penjelasan lengkapnya
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setFilter('ALL'); playSound('pop'); }}
              className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer ${
                filter === 'ALL' ? 'bg-[#FFE600]' : 'bg-white'
              }`}
            >
              Semua ({totalQuestions})
            </button>
            <button
              onClick={() => { setFilter('WRONG'); playSound('pop'); }}
              className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer ${
                filter === 'WRONG' ? 'bg-[#FF70A6]' : 'bg-white'
              }`}
            >
              Salah ({wrongCount})
            </button>
            <button
              onClick={() => { setFilter('CORRECT'); playSound('pop'); }}
              className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer ${
                filter === 'CORRECT' ? 'bg-[#00F5D4]' : 'bg-white'
              }`}
            >
              Benar ({correctCount})
            </button>
          </div>
        </div>

        {/* List Soal */}
        <div className="space-y-3">
          {filteredAnswers.map(ans => {
            const isExpanded = expandedId === ans.questionNumber;
            return (
              <div
                key={ans.questionNumber}
                className={`border-3 border-black transition-all ${
                  ans.isCorrect ? 'bg-[#FFFDF0]' : 'bg-red-50'
                } shadow-[3px_3px_0px_#000]`}
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
                          Soal {ans.questionNumber}
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

    </div>
  );
}
