# Code Quality Audit Results

**Date:** 2025-09-02
**Scope:** `js/app.js`, `css/style.css`, `admin.html`, `display.html`, `login.html`
**Type:** Read-only analysis (no code changes)

---

## 1. Function Inventory (44 functions)

All functions in `js/app.js` categorized by domain:

### Search (3 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 1 | `searchGuests` | 30 | `renderGuestList()` in app.js | OK |
| 2 | `highlightText` | 50 | `renderGuestList()` in app.js | OK |
| 3 | `debounce` | 62 | `admin.html` inline: `debouncedSearch` | OK |

### Pagination (3 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 4 | `paginateGuests` | 82 | `renderGuestList()` in app.js | OK |
| 5 | `changePage` | 113 | `admin.html` onclick: `changePage(...)` | OK |
| 6 | `changeItemsPerPage` | 123 | `admin.html` onchange: `changeItemsPerPage(...)` | OK |

### Modal (3 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 7 | `showDeleteConfirmation` | 138 | `admin.html` inline: `removeGuest()` | OK |
| 8 | `closeModal` | 163 | `admin.html` onclick: `closeModal()` | OK |
| 9 | `confirmDelete` | 178 | `admin.html` onclick: `confirmDelete()` | OK |

### Loading State (2 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 10 | `showLoading` | 195 | `admin.html` inline: `loadGuests()` | OK |
| 11 | `hideLoading` | 203 | `admin.html` inline: `loadGuests()` | OK |

### Rendering (2 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 12 | `renderGuestList` | 212 | `admin.html` inline: `loadGuests()`, `debouncedSearch`, `changePage`, `changeItemsPerPage` | OK |
| 13 | `renderEmptyState` | 313 | `renderGuestList()` in app.js | OK |

### Authentication (4 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 14 | `login` | 343 | `login.html` inline: form submit handler | OK |
| 15 | `logout` | 353 | `admin.html` onclick: `logout()` | OK |
| 16 | `isLoggedIn` | 358 | `login.html` inline: redirect check | OK |
| 17 | `checkAuth` | 368 | `admin.html` inline: auth guard | OK |

### Guest Data (8 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 18 | `getGuests` | 378 | `renderGuestList`, `searchGuests`, `getTodayGuests`, `cleanPastGuests`, `getGuestsByStatus`, `exportToJSON`, `importFromJSON`, `display.html` inline | OK |
| 19 | `saveGuests` | 387 | `addGuest`, `deleteGuest`, `updateGuestStatus`, `importFromJSON` | OK |
| 20 | `addGuest` | 391 | `admin.html` inline: form submit handler | OK |
| 21 | `deleteGuest` | 415 | `confirmDelete()` in app.js | OK |
| 22 | `updateGuestStatus` | 420 | `changeStatus()` in app.js | OK |
| 23 | `getGuestById` | 432 | `showDeleteConfirmation()` in app.js | OK |
| 24 | `getTodayGuests` | 437 | `display.html` inline: `loadBoard()` | OK |
| 25 | `cleanPastGuests` | 443 | `admin.html` inline: `loadGuests()`, `display.html` inline: `loadBoard()` | OK |
| 26 | `getGuestsByStatus` | 455 | **NONE** | **DEAD CODE** |

### Utility (7 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 27 | `getTodayStr` | 465 | `addGuest`, `getTodayGuests`, `cleanPastGuests` | OK |
| 28 | `generateId` | 470 | `addGuest()` in app.js | OK |
| 29 | `formatDate` | 474 | **NONE** | **DEAD CODE** |
| 30 | `formatDateShort` | 483 | `showDeleteConfirmation()` in app.js, `createGuestRow()` in app.js | OK |
| 31 | `formatTime` | 490 | **NONE** | **DEAD CODE** |
| 32 | `getCurrentTime` | 496 | `initClock()` in app.js | OK |
| 33 | `getCurrentDate` | 502 | `initDate()` in app.js | OK |

### Status Helpers (3 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 34 | `getStatusLabel` | 511 | `createGuestRow()`, `changeStatus()` in app.js | OK |
| 35 | `getStatusClass` | 520 | `createGuestRow()` in app.js | OK |
| 36 | `changeStatus` | 524 | `admin.html` onclick: `changeStatus(...)` in `createGuestRow` | OK |

### Export/Import (2 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 37 | `exportToJSON` | 535 | `admin.html` onclick: `exportToJSON()` | OK |
| 38 | `importFromJSON` | 548 | `admin.html` inline: `handleImport()` | OK |

