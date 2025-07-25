<p align="center">
  <img src="public/Logo.png" alt="Kardiologiku Logo" width="170"/>
</p>

<h1 align="center">Kardiologiku: Platform Kesehatan Jantung Digital</h1>

<p align="center">
  <strong>Sebuah landing page aplikasi web yang dirancang sebagai pusat komando kesehatan jantung Anda, dengan spesialisasi pada edukasi, deteksi dini risiko, dan manajemen Aritmia (gangguan irama jantung).</strong>
</p>

<p align="center">
  <a href="#-tentang-proyek">Tentang Proyek</a> •
  <a href="#-manfaat-utama">Manfaat</a> •
  <a href="#-fitur-unggulan">Fitur Unggulan</a> •
  <a href="#-teknologi-yang-digunakan">Teknologi</a> •
  <a href="#-memulai">Memulai</a> •
  <a href="#-berkontribusi">Berkontribusi</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white" alt="React version"/>
  <img src="https://img.shields.io/badge/Vite-7.0.0-646CFF?logo=vite&logoColor=white" alt="Vite version"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript version"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.11-06B6D4?logo=tailwind-css&logoColor=white" alt="Tailwind CSS version"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"/>
</p>

---

## 📖 Tentang Proyek

**Kardiologiku** lahir dari kebutuhan akan platform yang terintegrasi dan mudah diakses untuk meningkatkan kesadaran serta manajemen kesehatan jantung, khususnya aritmia. Proyek ini bukan sekadar halaman informasi statis, melainkan sebuah pengalaman interaktif yang memberdayakan pengguna. Kami bertujuan untuk menjembatani kesenjangan antara informasi medis yang kompleks dengan pemahaman awam, menyediakan alat praktis untuk manajemen gaya hidup, dan mempermudah akses ke tenaga medis profesional.

Landing page ini berfungsi sebagai gerbang utama menuju ekosistem digital **Kardiologiku**, menampilkan visi dan kapabilitas aplikasi secara menyeluruh dalam antarmuka yang modern, responsif, dan ramah pengguna.

## ❤️ Manfaat Utama

Menggunakan platform Kardiologiku memberikan berbagai keuntungan signifikan bagi pengguna, baik yang sudah didiagnosis dengan kondisi jantung maupun yang proaktif menjaga kesehatan:

- **Peningkatan Literasi Kesehatan**: Mengubah topik medis yang rumit (seperti membaca EKG) menjadi konten edukatif yang mudah dicerna, memungkinkan pengguna untuk lebih memahami kondisi mereka dan berpartisipasi aktif dalam perawatan.
- **Deteksi & Pencegahan Dini**: Melalui fitur seperti Kalkulator Risiko Jantung, pengguna dapat mengidentifikasi potensi masalah kesehatan sejak dini, mendorong tindakan preventif sebelum kondisi menjadi serius.
- **Manajemen Gaya Hidup Terstruktur**: Alat seperti Jurnal Makanan dan Pengingat Obat membantu pengguna membangun rutinitas sehat yang teratur dan disiplin, yang merupakan kunci utama dalam mengelola penyakit jantung kronis.
- **Kepatuhan Pengobatan yang Lebih Baik**: Dengan sistem pengingat obat yang cerdas, risiko melewatkan dosis penting dapat diminimalkan, sehingga efektivitas terapi dapat terjaga secara optimal.
- **Akses Terpercaya ke Profesional**: Memudahkan pengguna untuk menemukan dan terhubung dengan dokter spesialis jantung yang terverifikasi, membangun jembatan kepercayaan antara pasien dan penyedia layanan kesehatan.

## ✨ Fitur Unggulan

Setiap fitur dirancang secara detail untuk memberikan nilai fungsional dan edukatif yang maksimal.

#### 1. **Pusat Edukasi Aritmia Interaktif**

- **Deskripsi**: Fitur ini menyajikan visualisasi grafis dari berbagai jenis irama jantung, mulai dari irama sinus normal hingga berbagai tipe aritmia seperti Atrial Fibrilasi. Pengguna dapat beralih antar tab untuk melihat dan membandingkan pola EKG secara langsung.
- **Manfaat**: Mendemistifikasi hasil EKG dan membantu pengguna mengenali seperti apa "irama jantung tidak normal" itu. Ini adalah langkah pertama untuk pemberdayaan pasien.
- **Komponen Terkait**: `TentangAritmiaSection.tsx`, `InteractiveEducationSection.tsx`

#### 2. **Kalkulator Risiko Jantung Personal**

- **Deskripsi**: Sebuah alat diagnostik awal berbasis formulir yang mengumpulkan data penting seperti usia, jenis kelamin, kadar kolesterol, tekanan darah, riwayat merokok, dan diabetes. Berdasarkan input, kalkulator akan memberikan skor persentase risiko penyakit jantung.
- **Manfaat**: Memberikan gambaran kuantitatif dan personal tentang risiko kesehatan jantung, berfungsi sebagai peringatan dini dan motivator kuat untuk perubahan gaya hidup.
- **Komponen Terkait**: `HeartRiskCalculator.tsx`

#### 3. **Manajemen Gaya Hidup Terpadu**

