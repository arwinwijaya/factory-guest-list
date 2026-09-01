# UX Enhancement Sprint — Specification

**Date:** 2025-09-01
**Project:** Factory Guest List
**Stack:** Vanilla HTML/CSS/JS, localStorage, Flatpickr (CDN), Vitest

---

## Problem Statement

Aplikasi Factory Guest List membutuhkan peningkatan UX untuk penggunaan sehari-hari: search, konfirmasi hapus, loading states, dan pagination.

---

## Design Decision

**Option C: Hybrid — Utility Functions + State Object**

- State object `guestListState` untuk shared state (search query, current page, items per page)
- Fungsi-fungsi terpisah untuk logic (search, pagination, modal, loading)
- Tidak mengubah pattern global functions yang ada

---

## Scope

### IN-SCOPE:
1. Search/Filter — Real-time search semua field, case-insensitive, 300ms debounce, min 2 chars
2. Confirmation Dialog — Custom modal dengan detail tamu, keyboard support
3. Loading States — Spinner 32px saat page load
4. Pagination — Configurable 10/25/50/All, info text, page navigation

### OUT-OF-SCOPE:
- Dark mode
- Accessibility (ARIA, keyboard nav) — fitur terpisah
- Backend/API integration
- Display page (display.html)

---

## Architecture Constraints

- **May touch:** js/app.js, admin.html, css/style.css, tests/
- **Must NOT touch:** display.html, login.html
- **Patterns:** Global functions, inline `<script>`, client-side only

---

## Acceptance Criteria

### Story 1: Search/Filter

**Rule: Real-time search across all fields**
- ✓ Given admin is on guest list page with 3 guests, When admin types "john" in search field, Then only guests with "john" in any field are displayed
- ✓ Given admin types "j" (1 char), When search triggers, Then all guests still displayed (no filter)
- ✓ Given admin types "JOHN" (uppercase), When search triggers, Then guest "John Doe" is displayed (case-insensitive)

**Rule: Search with debounce**
- ✓ Given admin types quickly, When typing stops for 300ms, Then search executes
- ✓ Given admin types "abc", When 300ms passes, Then results filter for "abc"

**Rule: Search highlight**
- ✓ Given search query "john", When results displayed, Then matching text "John" is bolded

**Rule: No results**
- ✓ Given admin searches "xyz123", When no matches found, Then message "Tidak ada hasil untuk 'xyz123'" displayed

**Rule: Search resets pagination**
- ✓ Given admin is on page 3, When admin searches, Then results show from page 1

---

### Story 2: Confirmation Dialog

**Rule: Modal shows guest details**
- ✓ Given admin clicks "Hapus" for guest "John Doe", When modal appears, Then title shows "Apakah Anda Yakin?"
- ✓ Given modal is open, Then modal shows: nama, perusahaan, tanggal
- ✓ Given modal is open, Then buttons [Tidak] and [Ya] are visible

**Rule: Confirm delete**
- ✓ Given modal is open for "John Doe", When admin clicks [Ya], Then guest removed and modal closes

**Rule: Cancel delete**
- ✓ Given modal is open, When admin clicks [Tidak], Then guest remains and modal closes

**Rule: Close with Escape**
- ✓ Given modal is open, When admin presses Escape, Then modal closes

**Rule: Close by clicking outside**
- ✓ Given modal is open, When admin clicks outside, Then modal closes

**Rule: Keyboard navigation**
- ✓ Given modal is open, When admin presses Tab, Then focus moves between buttons
- ✓ Given modal is open, When admin presses Enter, Then [Ya] is triggered

**Rule: Animation**
- ✓ Given modal appears, Then 200ms fade in animation
- ✓ Given modal closes, Then 200ms fade out animation

**Rule: Styling**
- ✓ Given modal is open, Then red/warning theme applied
- ✓ Given modal is open, Then [Tidak] button is gray
- ✓ Given modal is open, Then [Ya] button is red
- ✓ Given modal is open, Then light shadow applied
- ✓ Given modal is open, Then border radius 4px

---

### Story 3: Loading States

**Rule: Spinner on page load**
- ✓ Given admin navigates to guest list page, When data loading, Then 32px spinner shown in table center
- ✓ Given data loaded, Then spinner disappears

**Rule: No spinner for fast operations**
- ✓ Given data is loaded, When admin searches or paginates, Then no spinner shown

---

### Story 4: Pagination

**Rule: Default pagination**
- ✓ Given admin has 25 guests, When page loads, Then first 10 guests displayed
- ✓ Given 10 items shown, Then info shows "Menampilkan 1-10 dari 25 tamu"
- ✓ Given page 1 is active, Then page 1 has border style

