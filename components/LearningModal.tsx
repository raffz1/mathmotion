'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Zap, Sparkles, Lightbulb, CheckCircle2, XCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { LearningModule } from '@/data/learningModules';
import SandboxPlayground from '@/components/SandboxPlayground';
import { playSound } from '@/utils/audio';

interface LearningModalProps {
  module: LearningModule | null;
  onClose: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function LearningModal({ module, onClose, containerRef }: LearningModalProps) {
  const [selectedQuizIdx, setSelectedQuizIdx] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Reset scroll and lock body scroll when module is opened
  useEffect(() => {
    if (module) {
      if (containerRef?.current) {
        containerRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [module, containerRef]);

  if (!module) return null;

  const isQuizCorrect = selectedQuizIdx === module.miniQuiz.correctIndex;

  const handleSelectQuizOption = (idx: number) => {
    setSelectedQuizIdx(idx);
    setQuizSubmitted(true);
    if (idx === module.miniQuiz.correctIndex) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const handleResetQuiz = () => {
    setSelectedQuizIdx(null);
    setQuizSubmitted(false);
    playSound('pop');
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#FFFDF0] w-screen h-screen overflow-y-auto p-4 md:p-8 flex flex-col animate-in zoom-in-95 fade-in duration-200"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col space-y-8 pb-24 flex-1">
        
        {/* TOP BAR / NAVIGATION */}
        <div className="flex items-center justify-between gap-4 border-b-4 border-black pb-4">
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="bg-white hover:bg-[#FFE600] border-3 border-black px-4 py-2 font-black text-xs md:text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Tutup & Kembali ke Beranda
          </button>

          <span className="bg-black text-white text-xs font-black uppercase px-3 py-1 shadow-[2px_2px_0px_#000]">
            Materi Kelas {module.grade} SD
          </span>
        </div>

        {/* HEADER HERO */}
        <div 
          className="border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_#000] space-y-2"
          style={{ backgroundColor: module.color }}
        >
          <span className="bg-white border-2 border-black text-xs font-bold px-2.5 py-0.5 inline-block shadow-[1px_1px_0px_#000]">
            {module.badge}
          </span>
          <h1 className="text-2xl md:text-4xl font-black uppercase text-black tracking-tight leading-tight">
            {module.title}
          </h1>
          <p className="text-sm md:text-base font-medium text-gray-900 leading-relaxed max-w-2xl">
            {module.subtitle}
          </p>
        </div>

        {/* 1. RINGKASAN MATERI */}
        <div className="bg-white border-4 border-black p-6 shadow-[5px_5px_0px_#000] space-y-3">
          <h2 className="text-lg font-black uppercase flex items-center gap-2 text-black">
            <BookOpen className="w-5 h-5 text-black" /> 1. Konsep Inti
          </h2>
          <p className="text-sm md:text-base font-normal text-gray-800 leading-relaxed">
            {module.summary}
          </p>
        </div>

        {/* 2. RUMUS & TRIK CEPAT */}
        <div className="space-y-4">
          <h2 className="text-lg font-black uppercase flex items-center gap-2 text-black">
            <Zap className="w-5 h-5 text-black" /> 2. Rumus Praktis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {module.keyFormulas.map((kf, i) => (
              <div key={i} className="bg-white border-3 border-black p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase bg-[#FFE600] border border-black px-2 py-0.5 inline-block mb-2">
                    {kf.name}
                  </span>
                  <div className="font-mono text-sm font-bold text-black bg-[#FFFDF0] border-2 border-black p-3 break-words">
                    {kf.formula}
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-700 leading-relaxed">
                  💡 {kf.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. STUDI KASUS KONTEKSTUAL (KEHIDUPAN SEHARI-HARI) */}
        <div className="bg-[#FFFDF0] border-4 border-black p-6 shadow-[5px_5px_0px_#000] space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <Lightbulb className="w-5 h-5 text-[#FF0055] stroke-[2.5]" />
            <h2 className="text-lg font-black uppercase text-black">
              3. {module.caseStudy.title}
            </h2>
          </div>

          <div className="space-y-3">
            <div className="bg-white border-2 border-black p-4 space-y-1.5 shadow-[2px_2px_0px_#000]">
              <span className="text-xs font-bold uppercase bg-[#FFE600] border border-black px-1.5 py-0.2 inline-block">Cerita Kasus:</span>
              <p className="text-sm font-medium text-gray-800 leading-relaxed">
                {module.caseStudy.story}
              </p>
            </div>

            <div className="bg-[#70D6FF]/20 border-2 border-black p-4 space-y-1 shadow-[2px_2px_0px_#000]">
              <span className="text-xs font-bold uppercase text-gray-700 block">Pertanyaan:</span>
              <p className="text-sm font-bold text-black leading-relaxed">
                {module.caseStudy.problem}
              </p>
            </div>

            <div className="bg-white border-2 border-black p-4 space-y-2 shadow-[2px_2px_0px_#000]">
              <span className="text-xs font-bold uppercase text-[#00A896] block">Langkah Penyelesaian:</span>
              <ul className="space-y-1.5 text-xs md:text-sm font-medium text-gray-800">
                {module.caseStudy.solutionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. MINI QUIZ LANGSUNG */}
        <div className="bg-[#FFE600] border-4 border-black p-6 shadow-[6px_6px_0px_#000] space-y-4">
          <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-2">
            <h2 className="text-lg font-black uppercase text-black flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-black stroke-[2.5]" /> 4. Mini Quiz Studi Kasus
            </h2>
            <span className="bg-black text-white text-[11px] font-bold uppercase px-2 py-0.5">
              Uji Pemahaman Cepat
            </span>
          </div>

          <p className="text-sm md:text-base font-bold text-black leading-relaxed bg-white border-2 border-black p-4 shadow-[2px_2px_0px_#000]">
            "{module.miniQuiz.question}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {module.miniQuiz.options.map((opt, idx) => {
              const isSelected = selectedQuizIdx === idx;
              const isCorrectOpt = idx === module.miniQuiz.correctIndex;
              let btnStyle = 'bg-white hover:bg-gray-100';

              if (quizSubmitted) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-[#00F5D4] border-[#000] font-black text-black ring-2 ring-black';
                } else if (isSelected && !isCorrectOpt) {
                  btnStyle = 'bg-[#FF70A6] border-[#000] font-black text-black';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizOption(idx)}
                  className={`border-3 border-black p-4 text-center font-bold text-sm md:text-base shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${btnStyle}`}
                >
                  <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block mb-1.5">
                    Opsi {String.fromCharCode(65 + idx)}
                  </span>
                  <p className="mt-1">{opt}</p>
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div className={`border-3 border-black p-4 shadow-[3px_3px_0px_#000] space-y-2 animate-in fade-in duration-150 ${
              isQuizCorrect ? 'bg-[#00F5D4]' : 'bg-[#FF70A6]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isQuizCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-black stroke-[2.5]" />
                  )}
                  <h3 className="text-base font-black uppercase text-black">
                    {isQuizCorrect ? 'Hebat, Jawabanmu Benar!' : 'Kurang Tepat, Jangan Menyerah!'}
                  </h3>
                </div>

                <button
                  onClick={handleResetQuiz}
                  className="bg-white hover:bg-gray-100 border-2 border-black px-2.5 py-1 text-xs font-bold uppercase shadow-[1px_1px_0px_#000] cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>

              <p className="text-xs md:text-sm font-medium text-black bg-white border border-black p-3 leading-relaxed">
                📖 <b>Pembahasan:</b> {module.miniQuiz.explanation}
              </p>
            </div>
          )}
        </div>

        {/* 5. MINI INTERACTIVE PLAYGROUND / LIVE SANDBOX */}
        <div className="space-y-4">
          <h2 className="text-lg font-black uppercase flex items-center gap-2 text-black">
            <Sparkles className="w-5 h-5 text-black" /> 5. Laboratorium & Simulator Live
          </h2>
          <SandboxPlayground type={module.sandboxType} />
        </div>

        {/* BOTTOM ACTION */}
        <div className="pt-6 flex items-center justify-center">
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-full sm:w-auto bg-[#FFE600] hover:bg-yellow-300 border-4 border-black px-8 py-4 font-black text-sm md:text-base uppercase shadow-[5px_5px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            Tutup Materi
          </button>
        </div>

      </div>
    </div>
  );
}
