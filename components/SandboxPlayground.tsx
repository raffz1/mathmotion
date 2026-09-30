'use client';

import React, { useState } from 'react';
import { Calculator, Layers, Compass, Sparkles } from 'lucide-react';
import { playSound } from '@/utils/audio';

interface SandboxProps {
  type: 'fpb_kpk' | 'fraction_basic' | 'geometry_shape' | 'fraction_advanced' | 'ratio_scale' | 'pattern_sequence' | 'negative_cube';
}

export default function SandboxPlayground({ type }: SandboxProps) {
  if (type === 'fpb_kpk') return <FpbKpkSandbox />;
  if (type === 'fraction_basic') return <FractionBasicSandbox />;
  if (type === 'geometry_shape') return <GeometryShapeSandbox />;
  if (type === 'fraction_advanced') return <FractionAdvancedSandbox />;
  if (type === 'ratio_scale') return <RatioScaleSandbox />;
  if (type === 'pattern_sequence') return <PatternSequenceSandbox />;
  if (type === 'negative_cube') return <NegativeCubeSandbox />;
  return null;
}

// ----------------------------------------------------
// 1. FPB & KPK SANDBOX
// ----------------------------------------------------
function FpbKpkSandbox() {
  const [numA, setNumA] = useState<number>(12);
  const [numB, setNumB] = useState<number>(18);

  const getFpb = (a: number, b: number): number => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  };

  const getKpk = (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / getFpb(a, b);
  };

  const getFactors = (n: number) => {
    const factors: number[] = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) factors.push(i);
    }
    return factors;
  };

  const getMultiples = (n: number) => {
    const mults: number[] = [];
    for (let i = 1; i <= 5; i++) {
      mults.push(n * i);
    }
    return mults;
  };

  const fpbVal = getFpb(numA, numB);
  const kpkVal = getKpk(numA, numB);

  return (
    <div className="bg-white border-4 border-black p-5 md:p-6 shadow-[6px_6px_0px_#000] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
        <h3 className="font-black text-base uppercase flex items-center gap-2">
          <Calculator className="w-5 h-5 text-black" /> Generator FPB & KPK Langsung
        </h3>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-600">Preset Soal:</span>
          {[
            [12, 18],
            [20, 30],
            [15, 25],
            [24, 36]
          ].map(([a, b]) => (
            <button
              key={`${a}-${b}`}
              onClick={() => {
                setNumA(a);
                setNumB(b);
                playSound('pop');
              }}
              className="bg-[#FFFDF0] hover:bg-[#FFE600] border-2 border-black px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              {a} & {b}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#FFFDF0] border-2 border-black p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-800">
            <span>Angka Pertama (A):</span>
            <span className="text-lg font-black text-[#FF0055]">{numA}</span>
          </div>
          <input
            type="range"
            min="2"
            max="60"
            value={numA}
            onChange={e => setNumA(Number(e.target.value))}
            className="w-full accent-black cursor-pointer"
          />
        </div>
        <div className="bg-[#FFFDF0] border-2 border-black p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-800">
            <span>Angka Kedua (B):</span>
            <span className="text-lg font-black text-[#00A896]">{numB}</span>
          </div>
          <input
            type="range"
            min="2"
            max="60"
            value={numB}
            onChange={e => setNumB(Number(e.target.value))}
            className="w-full accent-black cursor-pointer"
          />
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#FFE600] border-3 border-black p-4 shadow-[3px_3px_0px_#000] space-y-2">
          <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block">
            FPB (Faktor Terbesar)
          </span>
          <p className="text-3xl font-black">{fpbVal}</p>
          <p className="text-xs font-medium text-gray-800 leading-relaxed">
            Faktor {numA}: [{getFactors(numA).join(', ')}]<br />
            Faktor {numB}: [{getFactors(numB).join(', ')}]
          </p>
          <div className="text-xs font-medium bg-white border border-black p-2 rounded-xs">
            💡 Untuk membagi {numA} dan {numB} barang ke dalam <b>{fpbVal} kelompok sama banyak</b>.
          </div>
        </div>

        <div className="bg-[#00F5D4] border-3 border-black p-4 shadow-[3px_3px_0px_#000] space-y-2">
          <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block">
            KPK (Kelipatan Terkecil)
          </span>
          <p className="text-3xl font-black">{kpkVal}</p>
          <p className="text-xs font-medium text-gray-800 leading-relaxed">
            Kelipatan {numA}: {getMultiples(numA).join(', ')}...<br />
            Kelipatan {numB}: {getMultiples(numB).join(', ')}...
          </p>
          <div className="text-xs font-medium bg-white border border-black p-2 rounded-xs">
            💡 Kejadian tiap {numA} mnt dan {numB} mnt akan bersama lagi setiap <b>{kpkVal} menit</b>.
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. FRACTION BASIC SANDBOX
// ----------------------------------------------------
function FractionBasicSandbox() {
  const [num, setNum] = useState<number>(3);
  const [den, setDen] = useState<number>(4);

  const decimalVal = (num / den).toFixed(2);
  const percentVal = ((num / den) * 100).toFixed(0);

  return (
    <div className="bg-white border-4 border-black p-5 md:p-6 shadow-[6px_6px_0px_#000] space-y-5">
      <h3 className="font-black text-base uppercase flex items-center gap-2 border-b-2 border-black pb-3">
        <Layers className="w-5 h-5 text-black" /> Potongan Pecahan & Konverter
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#FFFDF0] border-2 border-black p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-800">
            <span>Pembilang (Atas):</span>
            <span className="text-lg font-black text-[#FF0055]">{num}</span>
          </div>
          <input
            type="range"
            min="1"
            max={den}
            value={num}
            onChange={e => setNum(Number(e.target.value))}
            className="w-full accent-black cursor-pointer"
          />
        </div>

        <div className="bg-[#FFFDF0] border-2 border-black p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-800">
            <span>Penyebut (Bawah):</span>
            <span className="text-lg font-black text-[#70D6FF]">{den}</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            value={den}
            onChange={e => {
              const newDen = Number(e.target.value);
              setDen(newDen);
              if (num > newDen) setNum(newDen);
            }}
            className="w-full accent-black cursor-pointer"
          />
        </div>
      </div>

      {/* Visual Bar */}
      <div className="bg-[#FFFDF0] border-2 border-black p-4 space-y-2">
        <span className="text-xs font-bold text-gray-700 block">
          Visualisasi {num}/{den} Potongan:
        </span>
        <div className="grid grid-cols-12 gap-1 bg-white p-2 border-2 border-black">
          {Array.from({ length: den }).map((_, idx) => (
            <div
              key={idx}
              className={`h-10 border border-black flex items-center justify-center font-bold text-xs transition-all ${
                idx < num ? 'bg-[#00F5D4] text-black font-black' : 'bg-gray-100 text-gray-400'
              }`}
              style={{ gridColumn: `span ${Math.floor(12 / den) || 1}` }}
            >
              1/{den}
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Display */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-[#FFE600] border-2 border-black p-3 shadow-[2px_2px_0px_#000]">
          <span className="text-[11px] font-bold text-gray-700 block">Pecahan Biasa</span>
          <p className="text-2xl font-black">{num}/{den}</p>
        </div>
        <div className="bg-[#70D6FF] border-2 border-black p-3 shadow-[2px_2px_0px_#000]">
          <span className="text-[11px] font-bold text-gray-700 block">Bentuk Desimal</span>
          <p className="text-2xl font-black">{decimalVal}</p>
        </div>
        <div className="bg-[#FF70A6] border-2 border-black p-3 shadow-[2px_2px_0px_#000]">
          <span className="text-[11px] font-bold text-gray-700 block">Bentuk Persen</span>
          <p className="text-2xl font-black">{percentVal}%</p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. GEOMETRY SHAPE SANDBOX
// ----------------------------------------------------
function GeometryShapeSandbox() {
  const [shape, setShape] = useState<'persegi_panjang' | 'persegi' | 'segitiga'>('persegi_panjang');
  const [val1, setVal1] = useState<number>(10);
  const [val2, setVal2] = useState<number>(6);

  let area = 0;
  let perimeter = 0;

  if (shape === 'persegi') {
    area = val1 * val1;
    perimeter = 4 * val1;
  } else if (shape === 'persegi_panjang') {
    area = val1 * val2;
    perimeter = 2 * (val1 + val2);
  } else if (shape === 'segitiga') {
    area = (val1 * val2) / 2;
    perimeter = val1 + val2 + Math.round(Math.hypot(val1, val2));
  }

  return (
    <div className="bg-white border-4 border-black p-5 md:p-6 shadow-[6px_6px_0px_#000] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
        <h3 className="font-black text-base uppercase flex items-center gap-2">
          <Compass className="w-5 h-5 text-black" /> Eksplorasi Bangun Datar
        </h3>
        <div className="flex gap-2">
          {(['persegi_panjang', 'persegi', 'segitiga'] as const).map(s => (
            <button
              key={s}
              onClick={() => {
                setShape(s);
                playSound('pop');
              }}
              className={`px-3 py-1 text-xs font-bold border-2 border-black uppercase shadow-[2px_2px_0px_#000] cursor-pointer ${
                shape === s ? 'bg-[#FFE600]' : 'bg-[#FFFDF0]'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#FFFDF0] border-2 border-black p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-800">
            <span>{shape === 'persegi' ? 'Panjang Sisi (s)' : shape === 'segitiga' ? 'Panjang Alas (a)' : 'Panjang (p)'}:</span>
            <span className="text-lg font-black text-[#FF0055]">{val1} cm</span>
          </div>
          <input
            type="range"
            min="2"
            max="30"
            value={val1}
            onChange={e => setVal1(Number(e.target.value))}
            className="w-full accent-black cursor-pointer"
          />
        </div>

        {shape !== 'persegi' && (
          <div className="bg-[#FFFDF0] border-2 border-black p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-800">
              <span>{shape === 'segitiga' ? 'Tinggi (t)' : 'Lebar (l)'}:</span>
              <span className="text-lg font-black text-[#00A896]">{val2} cm</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              value={val2}
              onChange={e => setVal2(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#70D6FF] border-3 border-black p-4 text-center shadow-[3px_3px_0px_#000]">
          <span className="text-xs font-bold uppercase text-gray-800 block">Luas (L)</span>
          <p className="text-3xl font-black text-black my-1">{area} cm²</p>
          <span className="text-xs font-medium text-gray-700">
            {shape === 'persegi' ? `${val1} × ${val1}` : shape === 'segitiga' ? `(${val1} × ${val2}) / 2` : `${val1} × ${val2}`}
          </span>
        </div>

        <div className="bg-[#FF9770] border-3 border-black p-4 text-center shadow-[3px_3px_0px_#000]">
          <span className="text-xs font-bold uppercase text-gray-800 block">Keliling (K)</span>
          <p className="text-3xl font-black text-black my-1">{perimeter} cm</p>
          <span className="text-xs font-medium text-gray-700">
            {shape === 'persegi' ? `4 × ${val1}` : shape === 'segitiga' ? `Jumlah 3 Sisi` : `2 × (${val1} + ${val2})`}
          </span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. FRACTION ADVANCED SANDBOX
// ----------------------------------------------------
function FractionAdvancedSandbox() {
  const [a, setA] = useState<number>(3);
  const [b, setB] = useState<number>(4);
  const [op, setOp] = useState<'x' | ':'>('x');
  const [c, setC] = useState<number>(2);
  const [d, setD] = useState<number>(5);

  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));

  let rawNum = op === 'x' ? a * c : a * d;
  let rawDen = op === 'x' ? b * d : b * c;
  const common = gcd(rawNum, rawDen);
  const simpNum = rawNum / common;
  const simpDen = rawDen / common;

  return (
    <div className="bg-white border-4 border-black p-5 md:p-6 shadow-[6px_6px_0px_#000] space-y-5">
      <h3 className="font-black text-base uppercase flex items-center gap-2 border-b-2 border-black pb-3">
        <Calculator className="w-5 h-5 text-black" /> Simulator Perkalian & Pembagian Pecahan
      </h3>

      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center bg-[#FFFDF0] border-2 border-black p-2.5">
          <input type="number" min="1" max="10" value={a} onChange={e => setA(Math.max(1, Number(e.target.value)))} className="w-12 text-center font-black border border-black p-1 mb-1 bg-white" />
          <div className="w-12 h-0.5 bg-black" />
          <input type="number" min="1" max="10" value={b} onChange={e => setB(Math.max(1, Number(e.target.value)))} className="w-12 text-center font-black border border-black p-1 mt-1 bg-white" />
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={() => { setOp('x'); playSound('pop'); }}
            className={`w-10 h-8 font-black border-2 border-black text-sm cursor-pointer ${op === 'x' ? 'bg-[#FFE600]' : 'bg-[#FFFDF0]'}`}
          >
            ×
          </button>
          <button
            onClick={() => { setOp(':'); playSound('pop'); }}
            className={`w-10 h-8 font-black border-2 border-black text-sm cursor-pointer ${op === ':' ? 'bg-[#FFE600]' : 'bg-[#FFFDF0]'}`}
          >
            :
          </button>
        </div>

        <div className="flex flex-col items-center bg-[#FFFDF0] border-2 border-black p-2.5">
          <input type="number" min="1" max="10" value={c} onChange={e => setC(Math.max(1, Number(e.target.value)))} className="w-12 text-center font-black border border-black p-1 mb-1 bg-white" />
          <div className="w-12 h-0.5 bg-black" />
          <input type="number" min="1" max="10" value={d} onChange={e => setD(Math.max(1, Number(e.target.value)))} className="w-12 text-center font-black border border-black p-1 mt-1 bg-white" />
        </div>
      </div>

      <div className="bg-[#FF70A6] border-3 border-black p-4 space-y-2">
        <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block">
          Langkah Pengerjaan:
        </span>
        <div className="text-xs md:text-sm font-medium text-black space-y-1">
          {op === 'x' ? (
            <>
              <p>1. Kalikan pembilang: {a} × {c} = <b>{rawNum}</b></p>
              <p>2. Kalikan penyebut: {b} × {d} = <b>{rawDen}</b></p>
            </>
          ) : (
            <>
              <p>1. Balik pecahan kedua: {c}/{d} menjadi <b>{d}/{c}</b></p>
              <p>2. Kalikan: ({a} × {d}) / ({b} × {c}) = <b>{rawNum}/{rawDen}</b></p>
            </>
          )}
        </div>
        <div className="bg-white border-2 border-black p-3 text-center mt-2">
          <span className="text-xs font-medium text-gray-600 block">Hasil Akhir Sederhana:</span>
          <p className="text-2xl font-black text-black">
            {simpNum}/{simpDen} {common > 1 ? `(dari ${rawNum}/${rawDen})` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. RATIO & SCALE SANDBOX
// ----------------------------------------------------
function RatioScaleSandbox() {
  const [ratioA, setRatioA] = useState<number>(3);
  const [ratioB, setRatioB] = useState<number>(5);
  const [realA, setRealA] = useState<number>(15);

  const realB = Math.round((ratioB / ratioA) * realA);
  const totalItem = realA + realB;

  return (
    <div className="bg-white border-4 border-black p-5 md:p-6 shadow-[6px_6px_0px_#000] space-y-5">
      <h3 className="font-black text-base uppercase flex items-center gap-2 border-b-2 border-black pb-3">
        <Compass className="w-5 h-5 text-black" /> Balancer Perbandingan (A : B)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#FFFDF0] border-2 border-black p-3 space-y-1">
          <label className="text-xs font-bold text-gray-700 block">Bagian Rasio A</label>
          <input type="number" min="1" max="20" value={ratioA} onChange={e => setRatioA(Math.max(1, Number(e.target.value)))} className="w-full text-center font-black border border-black p-1.5 text-lg bg-white" />
        </div>
        <div className="bg-[#FFFDF0] border-2 border-black p-3 space-y-1">
          <label className="text-xs font-bold text-gray-700 block">Bagian Rasio B</label>
          <input type="number" min="1" max="20" value={ratioB} onChange={e => setRatioB(Math.max(1, Number(e.target.value)))} className="w-full text-center font-black border border-black p-1.5 text-lg bg-white" />
        </div>
        <div className="bg-[#FFFDF0] border-2 border-black p-3 space-y-1">
          <label className="text-xs font-bold text-gray-700 block">Nilai Nyata A</label>
          <input type="number" min="1" max="500" value={realA} onChange={e => setRealA(Math.max(1, Number(e.target.value)))} className="w-full text-center font-black border border-black p-1.5 text-lg text-[#FF0055] bg-white" />
        </div>
      </div>

      <div className="bg-[#00F5D4] border-3 border-black p-4 space-y-2">
        <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block">
          Hasil Otomatis:
        </span>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-white border-2 border-black p-3">
            <span className="text-xs font-medium text-gray-600 block">Nilai Nyata B</span>
            <p className="text-3xl font-black text-[#FF0055]">{realB}</p>
            <span className="text-[11px] font-medium text-gray-600">({ratioB}/{ratioA}) × {realA}</span>
          </div>
          <div className="bg-white border-2 border-black p-3">
            <span className="text-xs font-medium text-gray-600 block">Total (A + B)</span>
            <p className="text-3xl font-black text-black">{totalItem}</p>
            <span className="text-[11px] font-medium text-gray-600">Bagian Total: {ratioA + ratioB}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. PATTERN & SEQUENCE SANDBOX
// ----------------------------------------------------
function PatternSequenceSandbox() {
  const [start, setStart] = useState<number>(3);
  const [diff, setDiff] = useState<number>(4);
  const [patternType, setPatternType] = useState<'aritmatika' | 'geometri'>('aritmatika');

  const terms: number[] = [];
  if (patternType === 'aritmatika') {
    for (let i = 0; i < 6; i++) {
      terms.push(start + i * diff);
    }
  } else {
    for (let i = 0; i < 5; i++) {
      terms.push(start * Math.pow(diff, i));
    }
  }

  return (
    <div className="bg-white border-4 border-black p-5 md:p-6 shadow-[6px_6px_0px_#000] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
        <h3 className="font-black text-base uppercase flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-black" /> Prediktor Barisan Bilangan
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => { setPatternType('aritmatika'); playSound('pop'); }}
            className={`px-3 py-1 text-xs font-bold border-2 border-black uppercase cursor-pointer ${
              patternType === 'aritmatika' ? 'bg-[#FFE600]' : 'bg-[#FFFDF0]'
            }`}
          >
            Aritmatika (+ Tambah)
          </button>
          <button
            onClick={() => { setPatternType('geometri'); setDiff(2); playSound('pop'); }}
            className={`px-3 py-1 text-xs font-bold border-2 border-black uppercase cursor-pointer ${
              patternType === 'geometri' ? 'bg-[#FFE600]' : 'bg-[#FFFDF0]'
            }`}
          >
            Geometri (× Kali)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#FFFDF0] border-2 border-black p-3 space-y-1">
          <label className="text-xs font-bold text-gray-700 block">Suku Pertama (a)</label>
          <input type="number" value={start} onChange={e => setStart(Number(e.target.value))} className="w-full font-black border border-black p-1 text-center bg-white" />
        </div>
        <div className="bg-[#FFFDF0] border-2 border-black p-3 space-y-1">
          <label className="text-xs font-bold text-gray-700 block">{patternType === 'aritmatika' ? 'Beda (+b)' : 'Rasio (×r)'}</label>
          <input type="number" min="1" max="10" value={diff} onChange={e => setDiff(Number(e.target.value))} className="w-full font-black border border-black p-1 text-center bg-white" />
        </div>
      </div>

      <div className="bg-[#C77DFF] border-3 border-black p-4 space-y-3">
        <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block">
          Suku yang Terbentuk:
        </span>
        <div className="flex flex-wrap gap-2 justify-center">
          {terms.map((t, idx) => (
            <div key={idx} className="bg-white border-2 border-black px-3 py-2 text-center shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-bold text-gray-500 block">U{idx + 1}</span>
              <span className="text-xl font-black">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 7. NEGATIVE NUMBERS & CUBE ROOT SANDBOX
// ----------------------------------------------------
function NegativeCubeSandbox() {
  const [val, setVal] = useState<number>(-4);
  const [cubeRootInput, setCubeRootInput] = useState<number>(512);

  const cubeRootResult = Math.round(Math.cbrt(cubeRootInput));

  return (
    <div className="bg-white border-4 border-black p-5 md:p-6 shadow-[6px_6px_0px_#000] space-y-5">
      <h3 className="font-black text-base uppercase flex items-center gap-2 border-b-2 border-black pb-3">
        <Calculator className="w-5 h-5 text-black" /> Garis Bilangan & Akar Pangkat Tiga
      </h3>

      <div className="bg-[#FFFDF0] border-2 border-black p-4 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-gray-800">
          <span>Posisi Garis Bilangan:</span>
          <span className="text-lg font-black text-[#FF0055]">{val}</span>
        </div>
        <input
          type="range"
          min="-10"
          max="10"
          value={val}
          onChange={e => setVal(Number(e.target.value))}
          className="w-full accent-black cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-medium text-gray-600">
          <span>-10 (Lebih Kecil)</span>
          <span className="font-bold text-black">0 (Netral)</span>
          <span>+10 (Lebih Besar)</span>
        </div>
      </div>

      <div className="bg-[#70D6FF] border-3 border-black p-4 space-y-2">
        <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block">
          Uji Coba Akar Pangkat Tiga (³√)
        </span>
        <div className="flex flex-wrap gap-2 my-2">
          {[64, 125, 216, 512, 729, 1000].map(n => (
            <button
              key={n}
              onClick={() => { setCubeRootInput(n); playSound('pop'); }}
              className="bg-white hover:bg-yellow-300 border-2 border-black px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              ³√{n}
            </button>
          ))}
        </div>
        <div className="bg-white border-2 border-black p-3 text-center">
          <span className="text-xs font-medium text-gray-600 block">Hasil:</span>
          <p className="text-2xl font-black text-black">³√{cubeRootInput} = {cubeRootResult}</p>
          <span className="text-[11px] font-medium text-gray-600">Karena {cubeRootResult} × {cubeRootResult} × {cubeRootResult} = {cubeRootInput}</span>
        </div>
      </div>
    </div>
  );
}
