# Changelog - Factory Guest List

Semua perubahan penting pada aplikasi Factory Guest List akan didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.3.0] - 2025-09-01

### Added
- **Date Validation** (`feat(datepicker)`)
  - Flatpickr `minDate: 'today'` — tidak bisa pilih tanggal kemarin
  - 1 test baru untuk minDate

- **Auto Status Assignment** (`feat(status)`)
  - Status otomatis berdasarkan tanggal kunjungan
  - Tanggal hari ini → status "active"
  - Tanggal masa depan → status "ongoing"
  - 2 test baru untuk status berdasarkan tanggal

- **Conditional Status Buttons** (`feat(status)`)
  - Tombol status di-disable berdasarkan kondisi:
    - Status "active" → tombol Active disabled
    - Tanggal hari ini → tombol Active & On-Going disabled
    - Status "ongoing" → tombol On-Going disabled
    - Status "reschedule" → tombol Reschedule disabled
    - Status "cancel" → tombol Cancel disabled
  - Tombol Hapus tetap aktif
  - 2 test baru untuk conditional disabling

- **Admin Auth Required** (`feat(nav)`)
  - Link Admin di navbar mengarah ke login.html
  - Wajib login sebelum akses halaman admin
  - Jika sudah login, otomatis redirect ke admin.html

### Changed
- **UI Color Rebalance** (`feat(theme)`)
  - Kuning tidak lagi dominan — hanya untuk aksen kecil
  - Tombol, heading, border, focus state menggunakan hijau primary
  - Logo dipindah dari navbar ke atas tengah halaman Display
  - Navbar hanya tampilkan "Admin" dan "Display" (Login link dihapus)
  - Nav links di-align ke pojok kanan

- **Status Badge Simplification** (`fix(theme)`)
  - Hapus kotak/badge dari status (background, border, padding)
  - Status sekarang hanya tulisan bold berwarna
  - Berlaku di tabel Admin dan Display

- **Notification Color Fix** (`fix(theme)`)
  - Fix `--accent-green` (tidak ada) → `--primary-color`

### Fixed
- Warna kuning terlalu dominan di UI
- Notifikasi menggunakan variable yang tidak ada

---

## [1.2.0] - 2025-08-31

### Added
- **Sort by Visit Date** (`feat(sort)`)
  - Implementasi `sortGuestsByDate()` function
  - Urutan: hari ini pertama → masa depan ascending → masa lalu descending
  - Tiebreaker berdasarkan waktu pembuatan (terbaru duluan)
  - 13 unit tests untuk sorting

- **Date Picker Fix** (`fix(datepicker)`)
  - Integrasi Flatpickr library dari CDN
  - Mengganti native `<input type="date">` yang tidak reliable
  - Theme Flatpickr dengan warna GGF
  - 12 unit tests untuk date picker

### Fixed
- Date picker popup tidak muncul di Firefox
- Flatpickr initialization pada form reset

### Changed
- Date input type dari `date` ke `text` dengan `readonly`
- Flatpickr CDN links ditambahkan ke `<head>`

---

## [1.1.0] - 2025-08-31

### Added
- **Status Flow** (`feat(status)`)
  - Status baru: Active, On-Going, Reschedule, Cancel
  - 4 tombol status terpisah (bukan cycle button)
  - Free transition antar status (bebas pindah ke mana saja)
  - Default status untuk tamu baru: `active`
  - 21 unit tests untuk status flow

- **Navigation Bar** (`feat(nav)`)
  - Responsive navbar di semua halaman
  - Logo GGF di navbar
  - Active state untuk halaman saat ini
  - Hamburger menu untuk mobile (< 768px)
  - 10 unit tests untuk navigasi

### Changed
- Status values dari `menunggu/meeting/selesai` ke `active/ongoing/reschedule/cancel`
- Admin table sekarang menampilkan 4 tombol status
- Display board menggunakan status classes baru

### Removed
- `getNextStatus()` cycle function
- `toggleStatus()` cycle handler
- Status values: `menunggu`, `meeting`, `selesai`

### Fixed
- Responsive CSS scoping untuk navbar elements
- Media query selectors sekarang properly scoped

---

## [1.0.0] - 2025-08-31

### Added
- **CSS Theme Rebranding** (`feat(theme)`)
  - Warna GGF: Hijau (`#006B3F`), Orange (`#F5A623`), Kuning (`#C4D600`), Teal (`#4ECDC4`)
  - CSS Variables untuk semua warna
  - Status badge styles dengan warna appropriate
  - Board glow effects untuk display mode
  - 27 unit tests untuk CSS

- **Authentication System**
  - Login page dengan form
  - Default credentials: `admin/admin123`
  - Session management via localStorage
  - Auto-redirect jika belum login

- **Guest Management (CRUD)**
  - Tambah tamu baru
  - Lihat daftar tamu
  - Ubah status tamu
  - Hapus tamu

- **Display Board**
  - Tampilan publik untuk lobby/resepsionis
  - Real-time clock
  - Status badges berwarna

- **Export/Import**
  - Export data ke JSON file
  - Import data dari JSON file
  - Merge dengan existing data (no duplicate)

- **Responsive Design**
  - Mobile-first approach
  - Breakpoint: 768px
  - Hamburger menu untuk mobile

### Initial Files
- `login.html` - Halaman login
- `admin.html` - Dashboard admin
- `display.html` - Display board
- `css/style.css` - Stylesheet
- `js/app.js` - Logic aplikasi
- `img/GGF.png` - Logo GGF

---

## [0.1.0] - 2025-08-31

### Added
- Initial project setup
- Basic HTML structure
- Git repository initialization

---

## Version Schema

Versi mengikuti [Semantic Versioning](https://semver.org/):

- **Major (X.0.0):** Perubahan besar yang tidak backward compatible
- **Minor (0.X.0):** Fitur baru yang backward compatible
- **Patch (0.0.X):** Bug fix yang backward compatible

---

## Commit Convention

Semua commit mengikuti [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

**Types:**
- `feat:` Fitur baru
- `fix:` Bug fix
- `docs:` Dokumentasi
- `style:` Format (tidak mempengaruhi kode)
- `refactor:` Refactoring kode
- `test:` Menambahkan/mengubah tests
- `chore:` Maintenance

**Scopes:**
- `theme` - CSS/theme
- `nav` - Navigation
- `status` - Status flow
- `sort` - Sorting
- `datepicker` - Date picker

---

## Links

- [Repository](https://github.com/arwinwijaya/factory-guest-list)
- [Documentation](docs/)
- [API Reference](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