- **Jurnal Makanan Cerdas**: Pengguna dapat mencatat asupan makanan harian. Aplikasi dirancang untuk memberikan analisis nutrisi, membantu pengguna memantau asupan kalori, natrium, dan lemak.
- **Pengingat Obat Cerdas**: Sistem untuk menjadwalkan, melacak, dan mengelola konsumsi obat. Fitur ini mencakup nama obat, dosis, jadwal minum, dan notifikasi untuk pengisian ulang stok.
- **Manfaat**: Mengintegrasikan dua pilar utama manajemen penyakit jantung—diet dan pengobatan—dalam satu dasbor yang mudah diakses, meningkatkan kedisiplinan dan hasil terapi.
- **Komponen Terkait**: `FoodJournalSection.tsx`, `PengingatObatSection.tsx`

#### 4. **Direktori Dokter & Panduan Terapi**

- **Profil Dokter Kami**: Menampilkan daftar dokter spesialis jantung dan pembuluh darah, lengkap dengan foto, nama, dan spesialisasi. Memudahkan pengguna untuk mengenal para ahli di baliknya.
- **Informasi Obat & Terapi**: Sebuah basis data pengetahuan yang menjelaskan berbagai pilihan pengobatan untuk aritmia, dari medikamentosa hingga prosedur medis, disajikan dalam format akordeon yang rapi.
- **Manfaat**: Memberikan transparansi dan informasi yang dibutuhkan pasien untuk membuat keputusan yang tepat mengenai perawatan mereka dan memilih dokter yang paling sesuai.
- **Komponen Terkait**: `DokterKamiSection.tsx`, `ObatTerapiSection.tsx`

#### 5. **Antarmuka Pengguna Modern & Responsif**

- **Deskripsi**: Dibangun dengan _best practices_ UI/UX, menampilkan _bento grid layout_ yang elegan, animasi yang halus dengan Framer Motion, dan komponen yang konsisten. Tampilan dioptimalkan untuk semua ukuran layar, dari desktop besar hingga ponsel.
- **Manfaat**: Memberikan pengalaman pengguna yang menyenangkan, profesional, dan bebas hambatan, yang meningkatkan kepercayaan dan keterlibatan pengguna pada platform.
- **Komponen Terkait**: `WebAppShowcaseSection.tsx`, `magicui/bento-grid.tsx`, `App.tsx`

## 🛠️ Teknologi yang Digunakan

Arsitektur proyek ini didasarkan pada tumpukan teknologi modern yang memastikan skalabilitas, kinerja tinggi, dan kemudahan pengembangan.

- **Core Framework**: React.js
- **Build System**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Komponen UI**: Dibuat khusus, terinspirasi oleh shadcn/ui (termasuk `Button`, `Card`, `Dialog`, `Input`, `Accordion`, dll.)
- **Animasi & Interaksi**: Framer Motion
- **Visualisasi Data**: Recharts
- **Ikonografi**: Lucide React
- **Code Quality**: ESLint

## 🚀 Memulai

Ikuti langkah-langkah ini untuk menjalankan salinan lokal dari proyek ini.

### Prasyarat

Pastikan Anda telah menginstal versi terbaru dari Node.js dan manajer paket pilihan Anda (npm, yarn, atau pnpm).

- Instal/Update npm:
  ```sh
  npm install npm@latest -g
  ```

### Panduan Instalasi

1.  **Clone Repositori**
    ```sh
    git clone [https://github.com/ALVINfrs/kardiologiku-landing-page.git](https://github.com/ALVINfrs/kardiologiku-landing-page.git)
    ```
2.  **Navigasi ke Direktori Proyek**
    ```sh
    cd kardiologiku-landing-page
    ```
3.  **Instal Seluruh Dependensi Proyek**
    ```sh
    npm install
    ```

### Menjalankan Server Pengembangan

Setelah instalasi berhasil, jalankan perintah berikut untuk memulai server lokal:

```sh
npm run dev
```

Aplikasi akan tersedia di http://localhost:5173 atau port lain yang ditampilkan di terminal Anda. Server ini mendukung Hot Module Replacement (HMR) untuk pengalaman pengembangan yang cepat.

🤝 Berkontribusi
Kontribusi Anda adalah detak jantung dari ekosistem open source. Kami sangat menyambut segala bentuk kontribusi yang dapat membuat proyek ini lebih baik.

Jika Anda memiliki ide untuk perbaikan, fitur baru, atau perbaikan bug:

Fork repositori ini.

Buat Branch baru untuk fitur Anda (git checkout -b fitur/NamaFiturBaru).

Commit perubahan yang telah Anda buat (git commit -m 'feat: Menambahkan NamaFiturBaru').

Push ke branch tersebut (git push origin fitur/NamaFiturBaru).

Buka sebuah Pull Request dan jelaskan perubahan Anda secara detail.

Jangan ragu untuk membuka Issue jika Anda menemukan masalah atau memiliki pertanyaan. Dan jangan lupa berikan ⭐ jika proyek ini bermanfaat bagi Anda!

📜 Lisensi
Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file LICENSE untuk detail lengkapnya.

📞 Kontak
Alvin Faris - LinkedIn - alvinfaris59@gmail.com

Tautan Repositori: https://github.com/ALVINfrs/kardiologiku-landing-page
