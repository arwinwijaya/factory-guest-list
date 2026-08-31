# Pitch Exploration: factory-guest-web-improvement
Date: 2025-08-31 | Project: Factory Guest List | Status: pitch-only

---

## Problem Statement
Web Daftar Tamu Factory perlu di-improve agar sesuai brand GGF — mulai dari warna theme, navigasi antar halaman, status management yang lebih fleksibel, hingga fix date picker yang tidak berfungsi.

## Root Tension
Balance antara konsistensi brand (warna GGF: hijau, oranye, kuning, biru) dengan usability (theme yang cocok untuk factory environment dan reliable cross-browser).

## Key Constraints
- Static site (HTML/CSS/JS) — semua logic di frontend, localStorage untuk data
- Logo GGF punya 4 warna dominan: hijau tua (#006B3F), oranye (#F5A623), kuning (#C4D600), biru (#4ECDC4)
- Native `<input type="date">` tidak reliable di semua browser dengan dark theme
- Data existing di localStorage perlu di-migrasi jika status flow berubah
- Harus responsive (mobile + desktop)

---

## Brainstorming Methods Used

### Question Storming — deep
Key insights:
- Apakah warna logo GGF sudah ada brand guideline atau extract manual?
- Seberapa sering user berpindah antar halaman?
- Status "Active/On-Going/Reschedule/Cancel" menggantikan atau menambah "Menunggu/Meeting/Selesai"?
- Sort by "waktu terdekat" = waktu kunjungan, waktu sekarang, atau waktu update?
- Date picker tidak muncul di semua browser atau spesifik?

### First Principles Thinking — creative
Key insights:
- Asumsi "theme harus gelap" bisa di-challenge — brand GGF colorful, mungkin light theme dengan aksen hijau lebih cocok
- Asumsi "navigasi link teks cukup" — perlu navigation bar yang prominent
- Asumsi "status putaran tetap" — user butuh status fleksibel (Active/On-Going/Reschedule/Cancel)
- Asumsi "native date picker cukup" — perlu custom library untuk reliability

### Six Thinking Hats — structured
Key insights:
- White: Logo GGF = hijau, oranye, kuning, biru. Saat ini 3 status. Data di localStorage.
- Red: User frustrasi dengan date picker. Tampilan gelap mungkin tidak match brand.
- Yellow: Konsistensi brand tingkatkan profesionalisme. Navigasi jelas kurangi confusion.
- Black: Terlalu banyak warna bisa noisy. Custom date picker = lebih banyak maintenance.
- Green: Gradient background dari warna logo. Navigation bar dengan ikon. Status badges warna brand.
- Blue: Prioritas: Fix date picker → Theme → Navigation → Sort

### Constraint Mapping — deep
Key constraints:
- Static site — tidak ada backend, semua di localStorage
- Native date picker — behavior tergantung browser
- Logo hanya satu file PNG — perlu extract warna
- Harus responsive
- Navigation harus intuitif

---

## Advisor Synthesis
Semua method converge pada satu tema: **konsistensi brand GGF harus menjadi fondasi setiap perubahan**. Date picker bug adalah critical path yang harus di-fix terlebih dahulu. Status flow perlu di-replace total (bukan ditambah). Navigation bar prominent di semua halaman adalah UX improvement yang paling berdampak. Custom CSS theme dengan flatpickr adalah approach yang paling seimbang antara control dan effort.

---

## Spike Results
**Unknown resolved:** Kenapa date picker popup tidak muncul?
**Finding:** Native `<input type="date">` dengan dark theme bermasalah di beberapa browser (terutama Firefox). CSS tidak ada overflow:hidden di form, tapi dark background bisa menyebabkan popup tidak visible.
**Implication:** Gunakan flatpickr library yang reliable cross-browser dan bisa di-theme.

---

## Approach Directions

### Direction A: Custom Theme + Flatpickr Library (Recommended)
Theme custom berdasarkan warna GGF dengan CSS variables, gunakan flatpickr untuk date picker yang reliable.
+ Full control atas tampilan, reliable date picker, mudah di-maintain
− Perlu write custom CSS

### Direction B: CSS Framework + Native Date Picker Fix
Gunakan framework CSS ringan dan fix date picker dengan CSS override.
+ Lebih cepat implementasi, lightweight
− Kurang control atas warna spesifik GGF

### Direction C: Full Custom Component Set
Buat semua komponen dari scratch dengan warna GGF.
+ Konsisten 100% dengan brand
− More maintenance, lebih banyak kode

---

## Open Questions for pocket-grinding
- [ ] Apakah flatpickr sudah cukup atau perlu date picker yang lebih custom?
- [ ] Bagaimana migrasi data existing dari status lama ke status baru?
- [ ] Apakah display board juga perlu navigasi atau tetap full-screen?
- [ ] Bagaimana handle responsive design untuk navigation bar?

---

## Recommended Direction
Direction A — Custom theme + flatpickr. Kombinasi control penuh atas warna GGF dengan reliable date picker library yang sudah terbukti.

---

## Handoff Context (for pocket-grinding)
When pocket-grinding reads this doc:
- Start with this problem statement (Phase 1 context)
- Use Direction A as the working hypothesis for Phase 5 Design Proposals
- Treat Open Questions above as Phase 3 Discovery targets
- Do NOT treat Approach Directions as final architecture — validate through GWT first
