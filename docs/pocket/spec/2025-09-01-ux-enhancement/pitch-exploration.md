# Pitch Exploration: UX Enhancement Sprint

**Date:** 2025-09-01
**Project:** Factory Guest List
**Stack:** Vanilla HTML/CSS/JS, localStorage, Flatpickr (CDN), Vitest

---

## Problem Statement

Aplikasi Factory Guest List sudah berjalan dengan fitur CRUD lengkap, namun pengalaman pengguna (UX) masih bisa ditingkatkan untuk penggunaan sehari-hari. User tidak bisa mencari tamu, tidak ada konfirmasi sebelum hapus, dan tidak ada feedback loading.

---

## Root Tension

Tradeoff antara **menambah fitur UX** vs **menjaga kesederhanaan** — aplikasi ini ringan dan cepat karena vanilla JS, jadi perlu hati-hati agar tidak over-engineer.

---

## Key Constraints

- Stack: Vanilla HTML/CSS/JS (tidak pakai framework)
- Storage: localStorage (max ~5-10MB)
- Deployment: Static hosting (tidak ada backend)
- Browser: Support modern browsers (Chrome 60+, Firefox 55+)
- Existing tests: 94 unit tests (Vitest)

---

## Success Looks Like

User bisa:
1. Mencari tamu dengan cepat berdasarkan nama atau perusahaan
2. Tidak sengaja menghapus tamu (ada konfirmasi)
3. Melihat feedback saat data sedang diproses
4. Navigasi data yang banyak dengan mudah (pagination)

---

## Approach Direction: UX Enhancement Sprint

### Fitur yang Diusulkan

| # | Fitur | Prioritas | Effort |
|---|-------|-----------|--------|
| 1 | **Search/Filter** — Cari tamu by nama/perusahaan | HIGH | Medium |
| 2 | **Confirmation Dialog** — Konfirmasi sebelum hapus | HIGH | Small |
| 3 | **Loading States** — Feedback saat proses | MEDIUM | Small |
| 4 | **Pagination** — Navigasi data banyak | MEDIUM | Medium |
| 5 | **Empty State CTA** — Tombol aksi saat data kosong | LOW | Small |

---

## Technical Notes

### Search/Filter
- Bisa diimplementasi dengan filter array di JS
- Real-time search (on input) atau search button
- Filter di client-side (tidak perlu backend)

### Confirmation Dialog
- Gunakan `window.confirm()` untuk MVP (simple)
- Atau custom modal untuk UX lebih baik

### Loading States
- Tambah class `.loading` dengan spinner
- Hapus class setelah data selesai diproses

### Pagination
- Client-side pagination (slice array)
- Configurable: 10, 25, 50 items per page
- Tampilkan "Page X of Y" dan navigasi

---

## Risks

| Risk | Mitigation |
|------|------------|
| Search lambat jika data banyak | Debounce input (300ms) |
| Pagination complex | Mulai dengan simple prev/next |
| Scope creep | Tetap di 4 fitur utama |

---

## Next Steps

1. Validasi dengan user — apakah 4 fitur ini sudah cukup?
2. Buat detailed spec (pocket-grinding)
3. Implement per fitur (pocket-development)

---

**Status:** Awaiting user approval for handoff
