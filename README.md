# 🎮 MathMotion Arcade

> **Platform Media Pembelajaran Matematika Kinetik Tanpa Sentuhan Fisik (Touchless Gesture AI)** berbasis Web Camera untuk Siswa SD (Kelas 5 & 6) dengan estetika Neo-Brutalism, MediaPipe Hands & FaceMesh, serta Web Audio API Synth.

---

## 🚀 Fitur Utama

### 1. Tema Desain Neo-Brutalism & Retro Dot Grid
- Tekstur retro dot grid murni CSS dengan latar `#FFFDF0`.
- Border hitam tebal (`border-4 border-black`), hard drop shadows (`shadow-[6px_6px_0px_#000]`), dan efek tombol mekanik.
- Palet cerah Neo-Brutalist: Kuning `#FFE600`, Pink `#FF70A6`, Mint/Teal `#00F5D4`, Biru Langit `#70D6FF`, Oranye `#FF9770`.

### 2. Landing Page & Modul Materi Interaktif (Ala Dicoding / IBM SkillsBuild)
- **Form Identitas Siswa:** Input nama siswa & tab pilihan tingkat kelas (Kelas 5 & 6) dengan tombol mulai tervalidasi.
- **Tutorial Gesture Interaktif:** Kartu panduan visual kursor jari telunjuk, pinch/dwell, dan geleng kepala.
- **Modul Belajar & Live Sandbox Playgrounds:**
  - **Kelas 5:** KPK & FPB (Pohon faktor & Live Story Simulator), Operasi Pecahan & Desimal (Visual Bar Slicer), Geometri & Sudut Bangun Datar.
  - **Kelas 6:** Operasi Pecahan Kali & Bagi (Step-by-step Resolver), Rasio & Perbandingan (Live Scale Balancer), Pola Bilangan (Sequence Predictor), Bilangan Bulat Negatif & Akar Pangkat 3 (Interactive Number Line).

### 3. Playing Arena (20 Soal Teracak)
- **15 Soal Pilihan Ganda (Tangan):** Kursor neon mengikuti ujung jari telunjuk, pemilihan jawaban lewat **Cubit (Pinch Jempol+Telunjuk)** atau **Tahan Kursor (Dwell 1.2 detik)**, plus fallback klik mouse manual.
- **5 Soal True / False (Kepala):** Deteksi yaw kepala: **Geleng Kiri = Salah / Tidak**, **Geleng Kanan = Benar / Ya**.
- **Dynamic Feedback & Review Tenang:** Efek glow layar (Hijau jika benar, Merah jika salah) + Kotak penjelasan statis (tidak goyang/bounce) + Tombol manual "Lanjut ke Soal Berikutnya" yang bisa diklik atau dicubit.
- **Synthesizer Retro Internal:** Web Audio API sound effects (Pop, Pinch, Correct arpeggio, Wrong buzzer, Streak flourish, Fanfare).

### 4. Result Page & Pembahasan Komprehensif
- Sambutan personal dengan nama siswa.
- Kartu ringkasan performa: Skor akhir, Akurasi (%), Jumlah benar/salah, Bintang prestasi (1–5) & Predikat.
- Accordion pembahasan lengkap 20 soal dengan filter (Semua / Salah / Benar).
- Tombol "Main Ulang Kelas Ini" (acak 20 soal baru) dan "Kembali ke Beranda".

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS v4 + Pure CSS Retro Dot Grid Texture
- **Vision AI:** Google MediaPipe (`@mediapipe/hands`, `@mediapipe/face_mesh`, `@mediapipe/camera_utils` loaded dynamically via CDN)
- **Audio:** Web Audio API Native Synthesizer
- **Visual Effects:** Canvas Confetti & Lucide React Icons

---

## 💻 Cara Menjalankan

```bash
# Install dependensi
npm install

# Jalankan server lokal
npm run dev

# Buka http://localhost:3000 di browser Chrome/Edge/Firefox
```
