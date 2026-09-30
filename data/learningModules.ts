export interface MiniQuiz {
  question: string;
  options: [string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface CaseStudy {
  title: string;
  story: string;
  problem: string;
  solutionSteps: string[];
}

export interface LearningModule {
  id: string;
  grade: 5 | 6;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  iconName: string;
  summary: string;
  keyFormulas: { name: string; formula: string; note: string }[];
  caseStudy: CaseStudy;
  miniQuiz: MiniQuiz;
  realWorldTips: string[];
  sandboxType: 'fpb_kpk' | 'fraction_basic' | 'geometry_shape' | 'fraction_advanced' | 'ratio_scale' | 'pattern_sequence' | 'negative_cube';
}

export const LEARNING_MODULES: LearningModule[] = [
  // ==========================================
  // KELAS 5 MODULES (3 MODUL)
  // ==========================================
  {
    id: 'kpk-fpb-5',
    grade: 5,
    title: 'KPK & FPB',
    subtitle: 'Kuasai teknik pohon faktor dan trik kilat menjawab soal cerita!',
    badge: 'POPULER',
    color: '#FFE600',
    iconName: 'Zap',
    summary: 'Yuk cari tahu rahasia membagi bingkisan sama rata dan menghitung waktu lampu menyala barengan!',
    keyFormulas: [
      {
        name: 'Trik Kata Kunci FPB',
        formula: 'FPB = "dibagi sama banyak", "wadah/piring terbanyak", "isi sama rata"',
        note: 'Gunakan faktorisasi prima, pilih faktor prima yang sama dengan pangkat terkecil.'
      },
      {
        name: 'Trik Kata Kunci KPK',
        formula: 'KPK = "bersama-sama lagi", "bertemu kembali", "setiap ... menit/hari sekali"',
        note: 'Pilih semua faktor prima, jika ada yang sama ambil pangkat terbesar.'
      }
    ],
    caseStudy: {
      title: 'Studi Kasus: Jadwal Patroli Pos Ronda Malam',
      story: 'Pak Budi dan Pak Joko bertugas ronda malam di perumahan. Pak Budi memukul kentongan setiap 12 menit sekali, sedangkan Pak Joko berkeliling dengan sepeda setiap 18 menit sekali.',
      problem: 'Jika mereka mulai bertugas bersamaan pada pukul 20.00, pada pukul berapa mereka akan kembali membunyikan tanda ronda secara bersamaan?',
      solutionSteps: [
        '1. Karena mencari waktu kejadian berulang bersama, kita gunakan KPK.',
        '2. Faktorisasi 12 = 2² × 3 dan 18 = 2 × 3².',
        '3. KPK(12, 18) = 2² × 3² = 4 × 9 = 36 menit.',
        '4. Waktu bersamaan: Pukul 20.00 + 36 menit = Pukul 20.36.'
      ]
    },
    miniQuiz: {
      question: 'Ibu memiliki 24 permen cokelat dan 36 biskuit. Ibu ingin membagikannya ke dalam kantong plastik sebanyak-banyaknya dengan isi sama rata. Berapa jumlah kantong plastik yang dibutuhkan?',
      options: ['6 kantong', '12 kantong', '18 kantong'],
      correctIndex: 1,
      explanation: 'Gunakan FPB dari 24 dan 36. Faktor persekutuan terbesar dari 24 dan 36 adalah 12, jadi jumlah kantong terbanyak adalah 12 kantong (masing-masing berisi 2 cokelat & 3 biskuit).'
    },
    realWorldTips: [
      'Contoh FPB: Merangkai bunga mawar merah (30 tangkai) dan putih (45 tangkai) ke dalam vas bunga sama rata -> FPB(30, 45) = 15 vas bunga.',
      'Contoh KPK: Lampu hias merah menyala tiap 4 detik dan lampu hijau tiap 6 detik -> KPK(4, 6) = 12 detik sekali menyala bareng.'
    ],
    sandboxType: 'fpb_kpk'
  },
  {
    id: 'pecahan-desimal-5',
    grade: 5,
    title: 'Operasi Pecahan & Desimal',
    subtitle: 'Menyamakan penyebut, mengubah desimal & persen dengan visual bar',
    badge: 'DASAR',
    color: '#00F5D4',
    iconName: 'Sparkles',
    summary: 'Belajar serunya potong pizza bareng teman, ubah pecahan ke desimal, dan hitung diskon jajan!',
    keyFormulas: [
      {
        name: 'Menyamakan Penyebut',
        formula: '(a/b) + (c/d) = ((a × d) + (c × b)) / (b × d)',
        note: 'Samakan angka bawahnya dulu sebelum menambahkan angka atas.'
      },
      {
        name: 'Pecahan Istimewa & Persen',
        formula: '1/2 = 0,5 = 50%  |  1/4 = 0,25 = 25%  |  3/4 = 0,75 = 75%  |  1/5 = 0,2 = 20%',
        note: 'Sangat sering keluar di ujian sekolah dan kuis cepat!'
      }
    ],
    caseStudy: {
      title: 'Studi Kasus: Membagi Pizza Ulang Tahun',
      story: 'Dina membawa satu loyang pizza ke sekolah. Dina memakan 1/4 bagian pizza saat istirahat pertama, dan adiknya memakan 3/8 bagian pizza saat istirahat kedua.',
      problem: 'Berapa total bagian pizza yang sudah dimakan, dan berapa sisa pizza yang belum dimakan?',
      solutionSteps: [
        '1. Samakan penyebut 1/4 dan 3/8: 1/4 = 2/8.',
        '2. Total bagian dimakan = 2/8 + 3/8 = 5/8 bagian.',
        '3. Sisa pizza utuh = 1 - 5/8 = 8/8 - 5/8 = 3/8 bagian pizza.'
      ]
    },
    miniQuiz: {
      question: 'Berapakah hasil dari 2/5 + 1/2 jika disamakan penyebutnya?',
      options: ['3/7', '9/10', '7/10'],
      correctIndex: 1,
      explanation: 'KPK dari 5 dan 2 adalah 10. Ubah pecahan: 2/5 = 4/10 dan 1/2 = 5/10. Jadi 4/10 + 5/10 = 9/10.'
    },
    realWorldTips: [
      'Diskon Belanja: Diskon 50% artinya harga tinggal setengah (1/2), diskon 25% artinya dipotong seperempat (1/4).'
    ],
    sandboxType: 'fraction_basic'
  },
  {
    id: 'geometri-sudut-5',
    grade: 5,
    title: 'Geometri Sudut & Bangun Datar',
    subtitle: 'Identifikasi sudut, keliling dan luas persegi, segitiga & jajargenjang',
    badge: 'RUANG & BENTUK',
    color: '#70D6FF',
    iconName: 'Trophy',
    summary: 'Kenali sudut siku-siku di sekitarmu dan kuasai trik cepat menghitung keliling serta luas lapangan!',
    keyFormulas: [
      {
        name: 'Keliling & Luas Persegi Panjang',
        formula: 'K = 2 × (p + l)   |   Luas = p × l',
        note: 'Panjang (p) dan lebar (l) harus menggunakan satuan panjang yang sama.'
      },
      {
        name: 'Luas Segitiga',
        formula: 'Luas = (alas × tinggi) / 2',
        note: 'Garis tinggi harus selalu tegak lurus (90°) terhadap garis alas.'
      }
    ],
    caseStudy: {
      title: 'Studi Kasus: Membuat Pagar Kebun Sayur',
      story: 'Pak Ahmad memiliki kebun sayur berbentuk persegi panjang dengan panjang 12 meter dan lebar 8 meter. Pak Ahmad ingin memasang pagar kawat mengelilingi kebun tersebut.',
      problem: 'Berapa panjang kawat yang dibutuhkan untuk mengelilingi seluruh kebun tersebut satu putaran?',
      solutionSteps: [
        '1. Karena mengelilingi tepi, gunakan rumus Keliling Persegi Panjang.',
        '2. K = 2 × (panjang + lebar) = 2 × (12 + 8) = 2 × 20 = 40 meter kawat.'
      ]
    },
    miniQuiz: {
      question: 'Sebuah segitiga memiliki alas 10 cm dan tinggi 6 cm. Berapakah luas permukaan segitiga tersebut?',
      options: ['60 cm²', '30 cm²', '16 cm²'],
      correctIndex: 1,
      explanation: 'Luas segitiga = (alas × tinggi) / 2 = (10 × 6) / 2 = 60 / 2 = 30 cm².'
    },
    realWorldTips: [
      'Sudut Jam Dinding: Pukul 03.00 membentuk sudut siku-siku 90°, pukul 02.00 membentuk sudut lancip 60°, dan pukul 05.00 membentuk sudut tumpul 150°.'
    ],
    sandboxType: 'geometry_shape'
  },

  // ==========================================
  // KELAS 6 MODULES (4 MODUL LENGKAP)
  // ==========================================
  {
    id: 'pecahan-kali-bagi-6',
    grade: 6,
    title: 'Perkalian & Pembagian Pecahan',
    subtitle: 'Perkalian silang, pembagian pecahan terbalik, dan soal cerita terapan',
    badge: 'HITUNG CEPAT',
    color: '#FF70A6',
    iconName: 'Zap',
    summary: 'Di sini kamu bakal belajar trik cepat mengalikan dan membagi pecahan, biar gampang hitung porsi makanan atau resep kue!',
    keyFormulas: [
      {
        name: 'Perkalian Pecahan',
        formula: '(a/b) × (c/d) = (a × c) / (b × d)',
        note: 'Sederhanakan angka silang terlebih dahulu agar lebih mudah dihitung.'
      },
      {
        name: 'Pembagian Pecahan (Keep-Change-Flip)',
        formula: '(a/b) : (c/d) = (a/b) × (d/c) = (a × d) / (b × c)',
        note: 'Jangan membalik pecahan yang pertama, hanya pecahan kedua yang dibalik!'
      }
    ],
    caseStudy: {
      title: 'Studi Kasus: Menuang Sirup ke Dalam Gelas',
      story: 'Ibu memiliki 3/4 liter sirup melon kental. Ibu ingin menuangkannya ke dalam cangkir-cangkir kecil yang masing-masing berkapasitas 1/8 liter.',
      problem: 'Berapa banyak cangkir kecil yang dapat diisi penuh oleh sirup tersebut?',
      solutionSteps: [
        '1. Gunakan pembagian pecahan: 3/4 : 1/8.',
        '2. Terapkan Keep-Change-Flip: 3/4 × 8/1.',
        '3. Hitung perkalian: (3 × 8) / (4 × 1) = 24 / 4 = 6 cangkir.'
      ]
    },
    miniQuiz: {
      question: 'Berapakah hasil dari 2/3 dikalikan dengan 3/4?',
      options: ['6/12 atau 1/2', '5/7', '8/9'],
      correctIndex: 0,
      explanation: '(2 × 3) / (3 × 4) = 6/12. Disederhanakan masing-masing dibagi 6 menjadi 1/2.'
    },
    realWorldTips: [
      'Membuat Kue: Jika resep membutuhkan 1/2 kg tepung untuk 1 loyang, maka untuk membuat 1 1/2 loyang butuh (1/2) × (3/2) = 3/4 kg tepung.'
    ],
    sandboxType: 'fraction_advanced'
  },
  {
    id: 'rasio-skala-6',
    grade: 6,
    title: 'Rasio & Skala Peta',
    subtitle: 'Memahami rasio A:B, nilai bagian, dan konversi skala peta ke km',
    badge: 'SKALA & DENAH',
    color: '#FF9770',
    iconName: 'Sparkles',
    summary: 'Di sini kamu bakal belajar rahasia membaca jarak asli kota lewat peta dan cara adil membagi barang bareng teman!',
    keyFormulas: [
      {
        name: 'Nilai dari Rasio Total',
        formula: 'Nilai Bagian = (Rasio Ditanya / Total Rasio) × Jumlah Total',
        note: 'Gunakan penjumlahan rasio (A + B) jika yang diketahui adalah jumlah seluruhnya.'
      },
      {
        name: 'Rumus Skala Peta',
        formula: 'Jarak Sebenarnya = Jarak Peta × Nilai Skala',
        note: 'Ingat: 1 km = 1.000 meter = 100.000 cm.'
      }
    ],
    caseStudy: {
      title: 'Studi Kasus: Membaca Denah Lokasi Perkemahan',
      story: 'Pada peta perkemahan pramuka, jarak dari Pos Utama ke Pos Danau digambar sepanjang 4 cm. Skala peta tersebut tertulis 1 : 50.000.',
      problem: 'Berapa kilometer jarak sebenarnya yang harus ditempuh peserta dari Pos Utama menuju Pos Danau?',
      solutionSteps: [
        '1. Jarak Sebenarnya = Jarak Peta × Skala = 4 cm × 50.000 = 200.000 cm.',
        '2. Ubah centimeter ke kilometer: 200.000 cm : 100.000 = 2 km.'
      ]
    },
    miniQuiz: {
      question: 'Perbandingan kelereng Andi dan Budi adalah 2 : 3. Jika jumlah kelereng mereka berdua 25 butir, berapa butir kelereng Budi?',
      options: ['10 butir', '15 butir', '20 butir'],
      correctIndex: 1,
      explanation: 'Total bagian = 2 + 3 = 5. Kelereng Budi = (3 / 5) × 25 = 3 × 5 = 15 butir.'
    },
    realWorldTips: [
      'Campuran Sirup Manis: Rasio sirup : air = 1 : 4. Artinya untuk 1 gelas sirup butuh 4 gelas air agar rasanya pas.'
    ],
    sandboxType: 'ratio_scale'
  },
  {
    id: 'pola-bilangan-6',
    grade: 6,
    title: 'Pola Bilangan & Barisan',
    subtitle: 'Memprediksi suku berikutnya pada barisan aritmatika & geometri',
    badge: 'TEKA-TEKI ANGKA',
    color: '#C77DFF',
    iconName: 'Trophy',
    summary: 'Di sini kamu bakal belajar menebak kelanjutan susunan angka misterius dan menemukan rumus rahasianya!',
    keyFormulas: [
      {
        name: 'Barisan Aritmatika',
        formula: 'Un = a + (n - 1) × b',
        note: 'a = suku pertama, b = selisih/beda antar suku berturutan.'
      },
      {
        name: 'Pola Persegi (Kuadrat)',
        formula: '1, 4, 9, 16, 25, 36, 49, 64, 81, 100 (Un = n²)',
        note: 'Sering muncul dalam pola susunan titik atau korek api.'
      }
    ],
    caseStudy: {
      title: 'Studi Kasus: Susunan Kursi Ruang Pertunjukan',
      story: 'Di ruang aula sekolah, baris paling depan (baris ke-1) memiliki 8 kursi. Baris ke-2 memiliki 11 kursi, dan baris ke-3 memiliki 14 kursi.',
      problem: 'Jika pola penambahan kursi selalu teratur, berapa banyak kursi yang ada di baris ke-5?',
      solutionSteps: [
        '1. Cek selisih antar baris: 11 - 8 = 3 kursi, 14 - 11 = 3 kursi (Beda b = +3).',
        '2. Suku ke-4 = 14 + 3 = 17 kursi.',
        '3. Suku ke-5 = 17 + 3 = 20 kursi.'
      ]
    },
    miniQuiz: {
      question: 'Tentukan suku berikutnya dari barisan bilangan: 3, 7, 11, 15, ...',
      options: ['18', '19', '21'],
      correctIndex: 1,
      explanation: 'Pola selalu bertambah 4 tiap suku (3 + 4 = 7, 7 + 4 = 11, 11 + 4 = 15). Maka suku berikutnya adalah 15 + 4 = 19.'
    },
    realWorldTips: [
      'Lantai Ubin Motif: Pemasangan pola ubin catur 1x1, 2x2, 3x3 mengikuti pola bilangan kuadrat 1, 4, 9, 16 ubin.'
    ],
    sandboxType: 'pattern_sequence'
  },
  {
    id: 'bilangan-bulat-akar-6',
    grade: 6,
    title: 'Bilangan Bulat Negatif & Akar Pangkat 3',
    subtitle: 'Garis bilangan, operasi tanda plus-minus, dan volume kubus',
    badge: 'LEVEL LANJUT',
    color: '#FFE600',
    iconName: 'Zap',
    summary: 'Di sini kamu bakal belajar serunya garis bilangan es di bawah nol (minus-plus) dan cara gampang hitung volume kubus!',
    keyFormulas: [
      {
        name: 'Operasi Negatif',
        formula: 'a - (-b) = a + b   |   (-) × (-) = (+)   |   (+) × (-) = (-)',
        note: 'Contoh: 10 - (-5) = 10 + 5 = 15. (-4) × (-6) = +24.'
      },
      {
        name: 'Akar Pangkat Tiga',
        formula: 'Volume Kubus = s³   <=>   Rusuk s = ³√Volume',
        note: '³√1=1, ³√8=2, ³√27=3, ³√64=4, ³√125=5, ³√216=6, ³√343=7, ³√512=8, ³√729=9, ³√1000=10.'
      }
    ],
    caseStudy: {
      title: 'Studi Kasus: Perubahan Suhu Ruang Pendingin Buah',
      story: 'Sebuah gudang pendingin buah mula-mula bersuhu -4°C pada pagi hari. Karena pintu sering dibuka siang hari, suhu ruangan naik sebesar 9°C.',
      problem: 'Berapakah suhu ruangan pendingin buah tersebut sekarang?',
      solutionSteps: [
        '1. Suhu awal = -4°C.',
        '2. Suhu naik artinya ditambah (+9°C).',
        '3. Suhu sekarang = -4 + 9 = +5°C.'
      ]
    },
    miniQuiz: {
      question: 'Sebuah bak penampungan air berbentuk kubus memiliki volume 343 liter (dm³). Berapakah panjang rusuk bagian dalam bak tersebut?',
      options: ['6 dm', '7 dm', '8 dm'],
      correctIndex: 1,
      explanation: 'Panjang rusuk = ³√343 = 7 dm (karena 7 × 7 × 7 = 343).'
    },
    realWorldTips: [
      'Gedung Bertingkat: Lantai basement parkir di bawah tanah sering dilambangkan B1 (-1) dan B2 (-2).'
    ],
    sandboxType: 'negative_cube'
  }
];
