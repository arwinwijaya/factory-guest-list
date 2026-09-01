# Execution Plan: UX Enhancement Sprint

**Date:** 2025-09-01
**Spec:** docs/pocket/spec/2025-09-01-ux-enhancement/ux-enhancement-spec.md
**Total Tasks:** 6
**Test Framework:** Vitest + JSDOM

---

## Recommended Order

```
T1 (State & Search) ──┐
T3 (Modal) ───────────┼──→ T5 (Integration) ──→ T6 (CSS)
T4 (Loading) ─────────┘         ↑
T2 (Pagination) ────────────────┘
```

## Parallelizable Groups

- **Initial:** T1, T3, T4 can run concurrently
- **After T1:** T2 runs
- **After T1+T2+T3+T4:** T5 runs
- **After T5:** T6 runs

---

### Task 1: State Object & Search Functions [prereq]
---

## OBJECTIVE
Create guestListState object and implement search/filter functions with debounce and highlight.

Files:
- Modify: `js/app.js`
- Test: `tests/js/status.test.js`

Steps:
1. Write failing tests for search functions:
   Test file: `tests/js/status.test.js`
   Level: unit

   Test intent (4 test cases):
   a) Given array of guests, When searchGuests("john") called, Then only guests with "john" in any field returned
   b) Given array of guests, When searchGuests("j") called (1 char), Then all guests returned (min 2 chars)
   c) Given array of guests, When searchGuests("JOHN") called, Then guest "John Doe" returned (case-insensitive)
   d) Given text "John Doe" and query "john", When highlightText() called, Then returns "<b>John</b> Doe"

   Exercise through:
   - searchGuests(query) public function
   - highlightText(text, query) public function

   Test doubles:
   - mock: localStorage via createAppEnv()
   - do NOT mock: searchGuests, highlightText functions

   Expected RED:
   - Functions do not exist yet

2. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: searchGuests is not defined

3. Implement minimal code to satisfy the test:
   File: `js/app.js`
   Implement:
   - guestListState object with searchQuery, currentPage, itemsPerPage, filteredGuests, totalGuests
   - searchGuests(query) — filter guests where any field contains query (case-insensitive, min 2 chars)
   - highlightText(text, query) — wrap matching text in <b> tags
   - debounce(func, delay) — standard debounce utility (300ms default)

4. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

5. Refactor while green (bounded):
   - Ensure searchGuests handles edge cases: empty query, null fields
   - Re-run test: `npx vitest run tests/js/status.test.js` — must stay PASS

6. Commit:
   `git add js/app.js tests/js/status.test.js`
   `git commit -m "feat(search): add state object and search functions"`

---

### Task 2: Pagination Functions [depends: T1]
---

## OBJECTIVE
Implement pagination logic: paginateGuests(), renderPagination(), changePage(), changeItemsPerPage().

Files:
- Modify: `js/app.js`
- Test: `tests/js/status.test.js`

Steps:
1. Write failing test for: paginateGuests() returns correct slice of guests
   Test file: `tests/js/status.test.js`
   Level: unit

   Test intent:
   Given array of 25 guests, page 1, perPage 10
   When paginateGuests(guests, 1, 10) is called
   Then first 10 guests are returned

   Exercise through:
   - paginateGuests(guests, page, perPage) public function

   Test doubles:
   - do NOT mock: paginateGuests function

   Expected RED:
   - Function does not exist yet

2. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: paginateGuests is not defined

3. Implement minimal code to satisfy the test:
   File: `js/app.js`
   Implement:
   - paginateGuests(guests, page, perPage) — returns { items, totalPages, currentPage, totalItems }
   - renderPagination(totalItems) — generates pagination HTML
   - changePage(page) — updates guestListState.currentPage and re-renders
   - changeItemsPerPage(count) — updates guestListState.itemsPerPage and re-renders

4. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

5. Refactor while green (bounded):
   - Handle edge cases: page > totalPages, perPage = "All"
   - Re-run test: `npx vitest run tests/js/status.test.js` — must stay PASS

6. Commit:
   `git add js/app.js tests/js/status.test.js`
   `git commit -m "feat(pagination): add pagination functions"`

---

