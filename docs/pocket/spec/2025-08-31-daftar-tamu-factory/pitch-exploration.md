# Pitch Exploration: daftar-tamu-factory
Date: 2025-08-31 | Project: daftar-tamu-factory | Status: pitch-only

---

## Problem Statement
Factory membutuhkan web app daftar tamu dengan display board gaya airport departure board untuk lobby. Admin bisa login (admin/admin123), input data tamu (Nama, Tanggal Kunjungan, Asal Perusahaan, Keperluan), dan display board tampil profesional di layar lobby.

## Root Tension
Simplicity (vanilla HTML/CSS/JS + localStorage, single file deployment) vs visual premium (airport boarding board aesthetic dengan animasi flip, dark theme, high contrast).

## Key Constraints
- Single admin, hardcoded credential (admin/admin123)
- 4 data fields: Nama Tamu, Tanggal Kunjungan, Asal Perusahaan, Keperluan
- Vanilla HTML/CSS/JS, no build step, no framework
- LocalStorage untuk persistence (no backend/database)
- Display board harus readable dari jauh (lobby TV context)

---

## Brainstorming Methods Used

### Question Storming — deep
Key insights:
- Airport boarding board efektif karena: monospace font, konsistensi format, high contrast, baris seragam
- Perlu 2 view terpisah: admin CRUD vs lobby display board
- Status field (menunggu → meeting → selesai) menambah depth tanpa kompleksitas
- LocalStorage risk (data loss on clear) bisa di-mitigate dengan optional JSON export

### First Principles Thinking — creative
Key insights:
- App ini = input form + display board (dua view utama)
- Display board = tabel dengan animasi flip/glow ala departure board
- Auth sederhana = single hardcoded credential check
- Tidak perlu over-engineer: single admin, local storage, no auth complexity

### Six Thinking Hats — structured
Key insights:
- ⚪ Facts: 4 data fields, single admin, localStorage, vanilla stack
- 🔴 Emotions: Factory staff akan "wow" jika tampilan profesional seperti bandara
- 🟡 Benefits: Mudah deploy (single HTML file), tidak butuh server
- ⚫ Risks: LocalStorage hilang jika browser data di-clear
- 🟢 Creativity: Animasi flip board, dark theme, auto-refresh display
- 🔵 Process: Prioritas: Login → CRUD → Display Board → Polish

### Analogical Thinking — creative
Key insights:
- Airport Departure Board: kolom terstruktur, monospace, flip animation, dark background
- Train Station Info Board: fokus "now" vs "next" — inspirasi "Tamu Hari Ini"
- Restaurant Queue Display: status flow (waiting → seated → done)
- Hospital Patient Board: color-coded status

---

## Advisor Synthesis
Advisor mengkonfirmasi: arsitektur 3 screen (login, admin CRUD, display board) sudah tepat. Airport board aesthetic adalah differentiator utama — dark theme, monospace font, flip animation. Status tracking (menunggu → meeting → selesai) valuable addition. LocalStorage tradeoff acceptable untuk single admin context. Display board sebaiknya jadi halaman terpisah untuk lobby TV.

---

## Approach Directions

### Direction A: Single File App
Semua dalam satu `index.html` — login, CRUD, dan display board sebagai "page" yang di-switch via JavaScript.
+ Simplicity maksimal, deploy tinggal upload 1 file
− File besar, sulit maintain jika fitur bertambah

### Direction B: Multi-File Separation
Pisah jadi 3 file: `login.html`, `admin.html`, `display.html` + shared `style.css` + `app.js`.
+ Clean separation, mudah develop dan maintain
− Butuh shared state antar file (localStorage solve ini)

### Direction C: SPA with Router
Single HTML dengan JavaScript router (hash-based routing).
+ Modern feel, seamless navigation
− Over-engineer untuk project kecil, butuh router logic

---

## Open Questions for pocket-grinding
- [ ] Berapa banyak tamu yang ditampilkan per halaman display? 10? 20? Scroll atau pagination?
- [ ] Apakah perlu fitur search/filter di admin panel?
- [ ] Apakah display board perlu auto-refresh atau manual refresh?
- [ ] Apakah ada sound effect saat tamu baru ditambahkan?
- [ ] Apakah perlu fitur export ke JSON/CSV sebagai backup?

---

## Recommended Direction
Direction B — Multi-File Separation. Clean, maintainable, localStorage sebagai shared state sudah cukup. Pisah view memungkinkan display board di-load di lobby TV tanpa admin controls.

---

## Handoff Context (for pocket-grinding)
When pocket-grinding reads this doc:
- Start with this problem statement (Phase 1 context)
- Use Direction B (Multi-File Separation) as the working hypothesis for Phase 5 Design Proposals
- Treat Open Questions above as Phase 3 Discovery targets
- Do NOT treat Approach Directions as final architecture — validate through GWT first
