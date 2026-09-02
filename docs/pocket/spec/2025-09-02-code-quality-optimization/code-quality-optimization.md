# Code Quality Optimization

**Date:** 2025-09-02
**Status:** draft
**Author:** brainstorm session + edge case hunter review
**Spec path:** docs/pocket/spec/2025-09-02-code-quality-optimization/code-quality-optimization.md

---

## Summary

Factory Guest List membutuhkan peningkatan code quality — `js/app.js` berisi 831 baris dengan 44 fungsi global yang sulit di-navigate, dan ada ~14 unused CSS selectors. Pendekatan Hybrid dipilih: cleanup (dead code removal, CSS cleanup, reorganisasi) + selective extraction (pindahkan domain besar ke file terpisah).

---

## Context

### Current State
- `js/app.js`: 831 lines, 44 global functions, monolitik
- `css/style.css`: 976 lines, 73 selectors (~14 unused)
- `admin.html`: 340 lines dengan inline script
- 157 tests passing (Vitest + JSDOM)
- 0 production dependencies, Flatpickr via CDN

### Problem / Motivation
- Developer sulit navigate 44 fungsi di satu file
- Fear of breaking — tidak yakin dampak perubahan
- Code terasa berantakan / tidak konsisten
- Dead code dan unused CSS menambah noise

### Related Areas
- `js/app.js` — main application logic
- `css/style.css` — all styles
- `admin.html` — inline script dengan fungsi-fungsi
- `tests/js/status.test.js` — JS tests
- `tests/css/style.test.js` — CSS tests

---

## Scope

### In-Scope
- Dead code identification and removal (unused functions → `js/deprecated.js`)
- Unused CSS selector identification and removal (delete langsung)
- Naming consistency audit (camelCase enforcement)
- Code organization (domain grouping + frequency ordering)
- Selective extraction (domain besar ke file terpisah)
- `showNotification` dipindahkan ke `app.js` sebagai shared utility

### Out-of-Scope
- ES Modules conversion (terlalu high-risk)
- Build step introduction (Vite, Webpack)
- New feature additions
- Display page changes (`display.html`)
- Login page changes (`login.html`)
- Inline `<style>` blocks di HTML files

---

## Architecture Constraints

- **May touch:** `js/app.js`, `css/style.css`, `admin.html`, `tests/`
- **Must NOT touch:** `display.html`, `login.html`
- **Patterns:** Global functions, inline `<script>`, client-side only
- **Architecture validation:** PASS

---

## Dependencies

### Existing (to leverage)
- Vitest — test framework, sudah terinstall
- JSDOM — DOM testing environment, sudah terinstall

### New (proposed)
none

---

## Stories + Scenarios

### Story 1: Dead Code Identification & Removal
> As a developer, I want unused functions moved to `js/deprecated.js`, so that I can reference them later if needed while keeping `app.js` clean.

**Rule 1: Identify unused functions**
- Functions with zero references in HTML or JS are candidates for deprecation
- Scanner must check HTML inline handlers (`onclick=`, `onchange=`, `oninput=`)
- Scanner must check cross-file references

```gherkin
Scenario: Identify unused functions
  Given app.js has 44 functions
  When audit is performed scanning app.js AND all HTML files
  Then functions with zero references are listed
  And each candidate shows where it was defined

Scenario: Move unused functions to deprecated.js
  Given function "X" has zero references in app.js and HTML files
  When deprecation is executed
  Then function "X" is removed from app.js
  And function "X" is added to js/deprecated.js
  And all 157 tests still pass

Scenario: Preserve functions with HTML references
  Given function "removeGuest" is referenced in admin.html onclick handler
  When deprecation is executed
  Then function "removeGuest" remains in app.js
```

**Rule 2: Preserve cross-file function calls**
- `showNotification` dipindahkan ke `app.js` sebagai shared utility
- Functions dipanggil via `typeof` guard tetap di-guard

```gherkin
Scenario: showNotification moved to app.js
  Given showNotification is defined in admin.html inline script
  When refactoring is executed
  Then showNotification is moved to app.js
  And admin.html no longer defines showNotification
  And all pages can call showNotification safely
```

---

### Story 2: Code Organization
> As a developer, I want functions grouped by domain with frequently-used functions at the top, so that I can quickly find what I need.

**Rule 1: Domain grouping**
- Functions grouped under domain headers: Auth, Guest Data, UI/Display, Utilities
- Each header uses format: `// === DOMAIN NAME ===`

```gherkin
Scenario: Functions grouped by domain
  Given app.js has functions from multiple domains
  When reorganization is applied
  Then functions are grouped under domain headers
  And each header uses format: // === DOMAIN NAME ===
```

**Rule 2: Frequency ordering**
- Within each group, most frequently used functions appear first
- `getGuests()` before `getGuestById()`
- `addGuest()` before `cleanPastGuests()`

```gherkin
Scenario: Frequently used functions at top of group
  Given "Guest Data" group has 10 functions
  When reorganization is applied
  Then getGuests() appears before getGuestById()
  And addGuest() appears before cleanPastGuests()
```

**Rule 3: Naming consistency**
- All functions use camelCase
- Non-camelCase functions are flagged and renamed

