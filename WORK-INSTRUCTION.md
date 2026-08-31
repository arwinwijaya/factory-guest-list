# Factory Guest List - Work Instructions & Flow Process

## Overview

Aplikasi web untuk mengelola daftar tamu pabrik dengan fitur:
- **Login Authentication** - Akses admin terbatas
- **CRUD Operations** - Tambah, lihat, ubah status, hapus tamu
- **Status Management** - Active, On-Going, Reschedule, Cancel
- **Date Sorting** - Urutan berdasarkan tanggal kunjungan
- **Display Board** - Tampilan publik untuk lobby/resepsionis
- **Export/Import** - Backup dan restore data

---

## Flow Process

### 1. Login Flow

```
User → Buka login.html → Masukkan credentials → Login → Redirect ke admin.html
                                                      ↓
                                                Jika gagal → Tampilkan error
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
                        ├── Tanggal Kunjungan (date picker)
                        ├── Perusahaan (required)
                        └── Keperluan (required)
                              ↓
                        Submit → Data disimpan ke localStorage
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
                      ├── Diurutkan berdasarkan tanggal kunjungan
                      │   ├── Hari ini (paling atas)
                      │   ├── Tanggal dekat (ascending)
                      │   └── Tanggal lalu (descending)
                      ├── Badge status berwarna
                      └── Auto-refresh (manual refresh)
```

**Sort Order:**
1. **Today** - Tamu hari ini (paling atas)
2. **Future** - Tanggal depan (ascending)
3. **Past** - Tanggal lalu (descending)
4. **Tiebreaker** - Jika tanggal sama, urutkan berdasarkan waktu dibuat (terbaru duluan)

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
- Redirect ke admin.html jika berhasil

### 2. admin.html
- Navigasi (logo + menu)
- Form tambah tamu
- Tabel daftar tamu dengan aksi:
  - Status buttons (4 warna)
  - Hapus button
- Export/Import buttons

### 3. display.html
- Navigasi (logo + menu)
- Tampilan board tamu
- Diurutkan berdasarkan tanggal
- Badge status berwarna

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

---

## Testing

### Run Tests
```bash
npx vitest run
```

### Test Files
- `tests/js/style.test.js` - CSS theme tests
- `tests/js/nav.test.js` - Navigation tests
- `tests/js/status.test.js` - Status flow tests
- `tests/js/sort.test.js` - Sorting tests
- `tests/js/datepicker.test.js` - Date picker tests

---

## Git Workflow

### Commit Convention
```
feat(scope): description
fix(scope): description
```

### Recent Commits
- `feat(theme)` - CSS theme rebranding
- `feat(nav)` - Navigation bar
- `feat(status)` - Status flow
- `feat(sort)` - Date sorting
- `fix(datepicker)` - Flatpickr integration

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
2. Clear localStorage jika session expired

### Display Board Tidak Update
1. Refresh halaman (F5)
2. Check koneksi internet (untuk load Flatpickr CDN)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-08-31 | Initial release with GGF theme |
| 1.1.0 | 2025-08-31 | Added navigation, status flow, sorting |
| 1.2.0 | 2025-08-31 | Fixed date picker with Flatpickr |