### Sort (1 function)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 39 | `sortGuestsByDate` | 582 | `display.html` inline: `loadBoard()` | OK |

### Display Helpers (1 function)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 40 | `createGuestRow` | 625 | `renderGuestList()` in app.js, `display.html` inline: `loadBoard()` | OK |

### Initialization (2 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 41 | `initClock` | 675 | `display.html` inline: `init()` | OK |
| 42 | `initDate` | 686 | `display.html` inline: `init()` | OK |

### Auto-Refresh (2 functions)
| # | Function | Line | References | Status |
|---|----------|------|------------|--------|
| 43 | `startAutoRefresh` | 694 | `display.html` inline: `init()` | OK |
| 44 | `stopAutoRefresh` | 699 | `startAutoRefresh()` in app.js | OK |

---

## 2. Dead Code Candidates

| Function | Line | Domain | Evidence |
|----------|------|--------|----------|
| `getGuestsByStatus(status)` | 455 | Guest Data | Zero references in app.js, admin.html, display.html, login.html. Defined but never called. |
| `formatDate(dateString)` | 474 | Utility | Zero references. `formatDateShort` is used instead. Likely replaced by `formatDateShort` during development. |
| `formatTime(dateString)` | 490 | Utility | Zero references. `getCurrentTime()` is used for clock display. This function was likely intended for formatting guest timestamps but is unused. |

**Total dead code candidates: 3 functions (6.8% of 44)**

---

## 3. Unused CSS Selectors

Selectors defined in `css/style.css` with zero references in HTML class attributes or JS `classList.add()` / `className` assignments:

| Selector | Line | Category | Evidence |
|----------|------|----------|----------|
| `.text-center` | ~580 | Utility | Not found in admin.html, display.html, login.html, or app.js |
| `.text-right` | ~581 | Utility | Not found in admin.html, display.html, login.html, or app.js |
| `.mt-16` | ~582 | Utility | Not found in admin.html, display.html, login.html, or app.js |
| `.mb-16` | ~583 | Utility | Not found in admin.html, display.html, login.html, or app.js |

**Total unused CSS selectors: 4**

### Note on Flatpickr Overrides
The following selectors target Flatpickr's dynamically generated DOM and cannot be verified via static analysis:
- `.flatpickr-calendar`
- `.flatpickr-months .flatpickr-month`
- `.flatpickr-current-month .flatpickr-monthDropdown-months`
- `span.flatpickr-day.selected`
- `span.flatpickr-day:hover`

These are **not flagged as unused** since Flatpickr is loaded in `admin.html` and these styles apply at runtime.

---

## 4. Naming Consistency

### Function Names
All 44 functions use **camelCase** consistently. No violations found.

Examples verified:
- `searchGuests`, `highlightText`, `debounce` (multi-word camelCase)
- `getGuestById`, `updateGuestStatus`, `cleanPastGuests` (consistent verb-noun pattern)
- `exportToJSON`, `importFromJSON` (acronym handled correctly)

### Variable Names
- `guestListState` - camelCase (OK)
- `_pendingDeleteId` - camelCase with underscore prefix for private state (OK)
- `refreshInterval` - camelCase (OK)

### Constants
- `STORAGE_KEY`, `AUTH_KEY`, `DEFAULT_CREDENTIALS` - UPPER_SNAKE_CASE (correct convention)

### CSS Classes
All CSS classes use **kebab-case** consistently (correct convention for CSS).

### Inline Script Functions (admin.html)
- `loadGuests` - camelCase (OK)
- `removeGuest` - camelCase (OK)
- `handleImport` - camelCase (OK)
- `showNotification` - camelCase (OK)
- `debouncedSearch` - camelCase (OK)

### Inline Script Functions (display.html)
- `loadBoard` - camelCase (OK)
- `init` - camelCase (OK)

**Naming inconsistencies found: 0**

---

## 5. Summary

| Metric | Count |
|--------|-------|
| Total functions | 44 |
| Functions with references | 41 |
| Dead code candidates | 3 |
| Unused CSS selectors | 4 |
| Naming inconsistencies | 0 |

### Recommendations (for future tasks)
1. Remove `getGuestsByStatus`, `formatDate`, `formatTime` from `js/app.js`
2. Remove `.text-center`, `.text-right`, `.mt-16`, `.mb-16` from `css/style.css`
3. Consider extracting `removeGuest` wrapper from admin.html inline script into app.js for consistency