```gherkin
Scenario: Naming consistency check
  Given some functions use inconsistent naming
  When naming audit is performed
  Then all functions use camelCase
  And any non-camelCase functions are flagged
```

---

### Story 3: CSS Cleanup
> As a developer, I want unused CSS selectors removed, so that stylesheet is leaner and easier to maintain.

**Rule 1: Identify unused selectors**
- Selectors not referenced in any HTML file OR applied via JavaScript `classList.add()`
- Scanner must check JS files for dynamic class usage

```gherkin
Scenario: Identify unused CSS selectors
  Given style.css has 73 selectors
  When audit is performed scanning HTML files AND JS files
  Then selectors not used in HTML or via classList.add() are listed

Scenario: Remove unused selectors
  Given selector ".X" is not referenced in any HTML or JS
  When cleanup is executed
  Then selector ".X" is removed from style.css
  And CSS tests still pass

Scenario: Preserve selectors used via JavaScript
  Given selector ".hidden" is used via classList.add('hidden') in app.js
  When cleanup is executed
  Then selector ".hidden" remains in style.css
```

**Rule 2: Preserve CSS variables**
- CSS variables in `:root` referenced by Flatpickr overrides must be preserved

```gherkin
Scenario: Preserve CSS variables referenced by third-party overrides
  Given variable --primary-color is used in Flatpickr CSS overrides
  When cleanup is executed
  Then variable --primary-color remains in :root
```

---

### Story 4: Quality Metrics
> As a developer, I want to measure refactor success, so that I know the optimization achieved its goals.

**Rule 1: Function count reduction**
- Target: reduce from 44 functions in app.js
- Deprecated functions counted separately

```gherkin
Scenario: Measure function count reduction
  Given app.js has 44 functions before refactor
  When refactor is complete
  Then function count in app.js is reported
  And deprecated function count in deprecated.js is reported
```

**Rule 2: Line count reduction**
- Target: reduce from 831 lines in app.js

```gherkin
Scenario: Measure line count reduction
  Given app.js has 831 lines before refactor
  When refactor is complete
  Then line count is reported
  And reduction percentage is calculated
```

**Rule 3: Test preservation**
- All 157 tests must continue to pass

```gherkin
Scenario: Verify all tests pass
  Given 157 tests exist before refactor
  When refactor is complete
  Then all 157 tests pass
  And no new test failures are introduced
```

---

## Acceptance Criteria

```
Rule: Dead Code Removal
  ✓ Given function with zero references, When audit runs, Then function listed as candidate
  ✓ Given function referenced in HTML onclick, When audit runs, Then function preserved
  ✓ Given showNotification in admin.html, When refactoring, Then moved to app.js
  ✓ Given deprecated functions, When moved to deprecated.js, Then all tests pass

Rule: Code Organization
  ✓ Given app.js functions, When reorganized, Then grouped by domain headers
  ✓ Given Guest Data group, When reorganized, Then getGuests() before getGuestById()
  ✓ Given non-camelCase function, When audit runs, Then flagged for rename

Rule: CSS Cleanup
  ✓ Given unused selector, When audit runs, Then selector listed for removal
  ✓ Given selector used via classList.add(), When audit runs, Then selector preserved
  ✓ Given CSS variable in :root, When cleanup runs, Then variable preserved if referenced

Rule: Quality Metrics
  ✓ Given 44 functions before, When refactor complete, Then count reported
  ✓ Given 831 lines before, When refactor complete, Then reduction calculated
  ✓ Given 157 tests before, When refactor complete, Then all tests pass
```

---

## Design Decision

**Chosen option:** Option C — Hybrid (Cleanup + Selective Extraction)

**Summary:** Lakukan cleanup (dead code removal, CSS cleanup, reorganisasi) + extract domain besar ke file terpisah. Balance antara risk dan benefit.

**Rejected options:**
- Option A (Conservative Cleanup): rejected karena tidak menyelesaikan masalah struktural jangka panjang
- Option B (Domain File Split): rejected karena terlalu high-risk untuk project size kecil

**Key tradeoffs accepted:**
- Tidak semua domain di-extract — hanya yang paling besar
- Masih ada global functions — tidak mengubah arsitektur
- Lebih kompleks dari Option A tapi lebih aman dari Option B

---

## Open Questions / Assumptions

| Question | Resolution | Risk if Wrong |
|----------|------------|---------------|
| Domain mana yang paling besar dan perlu di-extract? | assumed: Guest Data functions (paling banyak) | Bisa extract domain yang salah |
| Berapa banyak fungsi yang benar-benar dead code? | assumed: 5-10 fungsi | Bisa lebih banyak atau lebih sedikit |
| Apakah ada naming inconsistencies? | assumed: beberapa (perlu audit) | Bisa lebih banyak dari expected |

---

## Implementation Notes

- Lakukan audit dulu sebelum perubahan apapun
- Commit per tahap (audit → dead code → CSS → reorganisasi → extraction)
- Jalankan tests setelah setiap perubahan
- Gunakan `js/deprecated.js` untuk fungsi yang dipindahkan

---

## Rollback Plan

- Git commit per tahap — bisa revert perubahan spesifik
- `js/deprecated.js` bisa dihapus jika tidak diperlukan
- Semua perubahan bisa di-revert ke commit sebelum refactor
