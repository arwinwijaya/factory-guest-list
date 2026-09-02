# Pitch Exploration: code-quality-optimization
Date: 2025-09-02 | Project: Factory Guest List | Status: pitch-only

---

## Problem Statement
Code quality Factory Guest List perlu ditingkatkan — `js/app.js` berisi 831 baris dengan 44 fungsi global yang sulit di-navigate, dan ada ~14 unused CSS selectors yang menambah noise. Bundle size sudah optimal (0 production dependencies, CDN ter-cache), jadi fokus utama ke maintainability dan dead code elimination.

## Root Tension
Ingin modularisasi untuk maintainability jangka panjang, tapi takut break 157 tests yang sudah pass dan menambah complexity yang tidak perlu untuk project size kecil.

## Key Constraints
- Vanilla JS tanpa bundler — tidak ada build step
- Global functions karena inline onclick handlers di HTML
- 157 tests harus tetap pass selama refactor
- Project size kecil (~65KB total) — over-engineering lebih berbahaya dari monolith
- Flatpickr via CDN sudah di-cache browser — jangan diubah

---

## Brainstorming Methods Used

### Question Storming — deep
Key insights:
- `app.js` terlalu besar untuk di-navigate dengan nyaman (831 baris, 44 fungsi)
- Global functions bukan pilihan desain tapi constraint dari inline onclick handlers
- Dead code dan unused CSS adalah low-hanging fruit yang bisa langsung dibersihkan
- Test coverage 157 tests = safety net yang kuat untuk refactor apapun

### First Principles Thinking — creative
Key insights:
- Asumsi "harus satu file" adalah constraint buatan, bukan teknis
- Browser modern mendukung ES Modules natively (`<script type="module">`)
- Code quality ≠ modularisasi wajib — naming, dokumentasi, error handling juga penting
- Bundle size ≠ ukuran file absolut — perceived performance lebih penting

### Six Thinking Hats — structured
Key insights:
- **White (Facts):** 831 lines, 44 functions, 0 module, 157 tests pass
- **Red (Emotions):** Developer feel "sulit navigate", "takut ubah takut break"
- **Yellow (Benefits):** Semua di satu file = mudah cari, simple deployment
- **Black (Risks):** Refactor besar = risk breaking tests, effort tinggi
- **Green (Creativity):** Hybrid approach — modularisasi tanpa bundler
- **Blue (Process):** Audit dulu, prioritaskan, incremental refactor

### Assumption Reversal — deep
Key insights:
- "Code quality berarti modularisasi penuh" → Bisa berarti naming consistency, docs, error handling
- "Bundle size berarti kurangi file size" → Bisa berarti lazy loading, caching, compression
- Modularisasi tanpa proper boundaries = lebih buruk dari monolith
- Yang penting bukan jumlah file tapi coupling antar fungsi

---

## Advisor Synthesis
Advisor menyarankan pendekatan incremental — jangan big-bang refactor. Monolith berfungsi, jangan rusak yang sudah bekerja. High-impact, low-risk changes dulu: dead code elimination, CSS audit, progressive modularization. Full ES Modules rewrite dianggap high risk dengan low immediate value untuk project size ini.

---

## Spike Results

**Unknown resolved:** Apakah ada masalah bundle size yang signifikan?
**Finding:** Tidak — 0 production dependencies, CDN ter-cache, total 65KB. CSS memiliki ~14 unused selectors (73 defined, 59 used).
**Implication:** Fokus ke code quality (modularisasi, dead code) bukan bundle size optimization.

---

## Approach Directions

### Direction A: Incremental Cleanup (Recommended)
Hapus dead code, unused CSS, konsistenkan naming — tanpa modularisasi besar. Fokus ke quick wins yang low-risk.
+ Low risk, immediate value, tests tetap pass
− Tidak menyelesaikan masalah struktural jangka panjang

### Direction B: Logical Grouping
Pecah `app.js` menjadi 3-4 file berdasarkan domain (auth, guest, ui, utils) dengan `<script>` tags berurutan di HTML.
+ Lebih mudah navigate, setiap file punya tanggung jawab jelas
− Masih global functions, perlu urutan script yang benar

### Direction C: ES Modules Progressive
Convert ke ES Modules secara bertahap, mulai dari utility functions. Gunakan `<script type="module">`.
+ Modern, proper encapsulation, tree-shaking capable
− Higher risk, perlu ubah HTML, perlu testing ulang

---

## Open Questions for pocket-grinding
- [ ] Fungsi mana yang sebenarnya dead code dan bisa dihapus?
- [ ] CSS selectors mana yang unused dan bisa dihapus?
- [ ] Jika Direction B dipilih, bagaimana grouping yang optimal tanpa circular dependency?
- [ ] Apakah ada naming inconsistencies yang perlu diperbaiki?
- [ ] Bagaimana cara mengukur keberhasilan refactor?

---

## Recommended Direction
Direction A — Mulai dengan cleanup yang low-risk dulu (dead code, unused CSS, naming). Jika masih kurang, lanjut ke Direction B (logical grouping). Direction C terlalu high-risk untuk project size ini.

---

## Handoff Context (for pocket-grinding)
When pocket-grinding reads this doc:
- Start with this problem statement (Phase 1 context)
- Use Direction A as the working hypothesis for Phase 5 Design Proposals
- Treat Open Questions above as Phase 3 Discovery targets
- Do NOT treat Approach Directions as final architecture — validate through GWT first
