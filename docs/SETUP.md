# Panduan Setup - Factory Guest List 🏭

Panduan ini menjelaskan cara menginstal dan menjalankan aplikasi Factory Guest List secara sederhana.

---

## Langkah 1: Download File

Download file ZIP aplikasi dari repository yang telah disediakan.

---

## Langkah 2: Ekstrak File

1. Buka **File Explorer** (Windows Explorer)
2. Navigasi ke **Drive D:** (`D:\`)
3. Klik kanan pada file ZIP yang sudah di-download
4. Pilih **"Extract All"** atau **"Ekstrak Semua"**
5. Pastikan lokasi ekstraksi adalah `D:\`
6. Klik **"Extract"**
7. Akan muncul folder baru bernama `factory-guest-list-main`

---

## Langkah 3: Jalankan Aplikasi

1. Buka folder `D:\factory-guest-list-main`
2. Klik ganda file `login.html`
3. Aplikasi akan terbuka di browser

---

## Langkah 4: Login

Gunakan kredensial berikut untuk masuk ke halaman admin:

| Field | Nilai |
|-------|-------|
| **Username** | `admin` |
| **Password** | `admin123` |

Setelah login berhasil, Anda akan diarahkan ke halaman admin untuk mengelola daftar tamu.

---

## Struktur Folder

Setelah diekstrak, pastikan struktur folder seperti berikut:

```
D:\factory-guest-list-main\
├── login.html      ← Halaman login (mulai dari sini)
├── admin.html      ← Halaman admin (kelola tamu)
├── display.html    ← Tampilan board tamu
├── css/
│   └── style.css
├── js/
│   └── app.js
└── img/
    └── GGF.png     ← Logo perusahaan
```

---

## Catatan Penting

- **Browser yang direkomendasikan:** Google Chrome, Mozilla Firefox, atau Microsoft Edge
- **Data tersimpan lokal:** Semua data tamu disimpan di browser (localStorage), bukan di server
- **Tidak perlu koneksi internet:** Aplikasi dapat berjalan sepenuhnya offline setelah file ter-download
- **Backup data:** Gunakan fitur Export/Import di halaman admin untuk membackup data

---

## Troubleshooting

### Masalah: Halaman kosong atau tidak bisa diakses

**Solusi:** Pastikan Anda membuka file `login.html`, bukan file lain.

---

### Masalah: Data tamu hilang setelah tutup browser

**Penyebab:** Browser dalam mode incognito/private.

**Solusi:** Gunakan browser dalam mode normal (bukan incognito).

---

### Masalah: Login selalu gagal

**Solusi:**
1. Pastikan menggunakan kredensial yang benar: `admin` / `admin123`
2. Buka Developer Tools (F12) → Application → Local Storage
3. Hapus key `daftar_tamu_auth`
4. Refresh halaman dan coba login lagi

---

## Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Kelola Tamu** | Tambah, lihat, ubah status, hapus data tamu |
| **Status Tamu** | Active, On-Going, Reschedule, Cancel |
| **Validasi Tanggal** | Tidak bisa membuat agenda dari tanggal kemarin |
| **Status Otomatis** | Status otomatis berdasarkan tanggal kunjungan |
| **Auto Cleanup** | Tamu dengan tanggal lewat otomatis dihapus |
| **Display Board** | Tampilan publik untuk lobby/resepsionis |
| **Export/Import** | Backup dan restore data dalam format JSON |

---

**Dokumentasi ini diperbarui terakhir pada: 1 September 2025**
