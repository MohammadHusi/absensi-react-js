# Panduan Deployment SIAM - SMK Mawaddah Palengaan
**Sistem Informasi Absensi Sekolah (SIAM) berbasis Google Apps Script & Google Sheets**

---

## 📁 Berkas yang Tersedia
1. **`Code.gs`**: Kode backend Google Apps Script yang mengelola database Google Sheets, API routing (`doGet` / `doPost`), enkripsi password SHA-256, session token, serta operasi atomic batch dengan `LockService`.
2. **`Index.html`**: Antarmuka Frontend Single Page Application (SPA) modern yang dibangun menggunakan **Tailwind CSS**, **SweetAlert2**, dan Vanilla JS dengan skema warna hijau zamrud/toska khas institusi pendidikan.

---

## 🚀 Langkah Demi Langkah Deployment

### 1. Buat Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet, misalnya: **`Database SIAM - SMK Mawaddah Palengaan`**.

### 2. Buka Editor Google Apps Script
1. Di dalam Google Spreadsheet tersebut, klik menu **Extensions (Ekstensi)** > **Apps Script**.
2. Beri nama proyek Apps Script: **`SIAM-Backend`**.

### 3. Masukkan Kode `Code.gs` dan `Index.html`
1. Pada file bawaan `Code.gs`, hapus kode default, lalu salin seluruh isi berkus `Code.gs` yang ada di repositori ini.
2. Tambahkan berkas HTML:
   - Klik tombol **+** di panel sebelah kiri > pilih **HTML**.
   - Beri nama persis: **`Index`** (Apps Script otomatis menambahkan ekstensi `.html`).
   - Salin seluruh isi berkas `Index.html` ke dalamnya.

### 4. Inisialisasi Database (Setup Otomatis)
Anda dapat melakukan setup otomatis dengan dua cara:
- **Cara 1 (Langsung dari Editor Script):**
  1. Pada dropdown fungsi di toolbar atas editor Apps Script, pilih fungsi **`setupDatabase`**.
  2. Klik tombol **Run (Jalankan)**.
  3. Google akan meminta otorisasi izin pertama kali:
     - Klik **Review Permissions** > Pilih akun Google Anda.
     - Klik **Advanced** (Lanjutan) > Klik **Go to SIAM-Backend (unsafe)**.
     - Klik **Allow (Izinkan)**.
  4. Tab `Users`, `Classes`, `Students`, `Teachers`, dan `Attendance` otomatis terbuat rapi lengkap dengan data contoh.
- **Cara 2 (Dari Web App):**
  Cukup klik tombol **"⚙️ Reset / Inisialisasi Database Spreadsheet"** yang tersedia di halaman login web app.

---

### 5. Deploy sebagai Web App
1. Klik tombol biru **Deploy** di pojok kanan atas > Pilih **New deployment (Penerapan baru)**.
2. Klik ikon gerigi (⚙️) di samping *Select type* > Pilih **Web app**.
3. Isi konfigurasi sebagai berikut:
   - **Description**: `SIAM Versi 1.0 Production`
   - **Execute as (Jalankan sebagai)**: **`Me (emailanda@gmail.com)`** *(Sangat penting agar pengguna dapat membaca/menulis sheet tanpa perlu akun Google individu)*.
   - **Who has access (Siapa yang memiliki akses)**: **`Anyone (Siapa saja)`**.
4. Klik **Deploy**.
5. Salin tautan **Web App URL** yang diberikan (format: `https://script.google.com/macros/s/.../exec`).
6. Buka tautan tersebut di browser atau bagikan ke guru dan murid!

---

## 🔑 Kredensial Akun Bawaan (Default Seed Data)

| Peran (Role) | Username / NISN | Kata Sandi | Keterangan |
|---|---|---|---|
| **Administrator** | `admin` | `admin123` | Akses penuh dashboard, Master Data Siswa/Guru/Kelas, dan Rekapitulasi CSV. |
| **Guru Pengajar** | `guru.ahmad` | `guru123` | Akses checklist presensi per rombel kelas, tombol *Set Semua Hadir*, dan riwayat hari ini. |
| **Siswa / Murid** | `0061234567` | `murid123` | Akses statistik kehadiran pribadi, riwayat absensi bulanan, dan formulir izin/sakit mandiri. |

---

## 🛠️ Fitur & Keunggulan Arsitektur
1. **Atomic Batch Saving (`LockService`):**
   Mencegah race condition ketika banyak guru melakukan absensi secara simultan di jam yang sama.
2. **Efisiensi Batch `getValues()` / `setValues()`:**
   Menghindari quota timeout Google Apps Script dengan membaca dan menulis data sheet dalam satu transaksi array.
3. **Password Hashing SHA-256 + Salt:**
   Kata sandi tidak disimpan dalam bentuk teks polos (*plain-text*) di Google Sheets.
4. **Mobile-First Responsive:**
   Dirancang nyaman digunakan guru lewat smartphone saat berkeliling di ruang kelas.