### Task 3: Confirmation Modal [prereq] [parallel: T1]
---

## OBJECTIVE
Implement custom confirmation modal with guest details, keyboard support, and animations.

Files:
- Modify: `js/app.js`
- Test: `tests/js/status.test.js`

Steps:
1. Write failing tests for modal functions:
   Test file: `tests/js/status.test.js`
   Level: unit

   Test intent (5 test cases):
   a) Given guest "guest_123", When showDeleteConfirmation("guest_123") called, Then guestId stored and modal visible
   b) Given modal is open, Then title shows "Apakah Anda Yakin?"
   c) Given modal is open, Then body shows guest nama, perusahaan, tanggal
   d) Given modal is open, Then buttons [Tidak] and [Ya] are present
   e) Given modal is open, When click outside modal, Then modal closes

   Exercise through:
   - showDeleteConfirmation(guestId) public function
   - closeModal() public function

   Test doubles:
   - mock: DOM elements (modal container, guest data)
   - do NOT mock: showDeleteConfirmation, closeModal functions

   Expected RED:
   - Functions do not exist yet

2. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: showDeleteConfirmation is not defined

3. Implement minimal code to satisfy the test:
   File: `js/app.js`
   Implement:
   - showDeleteConfirmation(guestId) — stores guestId, populates modal with guest details (nama, perusahaan, tanggal), shows modal with 200ms fade in
   - closeModal() — hides modal with 200ms fade out animation
   - confirmDelete() — deletes guest, closes modal, refreshes list
   - Keyboard event handlers: Escape closes, Enter confirms, Tab navigates
   - Click outside handler: clicking modal overlay closes modal

4. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

5. Refactor while green (bounded):
   - Ensure modal handles missing guest gracefully
   - Re-run test: `npx vitest run tests/js/status.test.js` — must stay PASS

6. Commit:
   `git add js/app.js tests/js/status.test.js`
   `git commit -m "feat(modal): add confirmation modal functions"`

---

### Task 4: Loading States [prereq] [parallel: T1]
---

## OBJECTIVE
Implement loading spinner functions for page load feedback.

Files:
- Modify: `js/app.js`
- Test: `tests/js/status.test.js`

Steps:
1. Write failing tests for loading functions:
   Test file: `tests/js/status.test.js`
   Level: unit

   Test intent (2 test cases):
   a) Given loading container exists, When showLoading() called, Then spinner element is displayed
   b) Given spinner is displayed, When hideLoading() called, Then spinner is removed

   Exercise through:
   - showLoading() public function
   - hideLoading() public function

   Test doubles:
   - mock: DOM elements (loading container)
   - do NOT mock: showLoading, hideLoading functions

   Expected RED:
   - Functions do not exist yet

2. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: showLoading is not defined

3. Implement minimal code to satisfy the test:
   File: `js/app.js`
   Implement:
   - showLoading() — shows 32px spinner in table center
   - hideLoading() — hides spinner

4. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

5. Refactor while green (bounded):
   - Ensure hideLoading handles missing spinner gracefully
   - Re-run test: `npx vitest run tests/js/status.test.js` — must stay PASS

6. Commit:
   `git add js/app.js tests/js/status.test.js`
   `git commit -m "feat(loading): add loading state functions"`

---

### Task 5: Admin Page Integration [depends: T1, T2, T3, T4]
---

## OBJECTIVE
Integrate all UX features into admin.html: search bar, pagination controls, modal HTML, loading spinner, and update loadGuests() to use new functions.

Files:
- Modify: `admin.html`
- Modify: `js/app.js` — update loadGuests(), renderGuestList()
- Test: `tests/js/status.test.js`

Steps:
1. Write failing tests for integration scenarios:
   Test file: `tests/js/status.test.js`
   Level: integration

   Test intent (5 test cases):
   a) Given 25 guests, searchQuery="", page=1, perPage=10, When renderGuestList() called, Then 10 rows rendered
   b) Given 25 guests, searchQuery="john", When renderGuestList() called, Then only matching guests shown
   c) Given 0 guests, When renderGuestList() called, Then empty state "Belum ada tamu" + CTA button shown
   d) Given search "xyz123" with no matches, When renderGuestList() called, Then "Tidak ada hasil untuk 'xyz123'" shown
   e) Given page=3, When searchQuery changes, Then pagination resets to page 1

   Exercise through:
   - renderGuestList() public function
   - renderEmptyState(type) public function

   Test doubles:
   - mock: localStorage, DOM table element
   - do NOT mock: renderGuestList, searchGuests, paginateGuests, renderEmptyState

   Expected RED:
   - Functions do not exist yet

2. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: renderGuestList is not defined

3. Implement minimal code to satisfy the test:
   File: `admin.html`
   Implement:
   - Search bar HTML (top-right of table)
   - Pagination dropdown HTML (top-left of table)
   - Pagination controls HTML (bottom of table)
   - Modal HTML (hidden by default)
   - Loading spinner HTML
   - Update loadGuests() to call renderGuestList()
   - Add event listeners for search, pagination, modal

   File: `js/app.js`
   Implement:
   - renderGuestList() — combines search + pagination + render
   - renderEmptyState(type) — shows appropriate empty state message ("no-data" or "no-results")

4. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

5. Refactor while green (bounded):
   - Ensure all event listeners are properly attached
   - Re-run test: `npx vitest run tests/js/status.test.js` — must stay PASS

6. Commit:
   `git add admin.html js/app.js tests/js/status.test.js`
   `git commit -m "feat(admin): integrate search, pagination, modal, loading"`

---

### Task 6: CSS Styles for All Components [depends: T5]
---

## OBJECTIVE
Add CSS styles for search bar, pagination, modal, loading spinner, and empty state.

Files:
- Modify: `css/style.css`
- Test: `tests/css/style.test.js` (existing file — add new selectors)

Steps:
1. Write failing test for: .search-container style exists
   Test file: `tests/css/style.test.js`
   Level: unit

   Test intent:
   Given style.css is loaded
   When checking for .search-container selector
   Then it exists with display: flex and justify-content: space-between

   Exercise through:
   - CSS selector verification (existing test pattern in style.test.js)

   Test doubles:
   - None needed

   Expected RED:
   - .search-container selector does not exist

2. Run test — verify FAIL:
   `npx vitest run tests/css/style.test.js`
   Expected failure: .search-container not found

3. Implement minimal code to satisfy the test:
   File: `css/style.css`
   Implement:
   - .search-container, .search-input, .search-icon styles
   - .pagination-container, .pagination-info, .pagination-controls, .page-btn styles
   - .modal-overlay, .modal-container, .modal-header, .modal-body, .modal-footer styles
   - .loading-spinner, .loading-container styles
   - .empty-state, .empty-state-cta styles
   - Responsive styles for all components

4. Run test — verify PASS:
   `npx vitest run tests/css/style.test.js`
   Expected: PASS

5. Refactor while green (bounded):
   - Ensure responsive styles work on mobile
   - Re-run test: `npx vitest run tests/css/style.test.js` — must stay PASS

6. Commit:
   `git add css/style.css tests/css/style.test.js`
   `git commit -m "feat(css): add styles for search, pagination, modal, loading"`

---

## Plan Summary

| Task | Name | Dependencies | Files |
|------|------|--------------|-------|
| T1 | State Object & Search Functions | prereq | js/app.js, tests/ |
| T2 | Pagination Functions | T1 | js/app.js, tests/ |
| T3 | Confirmation Modal | prereq | js/app.js, tests/ |
| T4 | Loading States | prereq | js/app.js, tests/ |
| T5 | Admin Page Integration | T1, T2, T3, T4 | admin.html, js/app.js, tests/ |
| T6 | CSS Styles | T5 | css/style.css, tests/ |

---

## QUALITY BAR (All Tasks)

Must-have:
- Tests written BEFORE implementation (TDD)
- All acceptance criteria from spec covered
- Commit message follows conventional commits format
- No modifications to display.html or login.html

Must-not-have:
- Dark mode implementation
- Accessibility features beyond modal keyboard support
- Backend/API integration
- Changes to display.html

Open question risks:
- localStorage performance with >1000 guests → if issue: report NEEDS_CONTEXT
- createGuestRow() reuse for search highlight → if modification needed: update in T5

---

**Plan approved:** Awaiting user confirmation
