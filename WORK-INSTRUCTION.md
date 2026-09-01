# Factory Guest List - Work Instructions & Flow Process

## Overview

Aplikasi web untuk mengelola daftar tamu pabrik dengan fitur:
- **Login Authentication** - Akses admin wajib login terlebih dahulu
- **CRUD Operations** - Tambah, lihat, ubah status, hapus tamu
- **Status Management** - Active, On-Going, Reschedule, Cancel
- **Date Validation** - Tidak bisa buat agenda dari tanggal kemarin
- **Auto Status** - Status otomatis berdasarkan tanggal kunjungan
- **Auto Cleanup** - Tamu dengan tanggal lewat otomatis dihapus
- **Display Board** - Tampilan publik untuk lobby/resepsionis
- **Export/Import** - Backup dan restore data

---

## Setup & Instalasi

### Langkah 1: Download File
Download file ZIP aplikasi dari repository yang telah disediakan.

### Langkah 2: Ekstrak File
1. Buka **File Explorer** (Windows Explorer)
2. Navigasi ke **Drive D:** (`D:\`)
3. Klik kanan pada file ZIP yang sudah di-download
4. Pilih **"Extract All"** atau **"Ekstrak Semua"**
5. Pastikan lokasi ekstraksi adalah `D:\`
6. Klik **"Extract"**
7. Akan muncul folder baru bernama `factory-guest-list-main`

### Langkah 3: Jalankan Aplikasi
1. Buka folder `D:\factory-guest-list-main`
2. Klik ganda file `login.html`
3. Aplikasi akan terbuka di browser

### Langkah 4: Login
| Field | Nilai |
|-------|-------|
| **Username** | `admin` |
| **Password** | `admin123` |

---

## Flow Process

### 1. Login Flow

```
User → Klik "Admin" di navbar → login.html
                                      ↓
                               Sudah login? ──Ya──→ Redirect ke admin.html
                                      ↓
                                     Tidak
                                      ↓
                               Tampilkan form login
                                      ↓
                               Login berhasil → admin.html
                                      ↓
                               Login gagal → Tampilkan error
```

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

**Note:** Data login disimpan di localStorage. Session aktif selama browser terbuka.

---

### 2. Admin Dashboard Flow

```
Admin Login → Lihat Daftar Tamu → Pilih Aksi:
                                    ├── Tambah Tamu Baru
                                    ├── Ubah Status Tamu
                                    ├── Hapus Tamu
                                    ├── Export Data
                                    └── Import Data
```

---

### 3. Add Guest Flow

```
Klik "Tambah Tamu" → Isi Form:
                        ├── Nama Tamu (required)
                        ├── Tanggal Kunjungan (date picker, min: hari ini)
                        ├── Perusahaan (required)
                        └── Keperluan (required)
                              ↓
                        Submit → Validasi tanggal (tidak boleh kemarin)
                              → Status otomatis:
                              │   ├── Tanggal hari ini → "active"
                              │   └── Tanggal masa depan → "ongoing"
                              → Data disimpan ke localStorage
                              → Tabel otomatis update
                              → Notifikasi sukses
```

**Data Structure:**
```json
{
  "id": "guest_1234567890_abc123",
  "nama": "John Doe",
  "tanggal": "2025-09-01",
  "perusahaan": "PT Maju Jaya",
  "keperluan": "Meeting kerja sama",
  "status": "active",
  "createdAt": "2025-09-01T10:00:00.000Z"
}
```

**Date Rules:**
- Tidak bisa pilih tanggal kemarin (minDate: today)
- Tanggal hari ini → status "active"
- Tanggal masa depan → status "ongoing"

---

### 4. Status Management Flow

```
Pilih Tamu → Klik Status Button:
              ├── Active → Tamu akan datang
              ├── On-Going → Sedang meeting/berlangsung
              ├── Reschedule → Perlu dijadwalkan ulang
              └── Cancel → Dibatalkan
                    ↓
              Status update otomatis
              Badge warna berubah
              Notifikasi sukses
```

**Conditional Button Rules:**
| Kondisi | Tombol Disabled | Tombol Aktif |
|---------|-----------------|--------------|
| Status = "active" | Active | On-Going, Reschedule, Cancel |
| Tanggal = hari ini | Active, On-Going | Reschedule, Cancel |
| Status = "ongoing" | On-Going | Active, Reschedule, Cancel |
| Status = "reschedule" | Reschedule | Active, On-Going, Cancel |
| Status = "cancel" | Cancel | Active, On-Going, Reschedule |

**Status Colors:**
| Status | Warna | Kode |
|--------|-------|------|
| Active | Hijau | #006B3F |
| On-Going | Orange | #F5A623 |
| Reschedule | Kuning | #C4D600 |
| Cancel | Teal | #4ECDC4 |

---

### 5. Display Board Flow

```
Buka display.html → Data tamu otomatis load:
                      ├── Tamu tanggal lewat otomatis dihapus
                      ├── Diurutkan berdasarkan tanggal kunjungan
                      │   ├── Hari ini (paling atas)
                      │   └── Tanggal dekat (ascending)
                      ├── Status tulisan bold berwarna (tanpa kotak)
                      └── Auto-refresh setiap 30 detik
```

**Sort Order:**
1. **Today** - Tamu hari ini (paling atas)
2. **Future** - Tanggal depan (ascending)
3. **Tiebreaker** - Jika tanggal sama, urutkan berdasarkan waktu dibuat (terbaru duluan)

**Auto Cleanup:**
- Tamu dengan tanggal kunjungan sebelum hari ini otomatis dihapus
- Berlaku saat page load dan auto-refresh (setiap 30 detik)

---

### 6. Export/Import Flow

**Export:**
```
Klik "Export" → File JSON didownload
                ├── Filename: daftar-tamu-YYYY-MM-DD.json
                └── Berisi semua data tamu
```

**Import:**
```
Klik "Import" → Pilih file JSON → Data di merge dengan existing
                                  ├── ID yang sama → skip (tidak duplikat)
                                  └── ID baru → ditambahkan
```

---

## Page Structure

### 1. login.html
- Form login (username + password)
- Favicon logo GGF
- Redirect ke admin.html jika berhasil

### 2. admin.html
- Navigasi (menu Admin & Display)
- Favicon logo GGF
- Form tambah tamu dengan Flatpickr date picker
- Tabel daftar tamu dengan aksi:
  - Status buttons (4 warna) - conditional disabling
  - Hapus button (selalu aktif)
- Export/Import buttons
- Auto-delete tamu tanggal lewat saat page load

### 3. display.html
- Navigasi (menu Admin & Display)
- Favicon logo GGF
- Logo GGF di atas tengah
- Tampilan board tamu
- Diurutkan berdasarkan tanggal
- Status tulisan bold berwarna (tanpa kotak)
- Auto-delete tamu tanggal lewat
- Auto-refresh setiap 30 detik

---

## Technical Architecture

### Storage
- **localStorage** - Semua data tersimpan di browser
- **Key:** `daftar_tamu_factory` - Data tamu
- **Key:** `daftar_tamu_auth` - Status login

### CSS Variables (Theme)
```css
:root {
  --primary-color: #006B3F;    /* Hijau GGF */
  --accent-orange: #F5A623;    /* Orange GGF */
  --accent-yellow: #C4D600;    /* Kuning GGF */
  --accent-teal: #4ECDC4;      /* Teal GGF */
}
```

### Libraries
- **Flatpickr** - Date picker (CDN)
- **Vitest** - Unit testing

### Key Functions (js/app.js)
| Fungsi | Deskripsi |
|--------|-----------|
| `getTodayStr()` | Mengambil tanggal hari ini (local timezone) |
| `cleanPastGuests()` | Hapus tamu dengan tanggal lewat |
| `addGuest()` | Tambah tamu baru dengan status otomatis |
| `getGuests()` | Ambil semua data tamu |
| `saveGuests()` | Simpan data tamu ke localStorage |
| `sortGuestsByDate()` | Urutkan tamu berdasarkan tanggal |
| `createGuestRow()` | Buat baris tabel untuk tamu |

---

## Testing

### Run Tests
```bash
npx vitest run
```

### Test Coverage
| Test File | Tests | Deskripsi |
|-----------|-------|-----------|
| style.test.js | 27 | CSS theme & status badges |
| nav.test.js | 10 | Navigation bar |
| status.test.js | 28 | Status flow, conditional buttons, auto cleanup |
| sort.test.js | 13 | Date sorting |
| datepicker.test.js | 13 | Flatpickr integration & minDate |
| **Total** | **94** | |

---

## Git Workflow

### Commit Convention
```
feat(scope): description
fix(scope): description
docs(scope): description
```

### Scopes
- `theme` - CSS & warna
- `nav` - Navigasi
- `status` - Status flow
- `sort` - Sorting
- `datepicker` - Date picker
- `cleanup` - Auto cleanup
- `ui` - UI/UX umum

---

## Troubleshooting

### Data Tidak Muncul
1. Buka browser DevTools (F12)
2. Check localStorage:
   ```
   localStorage.getItem('daftar_tamu_factory')
   ```
3. Jika null, data belum ada atau sudah di-clear

### Login Gagal
1. Gunakan default credentials:
   - Username: `admin`
   - Password: `admin123`
2. Clear localStorage jika session expired:
   - DevTools (F12) → Application → Local Storage
   - Hapus key `daftar_tamu_auth`
   - Refresh halaman

### Display Board Tidak Update
1. Refresh halaman (F5)
2. Check koneksi internet (untuk load Flatpickr CDN)
3. Pastikan browser dalam mode normal (bukan incognito)

### Date Picker Tidak Muncul
1. Pastikan koneksi internet aktif (Flatpickr dimuat dari CDN)
2. Refresh halaman

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-08-31 | Initial release with GGF theme |
| 1.1.0 | 2025-08-31 | Added navigation, status flow, sorting |
| 1.2.0 | 2025-08-31 | Fixed date picker with Flatpickr |
| 1.3.0 | 2025-09-01 | UI rebalance, date validation, auto status, conditional buttons, admin auth, auto cleanup, favicon |

---

**Dokumentasi ini diperbarui terakhir pada: 1 September 2025**