**Rule: Navigation**
- ✓ Given admin on page 1, When clicks "Berikutnya >", Then guests 11-20 displayed
- ✓ Given admin on page 2, When clicks "< Sebelumnya", Then guests 1-10 displayed

**Rule: Disabled states**
- ✓ Given admin on page 1, Then "< Sebelumnya" is disabled
- ✓ Given admin on last page, Then "Berikutnya >" is disabled

**Rule: Configurable items per page**
- ✓ Given dropdown shows 10/25/50/All, When admin selects "25", Then 25 items per page
- ✓ Given admin selects "All", Then all guests displayed, pagination hidden

**Rule: Pagination hidden when not needed**
- ✓ Given admin has 5 guests, When page loads, Then all 5 displayed, pagination hidden

**Rule: Search resets pagination**
- ✓ Given admin on page 3, When searches, Then results from page 1

**Rule: Styling**
- ✓ Given pagination controls, Then info on left, page numbers on right
- ✓ Given page numbers, Then max 3 visible
- ✓ Given prev/next buttons, Then icon + text style
- ✓ Given hover on page number, Then background changes to primary green
- ✓ Given pagination text, Then font size 12px
- ✓ Given gap between info and controls, Then 24px

---

### Story 5: Empty State

**Rule: No data**
- ✓ Given admin has no guests, When page loads, Then message "Belum ada tamu" + "Tambah Tamu Baru" button

**Rule: No search results**
- ✓ Given admin searches "xyz123", When no results, Then message "Tidak ada hasil untuk 'xyz123'"

---

## UI Specifications

### Search Bar
- Position: Top-right of table
- Placeholder: "Ketik untuk mencari..."
- Icon: Search icon (left inside input), color #999999
- Border: Solid, same as other inputs
- Height: Same as buttons
- Padding: Same as other inputs
- Width: Auto (full container)
- Min characters: 2
- Debounce: 300ms

### Pagination Dropdown
- Position: Top-left of table
- Options: 10 / 25 / 50 / All
- Default: 10

### Pagination Controls
- Position: Bottom of table
- Info: Left side — "Menampilkan X-Y dari Z tamu"
- Page numbers: Right side — max 3 visible
- Active page: Border style (primary green)
- Prev/Next: Icon + text ("< Sebelumnya" / "Berikutnya >")
- Hover: Background primary green
- Font size: 12px
- Gap: 24px

### Confirmation Modal
- Title: "Apakah Anda Yakin?"
- Body: Guest details (nama, perusahaan, tanggal) + warning text
- Buttons: [Tidak] (gray) [Ya] (red)
- Animation: 200ms fade in/out
- Shadow: Light
- Border radius: 4px
- Close: Escape, click outside, buttons
- Keyboard: Enter=Ya, Escape=Tidak, Tab=navigate

### Loading Spinner
- Size: 32px
- Position: Center of table area
- Trigger: Page load only

---

## Technical Implementation

### State Object
```javascript
const guestListState = {
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 10,
    filteredGuests: [],
    totalGuests: 0
};
```

### New Functions
```javascript
// Search
function searchGuests(query) { ... }
function highlightText(text, query) { ... }
function debounce(func, delay) { ... }

// Pagination
function paginateGuests(guests, page, perPage) { ... }
function renderPagination(totalItems) { ... }
function changePage(page) { ... }
function changeItemsPerPage(count) { ... }

// Modal
function showDeleteConfirmation(guestId) { ... }
function closeModal() { ... }
function confirmDelete() { ... }

// Loading
function showLoading() { ... }
function hideLoading() { ... }

// Render
function renderGuestList() { ... }
function renderEmptyState(type) { ... }
```

### Files Modified
- `js/app.js` — Add state object, new functions
- `admin.html` — Add search bar, pagination controls, modal HTML, update inline script
- `css/style.css` — Add styles for search, pagination, modal, loading
- `tests/js/status.test.js` — Add tests for new functions

---

## Open Questions / Assumptions

**Assumption:** localStorage can handle pagination client-side without performance issues for <1000 guests.
**Risk:** If guests exceed 1000, may need virtual scrolling (out of scope).

**Assumption:** Existing `createGuestRow()` function can be reused for paginated rendering.
**Risk:** May need minor modifications for search highlight.

---

## Out-of-SCOPE (remind pocket-planning)

- Dark mode
- Accessibility (ARIA labels, keyboard nav beyond modal)
- Display page enhancements
- Backend/API integration
- Export/Import enhancements

---

**Spec approved by user:** 2025-09-01
