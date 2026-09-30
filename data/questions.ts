export type Grade = 5 | 6;

export interface HandQuestion {
  id: number;
  question: string;
  subText?: string;
  topic: string;
  options: [string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface HeadQuestion {
  id: number;
  statement: string;
  topic: string;
  isTrue: boolean;
  explanation: string;
}

export interface GradeBank {
  handQuestions: HandQuestion[];
  headQuestions: HeadQuestion[];
}

export const QUESTION_BANK: Record<Grade, GradeBank> = {
  5: {
    handQuestions: [
      // KPK & FPB
      {
        id: 101,
        topic: "FPB & KPK",
        question: "FPB dari bilangan 18 dan 24 adalah...",
        options: ["6", "12", "3"],
        correctIndex: 0,
        explanation: "Faktor 18 = {1, 2, 3, 6, 9, 18} dan faktor 24 = {1, 2, 3, 4, 6, 8, 12, 24}. Faktor persekutuan terbesar adalah 6."
      },
      {
        id: 102,
        topic: "FPB & KPK",
        question: "KPK dari bilangan 6 dan 8 adalah...",
        options: ["16", "24", "48"],
        correctIndex: 1,
        explanation: "Kelipatan 6 = {6, 12, 18, 24, ...} dan kelipatan 8 = {8, 16, 24, ...}. KPK terkecil yang sama adalah 24."
      },
      {
        id: 103,
        topic: "FPB & KPK",
        question: "Lampu A menyala tiap 4 menit, Lampu B tiap 6 menit. Keduanya menyala bersama setiap...",
        options: ["12 menit", "24 menit", "10 menit"],
        correctIndex: 0,
        explanation: "Gunakan KPK dari 4 dan 6. KPK(4, 6) = 12, sehingga keduanya menyala bersama setiap 12 menit."
      },
      {
        id: 104,
        topic: "FPB & KPK",
        question: "Ibu membagikan 20 kue lapis dan 30 kue bolu ke dalam piring sama banyak. Jumlah piring terbanyak adalah...",
        options: ["5 piring", "10 piring", "15 piring"],
        correctIndex: 1,
        explanation: "Gunakan FPB dari 20 dan 30. FPB(20, 30) = 10 piring (masing-masing piring berisi 2 kue lapis dan 3 kue bolu)."
      },
      {
        id: 105,
        topic: "FPB & KPK",
        question: "Faktorisasi prima dari bilangan 60 adalah...",
        options: ["2² × 3 × 5", "2 × 3² × 5", "2³ × 5"],
        correctIndex: 0,
        explanation: "60 = 4 × 15 = 2² × 3 × 5."
      },
      {
        id: 106,
        topic: "FPB & KPK",
        question: "KPK dari bilangan 12 dan 15 adalah...",
        options: ["30", "60", "90"],
        correctIndex: 1,
        explanation: "12 = 2² × 3, 15 = 3 × 5. KPK = 2² × 3 × 5 = 4 × 15 = 60."
      },
      {
        id: 107,
        topic: "FPB & KPK",
        question: "FPB dari bilangan 36 dan 48 adalah...",
        options: ["12", "18", "6"],
        correctIndex: 0,
        explanation: "36 = 2² × 3², 48 = 2⁴ × 3. FPB = 2² × 3 = 12."
      },
      {
        id: 108,
        topic: "FPB & KPK",
        question: "Budi les renang tiap 3 hari, Doni tiap 5 hari. Jika hari ini berenang bersama, mereka akan bersama lagi dalam...",
        options: ["8 hari", "15 hari", "30 hari"],
        correctIndex: 1,
        explanation: "KPK dari 3 dan 5 adalah 3 × 5 = 15 hari."
      },

      // PECAHAN & DESIMAL
      {
        id: 109,
        topic: "Pecahan",
        question: "Pecahan yang senilai dengan 3/5 adalah...",
        options: ["6/10", "5/3", "9/20"],
        correctIndex: 0,
        explanation: "Jika pembilang dan penyebut 3/5 sama-sama dikalikan 2, maka hasilnya 6/10."
      },
      {
        id: 110,
        topic: "Pecahan",
        question: "Hasil penjumlahan dari 1/3 + 2/5 adalah...",
        options: ["3/8", "11/15", "7/15"],
        correctIndex: 1,
        explanation: "Samakan penyebut menjadi 15: 5/15 + 6/15 = 11/15."
      },
      {
        id: 111,
        topic: "Pecahan",
        question: "Bentuk desimal dari pecahan 3/4 adalah...",
        options: ["0,75", "0,34", "0,50"],
        correctIndex: 0,
        explanation: "3 dibagi 4 = 0,75 (atau 3/4 = 75/100 = 0,75)."
      },
      {
        id: 112,
        topic: "Pecahan",
        question: "Bentuk persen dari pecahan 4/5 adalah...",
        options: ["40%", "80%", "75%"],
        correctIndex: 1,
        explanation: "4/5 × 100% = 400% / 5 = 80%."
      },
      {
        id: 113,
        topic: "Pecahan",
        question: "Hasil dari 3/4 - 1/2 adalah...",
        options: ["1/4", "2/2", "1/8"],
        correctIndex: 0,
        explanation: "Ubah 1/2 menjadi 2/4. Maka 3/4 - 2/4 = 1/4."
      },
      {
        id: 114,
        topic: "Pecahan",
        question: "Bentuk pecahan campuran dari 13/4 adalah...",
        options: ["3 1/4", "2 3/4", "4 1/3"],
        correctIndex: 0,
        explanation: "13 dibagi 4 menghasilkan 3 dengan sisa 1, sehingga ditulis 3 1/4."
      },
      {
        id: 115,
        topic: "Pecahan",
        question: "Berapakah nilai 2/3 dari 60 kelereng?",
        options: ["20 butir", "40 butir", "30 butir"],
        correctIndex: 1,
        explanation: "(60 : 3) × 2 = 20 × 2 = 40 butir kelereng."
      },
      {
        id: 116,
        topic: "Pecahan",
        question: "Urutan pecahan dari terkecil ke terbesar: 1/2, 1/4, 3/4 adalah...",
        options: ["1/4, 1/2, 3/4", "1/2, 1/4, 3/4", "3/4, 1/2, 1/4"],
        correctIndex: 0,
        explanation: "Dalam desimal: 0,25 < 0,50 < 0,75. Jadi urutannya 1/4, 1/2, 3/4."
      },
      {
        id: 117,
        topic: "Pecahan",
        question: "Hasil dari 0,25 + 1,5 adalah...",
        options: ["1,75", "0,40", "1,25"],
        correctIndex: 0,
        explanation: "0,25 + 1,50 = 1,75."
      },

      // GEOMETRI & BANGUN DATAR
      {
        id: 118,
        topic: "Geometri",
        question: "Keliling persegi yang memiliki panjang sisi 12 cm adalah...",
        options: ["24 cm", "48 cm", "144 cm"],
        correctIndex: 1,
        explanation: "Keliling persegi = 4 × sisi = 4 × 12 = 48 cm."
      },
      {
        id: 119,
        topic: "Geometri",
        question: "Luas segitiga dengan alas 14 cm dan tinggi 8 cm adalah...",
        options: ["56 cm²", "112 cm²", "22 cm²"],
        correctIndex: 0,
        explanation: "Luas segitiga = (alas × tinggi) / 2 = (14 × 8) / 2 = 112 / 2 = 56 cm²."
      },
      {
        id: 120,
        topic: "Geometri",
        question: "Sudut yang besarnya lebih dari 90° dan kurang dari 180° disebut sudut...",
        options: ["Lancip", "Tumpul", "Refleks"],
        correctIndex: 1,
        explanation: "Sudut tumpul besarnya antara 90° dan 180°."
      },
      {
        id: 121,
        topic: "Geometri",
        question: "Jumlah seluruh sudut di dalam sebuah segitiga selalu sama dengan...",
        options: ["90°", "180°", "360°"],
        correctIndex: 1,
        explanation: "Jumlah ketiga sudut dalam segitiga selalu tepat 180°."
      },
      {
        id: 122,
        topic: "Geometri",
        question: "Sebuah persegi panjang memiliki panjang 15 cm dan lebar 6 cm. Luasnya adalah...",
        options: ["42 cm²", "90 cm²", "21 cm²"],
        correctIndex: 1,
        explanation: "Luas persegi panjang = panjang × lebar = 15 × 6 = 90 cm²."
      },
      {
        id: 123,
        topic: "Geometri",
        question: "Keliling persegi panjang dengan panjang 10 cm dan lebar 5 cm adalah...",
        options: ["30 cm", "50 cm", "15 cm"],
        correctIndex: 0,
        explanation: "Keliling = 2 × (panjang + lebar) = 2 × (10 + 5) = 2 × 15 = 30 cm."
      },
      {
        id: 124,
        topic: "Geometri",
        question: "Bangun datar jajargenjang memiliki alas 12 cm dan tinggi 7 cm. Luasnya adalah...",
        options: ["84 cm²", "42 cm²", "19 cm²"],
        correctIndex: 0,
        explanation: "Luas jajargenjang = alas × tinggi = 12 × 7 = 84 cm²."
      },

      // PENGUKURAN, SKALA & KECEPATAN
      {
        id: 125,
        topic: "Pengukuran & Skala",
        question: "Jarak pada peta 5 cm dengan skala 1 : 200.000. Jarak sebenarnya adalah...",
        options: ["10 km", "1 km", "100 km"],
        correctIndex: 0,
        explanation: "5 cm × 200.000 = 1.000.000 cm = 10.000 m = 10 km."
      },
      {
        id: 126,
        topic: "Pengukuran & Skala",
        question: "Mobil melaju dengan kecepatan 60 km/jam selama 2,5 jam. Jarak tempuhnya adalah...",
        options: ["120 km", "150 km", "180 km"],
        correctIndex: 1,
        explanation: "Jarak = Kecepatan × Waktu = 60 × 2,5 = 150 km."
      },
      {
        id: 127,
        topic: "Pengukuran & Skala",
        question: "Debit air pipa adalah 12 liter/menit. Volume air yang mengalir dalam 5 menit adalah...",
        options: ["60 liter", "30 liter", "2,4 liter"],
        correctIndex: 0,
        explanation: "Volume = Debit × Waktu = 12 liter/menit × 5 menit = 60 liter."
      },
      {
        id: 128,
        topic: "Pengukuran & Skala",
        question: "Nilai dari 2,5 kg sama dengan berapa gram?",
        options: ["250 gram", "2.500 gram", "25.000 gram"],
        correctIndex: 1,
        explanation: "1 kg = 1.000 gram. Jadi 2,5 × 1.000 = 2.500 gram."
      },
      {
        id: 129,
        topic: "Pengukuran & Skala",
        question: "Waktu 2 jam 15 menit sama dengan...",
        options: ["125 menit", "135 menit", "150 menit"],
        correctIndex: 1,
        explanation: "(2 × 60 menit) + 15 menit = 120 + 15 = 135 menit."
      },
      {
        id: 130,
        topic: "Pengukuran & Skala",
        question: "Sebuah bak terisi 180 liter dalam waktu 3 menit. Debit kran air tersebut adalah...",
        options: ["60 liter/menit", "30 liter/menit", "90 liter/menit"],
        correctIndex: 0,
        explanation: "Debit = Volume / Waktu = 180 liter / 3 menit = 60 liter/menit."
      }
    ],
    headQuestions: [
      {
        id: 151,
        topic: "Konsep Dasar",
        statement: "Bilangan 23 adalah bilangan prima.",
        isTrue: true,
        explanation: "Benar! 23 hanya memiliki 2 faktor, yaitu 1 dan 23."
      },
      {
        id: 152,
        topic: "Konsep Pecahan",
        statement: "Pecahan 3/4 nilainya lebih besar daripada 4/5.",
        isTrue: false,
        explanation: "Salah! 3/4 = 0,75 sedangkan 4/5 = 0,80. Jadi 4/5 lebih besar."
      },
      {
        id: 153,
        topic: "Konsep Geometri",
        statement: "Persegi memiliki 4 sisi sama panjang dan 4 sudut siku-siku 90°.",
        isTrue: true,
        explanation: "Benar! Sifat persegi adalah keempat sisinya sama dan seluruh sudutnya siku-siku."
      },
      {
        id: 154,
        topic: "Konsep Bilangan",
        statement: "Angka 0,08 sama nilainya dengan 8/10.",
        isTrue: false,
        explanation: "Salah! 0,08 sama dengan 8/100 (atau 2/25), bukan 8/10."
      },
      {
        id: 155,
        topic: "Konsep FPB",
        statement: "FPB dari bilangan 7 dan 14 adalah 7.",
        isTrue: true,
        explanation: "Benar! 7 membagi habis 7 dan membagi habis 14."
      },
      {
        id: 156,
        topic: "Konsep Satuan",
        statement: "1 kilometer sama dengan 10.000 meter.",
        isTrue: false,
        explanation: "Salah! 1 kilometer sama dengan 1.000 meter."
      },
      {
        id: 157,
        topic: "Konsep Geometri",
        statement: "Segitiga sama sisi memiliki 3 sudut yang masing-masing bernilai 60°.",
        isTrue: true,
        explanation: "Benar! 180° dibagi 3 sudut sama besar = 60° tiap sudut."
      },
      {
        id: 158,
        topic: "Konsep KPK",
        statement: "KPK dari 5 dan 10 adalah 50.",
        isTrue: false,
        explanation: "Salah! KPK dari 5 dan 10 adalah 10 (kelipatan terkecil yang sama)."
      },
      {
        id: 159,
        topic: "Konsep Persen",
        statement: "50% dari 300 adalah 150.",
        isTrue: true,
        explanation: "Benar! 50% = 1/2. Setengah dari 300 adalah 150."
      },
      {
        id: 160,
        topic: "Konsep Sudut",
        statement: "Sudut lancip adalah sudut yang besarnya lebih dari 90 derajat.",
        isTrue: false,
        explanation: "Salah! Sudut lancip besarnya kurang dari 90 derajat."
      }
    ]
  },
  6: {
    handQuestions: [
      // BILANGAN BULAT NEGATIF & OPERASI
      {
        id: 201,
        topic: "Bilangan Bulat",
        question: "Hasil dari (-15) + 28 adalah...",
        options: ["13", "-13", "43"],
        correctIndex: 0,
        explanation: "Hutang 15 dibayar 28, tersisa surplus positif 13."
      },
      {
        id: 202,
        topic: "Bilangan Bulat",
        question: "Hasil dari (-8) × (-9) adalah...",
        options: ["-72", "72", "17"],
        correctIndex: 1,
        explanation: "Perkalian dua bilangan negatif selalu menghasilkan bilangan positif: (-8) × (-9) = +72."
      },
      {
        id: 203,
        topic: "Bilangan Bulat",
        question: "Hasil dari 24 - (-16) adalah...",
        options: ["8", "40", "-40"],
        correctIndex: 1,
        explanation: "Pengurangan dengan negatif menjadi penjumlahan: 24 - (-16) = 24 + 16 = 40."
      },
      {
        id: 204,
        topic: "Bilangan Bulat",
        question: "Suhu awal -3°C kemudian naik 8°C. Suhu sekarang adalah...",
        options: ["5°C", "-11°C", "11°C"],
        correctIndex: 0,
        explanation: "-3 + 8 = 5°C."
      },
      {
        id: 205,
        topic: "Bilangan Bulat",
        question: "Hasil pembagian (-72) : 8 adalah...",
        options: ["-9", "9", "-8"],
        correctIndex: 0,
        explanation: "Bilangan negatif dibagi positif menghasilkan negatif: -72 : 8 = -9."
      },
      {
        id: 206,
        topic: "Bilangan Bulat",
        question: "Urutan bilangan bulat dari yang terkecil: -7, 4, -12, 0, 3 adalah...",
        options: ["-12, -7, 0, 3, 4", "0, 3, 4, -7, -12", "-7, -12, 0, 3, 4"],
        correctIndex: 0,
        explanation: "Semakin ke kiri pada garis bilangan, nilai semakin kecil: -12 < -7 < 0 < 3 < 4."
      },

      // AKAR & PANGKAT TIGA
      {
        id: 207,
        topic: "Akar & Pangkat Tiga",
        question: "Nilai dari 8³ (8 pangkat tiga) adalah...",
        options: ["64", "512", "216"],
        correctIndex: 1,
        explanation: "8 × 8 × 8 = 64 × 8 = 512."
      },
      {
        id: 208,
        topic: "Akar & Pangkat Tiga",
        question: "Akar pangkat tiga dari 1.728 (³√1.728) adalah...",
        options: ["12", "14", "18"],
        correctIndex: 0,
        explanation: "12 × 12 × 12 = 1.728."
      },
      {
        id: 209,
        topic: "Akar & Pangkat Tiga",
        question: "Nilai dari ³√3.375 adalah...",
        options: ["15", "25", "35"],
        correctIndex: 0,
        explanation: "15 × 15 × 15 = 225 × 15 = 3.375."
      },
      {
        id: 210,
        topic: "Akar & Pangkat Tiga",
        question: "Sebuah kubus memiliki volume 729 cm³. Panjang rusuk kubus tersebut adalah...",
        options: ["7 cm", "8 cm", "9 cm"],
        correctIndex: 2,
        explanation: "Panjang rusuk = ³√729 = 9 cm (karena 9 × 9 × 9 = 729)."
      },

      // OPERASI PECAHAN LANJUTAN (PERKALIAN & PEMBAGIAN)
      {
        id: 211,
        topic: "Operasi Pecahan",
        question: "Hasil dari 3/4 × 2/5 adalah...",
        options: ["6/20 atau 3/10", "5/9", "6/9"],
        correctIndex: 0,
        explanation: "(3 × 2) / (4 × 5) = 6/20 = disederhanakan menjadi 3/10."
      },
      {
        id: 212,
        topic: "Operasi Pecahan",
        question: "Hasil dari 2/3 : 4/5 adalah...",
        options: ["8/15", "10/12 atau 5/6", "6/15"],
        correctIndex: 1,
        explanation: "Pembagian pecahan dibalik menjadi perkalian: 2/3 × 5/4 = 10/12 = 5/6."
      },
      {
        id: 213,
        topic: "Operasi Pecahan",
        question: "Hasil dari 1 1/2 × 2/3 adalah...",
        options: ["1", "3/2", "3/6"],
        correctIndex: 0,
        explanation: "Ubah ke pecahan biasa: 3/2 × 2/3 = 6/6 = 1."
      },
      {
        id: 214,
        topic: "Operasi Pecahan",
        question: "Ibu memiliki 3/4 kg gula. Untuk membuat 1 kue butuh 1/8 kg. Berapa kue yang bisa dibuat?",
        options: ["4 kue", "6 kue", "8 kue"],
        correctIndex: 1,
        explanation: "3/4 : 1/8 = 3/4 × 8/1 = 24/4 = 6 kue."
      },

      // RASIO & PERBANDINGAN
      {
        id: 215,
        topic: "Rasio & Perbandingan",
        question: "Perbandingan kelereng Rama dan Shinta 3 : 5. Jika kelereng Rama 15 butir, kelereng Shinta adalah...",
        options: ["25 butir", "20 butir", "30 butir"],
        correctIndex: 0,
        explanation: "Kelereng Shinta = (5 / 3) × 15 = 5 × 5 = 25 butir."
      },
      {
        id: 216,
        topic: "Rasio & Perbandingan",
        question: "Jumlah uang Ani dan Budi Rp60.000. Rasio uang Ani : Budi adalah 2 : 3. Uang Budi adalah...",
        options: ["Rp24.000", "Rp36.000", "Rp40.000"],
        correctIndex: 1,
        explanation: "Total bagian = 2 + 3 = 5. Uang Budi = (3 / 5) × 60.000 = 3 × 12.000 = Rp36.000."
      },
      {
        id: 217,
        topic: "Rasio & Perbandingan",
        question: "Umur Ayah : Umur Anak = 7 : 2. Jika selisih umur mereka 30 tahun, umur Ayah adalah...",
        options: ["35 tahun", "42 tahun", "49 tahun"],
        correctIndex: 1,
        explanation: "Selisih bagian = 7 - 2 = 5. Nilai 1 bagian = 30 / 5 = 6. Umur Ayah = 7 × 6 = 42 tahun."
      },
      {
        id: 218,
        topic: "Rasio & Perbandingan",
        question: "Perbandingan buku IPA dan Matematika di rak adalah 4 : 7. Jika ada 28 buku Matematika, berapa buku IPA?",
        options: ["14 buku", "16 buku", "20 buku"],
        correctIndex: 1,
        explanation: "Buku IPA = (4 / 7) × 28 = 4 × 4 = 16 buku."
      },

      // BANGUN RUANG (KUBUS, BALOK, LINGKARAN, TABUNG)
      {
        id: 219,
        topic: "Bangun Ruang",
        question: "Volume balok dengan ukuran panjang 12 cm, lebar 8 cm, dan tinggi 5 cm adalah...",
        options: ["480 cm³", "240 cm³", "360 cm³"],
        correctIndex: 0,
        explanation: "Volume balok = p × l × t = 12 × 8 × 5 = 480 cm³."
      },
      {
        id: 220,
        topic: "Lingkaran",
        question: "Keliling lingkaran dengan jari-jari r = 14 cm (π = 22/7) adalah...",
        options: ["44 cm", "88 cm", "616 cm"],
        correctIndex: 1,
        explanation: "K = 2 × π × r = 2 × (22/7) × 14 = 2 × 22 × 2 = 88 cm."
      },
      {
        id: 221,
        topic: "Lingkaran",
        question: "Luas lingkaran dengan diameter 14 cm (r = 7 cm, π = 22/7) adalah...",
        options: ["154 cm²", "308 cm²", "44 cm²"],
        correctIndex: 0,
        explanation: "Luas = π × r² = (22/7) × 7 × 7 = 22 × 7 = 154 cm²."
      },
      {
        id: 222,
        topic: "Bangun Ruang",
        question: "Luas permukaan kubus dengan panjang rusuk 5 cm adalah...",
        options: ["125 cm²", "150 cm²", "100 cm²"],
        correctIndex: 1,
        explanation: "Luas permukaan = 6 × s² = 6 × (5 × 5) = 6 × 25 = 150 cm²."
      },
      {
        id: 223,
        topic: "Bangun Ruang",
        question: "Sebuah tabung memiliki jari-jari 7 cm dan tinggi 10 cm. Volume tabung adalah...",
        options: ["1.540 cm³", "770 cm³", "3.080 cm³"],
        correctIndex: 0,
        explanation: "Volume = π × r² × t = (22/7) × 7 × 7 × 10 = 154 × 10 = 1.540 cm³."
      },
      {
        id: 224,
        topic: "Bangun Ruang",
        question: "Banyaknya titik sudut pada bangun limas segi empat adalah...",
        options: ["4 titik", "5 titik", "8 titik"],
        correctIndex: 1,
        explanation: "Limas segi empat memiliki 1 titik puncak dan 4 titik sudut alas, total 5 titik sudut."
      },

      // POLA BILANGAN & STATISTIKA DASAR
      {
        id: 225,
        topic: "Pola Bilangan",
        question: "Lanjutan dari barisan pola bilangan: 3, 7, 11, 15, ... adalah...",
        options: ["19", "18", "21"],
        correctIndex: 0,
        explanation: "Pola bertambah 4 tiap suku: 15 + 4 = 19."
      },
      {
        id: 226,
        topic: "Pola Bilangan",
        question: "Dua bilangan berikutnya dari barisan 2, 4, 8, 16, ... adalah...",
        options: ["32 dan 64", "24 dan 32", "30 dan 60"],
        correctIndex: 0,
        explanation: "Pola dikali 2 tiap suku: 16 × 2 = 32, 32 × 2 = 64."
      },
      {
        id: 227,
        topic: "Statistika",
        question: "Nilai ulangan Matematika: 7, 8, 6, 9, 10. Rata-rata (mean) nilai tersebut adalah...",
        options: ["7,5", "8,0", "8,5"],
        correctIndex: 1,
        explanation: "Total = 7 + 8 + 6 + 9 + 10 = 40. Rata-rata = 40 / 5 = 8,0."
      },
      {
        id: 228,
        topic: "Statistika",
        question: "Modus dari data nilai: 6, 7, 8, 7, 9, 7, 8, 10 adalah...",
        options: ["7", "8", "9"],
        correctIndex: 0,
        explanation: "Modus adalah nilai yang paling sering muncul. Angka 7 muncul sebanyak 3 kali."
      },
      {
        id: 229,
        topic: "Statistika",
        question: "Median (nilai tengah) dari data terurut: 5, 6, 7, 8, 9, 10, 11 adalah...",
        options: ["7", "8", "9"],
        correctIndex: 1,
        explanation: "Data ada 7 buah, posisi tengah berada pada data ke-4 yaitu 8."
      },
      {
        id: 230,
        topic: "Pola Bilangan",
        question: "Rumus suku ke-n dari barisan aritmatika 2, 4, 6, 8, ... adalah...",
        options: ["2n", "n + 2", "2n + 1"],
        correctIndex: 0,
        explanation: "Suku ke-n adalah 2 × n (untuk n=1 -> 2, n=2 -> 4, n=3 -> 6)."
      }
    ],
    headQuestions: [
      {
        id: 251,
        topic: "Logika Bilangan Bulat",
        statement: "Bilangan (-20) nilainya lebih kecil daripada (-5).",
        isTrue: true,
        explanation: "Benar! Pada garis bilangan, -20 terletak jauh di sebelah kiri -5."
      },
      {
        id: 252,
        topic: "Operasi Negatif",
        statement: "Hasil dari (-6) × (-7) adalah -42.",
        isTrue: false,
        explanation: "Salah! Perkalian dua bilangan negatif menghasilkan bilangan positif (+42)."
      },
      {
        id: 253,
        topic: "Bangun Ruang",
        statement: "Tabung memiliki 3 buah sisi (sisi alas, sisi tutup, dan selimut tabung).",
        isTrue: true,
        explanation: "Benar! Tabung terdiri dari 2 lingkaran (alas & tutup) dan 1 selimut lengkung."
      },
      {
        id: 254,
        topic: "Akar Pangkat Tiga",
        statement: "Akar pangkat tiga dari 1.000 (³√1000) adalah 100.",
        isTrue: false,
        explanation: "Salah! ³√1.000 = 10, karena 10 × 10 × 10 = 1.000."
      },
      {
        id: 255,
        topic: "Logika Nol",
        statement: "Bilangan 0 nilainya selalu lebih besar daripada semua bilangan bulat negatif.",
        isTrue: true,
        explanation: "Benar! Nol berada di sebelah kanan semua bilangan negatif pada garis bilangan."
      },
      {
        id: 256,
        topic: "Geometri Lingkaran",
        statement: "Panjang diameter sebuah lingkaran adalah dua kali panjang jari-jarinya (d = 2r).",
        isTrue: true,
        explanation: "Benar! Diameter adalah garis tengah yang panjangnya tepat 2 × jari-jari."
      },
      {
        id: 257,
        topic: "Operasi Pecahan",
        statement: "1/2 dibagi 1/2 hasilnya adalah 1/4.",
        isTrue: false,
        explanation: "Salah! Suatu bilangan dibagi bilangan yang sama menghasilkan 1 (1/2 : 1/2 = 1/2 × 2/1 = 1)."
      },
      {
        id: 258,
        topic: "Bangun Ruang",
        statement: "Balok memiliki 12 rusuk dan 8 titik sudut.",
        isTrue: true,
        explanation: "Benar! Sifat balok memiliki 12 rusuk, 8 titik sudut, dan 6 bidang sisi."
      },
      {
        id: 259,
        topic: "Pola Bilangan",
        statement: "Pola barisan 1, 4, 9, 16, 25 adalah pola bilangan kuadrat (persegi).",
        isTrue: true,
        explanation: "Benar! 1², 2², 3², 4², 5² menghasilkan 1, 4, 9, 16, 25."
      },
      {
        id: 260,
        topic: "Statistika",
        statement: "Rata-rata dari nilai 10, 20, dan 30 adalah 25.",
        isTrue: false,
        explanation: "Salah! Rata-rata = (10 + 20 + 30) / 3 = 60 / 3 = 20."
      }
    ]
  }
};

// Shuffler Helper Function
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Function to generate 20 randomized questions (15 Hand + 5 Head)
export function generateRandomQuizSession(grade: Grade) {
  const bank = QUESTION_BANK[grade];
  const shuffledHand = shuffleArray(bank.handQuestions).slice(0, 15);
  const shuffledHead = shuffleArray(bank.headQuestions).slice(0, 5);

  return {
    handQuestions: shuffledHand,
    headQuestions: shuffledHead,
    totalQuestions: 20
  };
}
