# EXECUTION PLAN — Factory Guest List Web Improvement

**Date:** 2025-08-31
**Spec:** docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md
**Status:** draft
**Total tasks:** 5

---

## Execution Overview

### Recommended Order
```
T1 → T2, T3, T5 (parallel) → T4
```

### Parallelizable Groups
| Group | Tasks | Unblocked After |
|-------|-------|-----------------|
| Group A | T2, T3, T5 | T1 completes |
| Group B | T4 | T3 completes |

### Constraints Reminder
**Architecture:** Vanilla JS (no frameworks), CSS variables, responsive design, existing file structure
**Out-of-scope:** Backend/database migration, new features, mobile app/PWA, multi-user/role-based access, data migration script
**Assumptions at risk:** Old localStorage data ignored (not migrated), Flatpickr loaded from CDN, export/import with old status values shows unknown
**Sequencing:** Dependency order shown is recommended only — pocket skill enforces actual blocking rules

### File Structure Map
```
Rule: Theme Rebranding
  Modify: css/style.css
  Test:   tests/css/style.test.js

Rule: Navigation Bar
  Modify: admin.html
  Modify: display.html
  Modify: login.html
  Modify: css/style.css
  Test:   tests/html/nav.test.js

Rule: Status Flow
  Modify: js/app.js
  Modify: admin.html
  Modify: display.html
  Test:   tests/js/status.test.js

Rule: Sort by Visit Date
  Modify: js/app.js
  Modify: display.html
  Test:   tests/js/sort.test.js

Rule: Date Picker Fix
  Modify: admin.html
  Modify: css/style.css
  Test:   tests/js/datepicker.test.js
```

---

## Pocket Packets

---

### Task 1: CSS Theme Rebranding [prereq]

## OBJECTIVE
Update CSS variables in `:root` to match GGF brand colors and add new status badge styles for Active/On-Going/Reschedule/Cancel.

Files:
- Modify: `css/style.css`
- Test: `tests/css/style.test.js`

Steps:
1. Write failing test for: Header displays GGF green
   Test file: `tests/css/style.test.js`
   Level: unit
   Test intent: Given the user is on any page, When the navigation bar renders, Then the background color is #006B3F
   Exercise through: CSS variable `--primary-color` value check
   Test doubles: none
   Expected RED: CSS variable `--primary-color` is currently #ffd700 (gold), not #006B3F

2. Run test — verify FAIL:
   `npx vitest run tests/css/style.test.js`
   Expected failure: assertion error — expected #006B3F, received #ffd700

3. Implement minimal code to satisfy the test:
   File: `css/style.css`
   Implement: Update `:root` CSS variables:
   - `--primary-color: #006B3F;` (GGF green)
   - `--accent-orange: #F5A623;`
   - `--accent-yellow: #C4D600;`
   - `--accent-blue: #4ECDC4;`
   - `--bg-primary: #f5f5f5;` (light background)
   - `--bg-secondary: #ffffff;`
   - `--text-primary: #333333;`
   - `--text-secondary: #666666;`

4. Run test — verify PASS:
   `npx vitest run tests/css/style.test.js`
   Expected: PASS

5. Write failing test for: Status badges use brand colors
   Test file: `tests/css/style.test.js`
   Level: unit
   Test intent: Given a guest has status "On-Going", When the status badge renders, Then the background is rgba(245, 166, 35, 0.2) and text is #F5A623
   Exercise through: CSS class `.status-ongoing` style check
   Test doubles: none
   Expected RED: `.status-ongoing` class does not exist yet

6. Run test — verify FAIL:
   `npx vitest run tests/css/style.test.js`
   Expected failure: assertion error — class not found

7. Implement minimal code to satisfy the test:
   File: `css/style.css`
   Implement: Add status badge styles:
   - `.status-active` — background: rgba(0, 107, 63, 0.2), color: #006B3F, border: #006B3F
   - `.status-ongoing` — background: rgba(245, 166, 35, 0.2), color: #F5A623, border: #F5A623
   - `.status-reschedule` — background: rgba(196, 214, 0, 0.2), color: #C4D600, border: #C4D600
   - `.status-cancel` — background: rgba(78, 205, 196, 0.2), color: #4ECDC4, border: #4ECDC4
   - `.board-status.status-active` — text-shadow: 0 0 10px rgba(0, 107, 63, 0.5), color: #006B3F
   - `.board-status.status-ongoing` — text-shadow: 0 0 10px rgba(245, 166, 35, 0.5), color: #F5A623
   - `.board-status.status-reschedule` — text-shadow: 0 0 10px rgba(196, 214, 0, 0.5), color: #C4D600
   - `.board-status.status-cancel` — text-shadow: 0 0 10px rgba(78, 205, 196, 0.5), color: #4ECDC4

8. Run test — verify PASS:
   `npx vitest run tests/css/style.test.js`
   Expected: PASS

9. Refactor while green:
   - Remove old status badge styles (.status-menunggu, .status-meeting, .status-selesai)
   - Update any hardcoded color values to use CSS variables
   - Re-run test: `npx vitest run tests/css/style.test.js` — must stay PASS

10. Commit:
    `git add css/style.css tests/css/style.test.js`
    `git commit -m "feat(theme): rebrand CSS to GGF colors"`

## REFERENCES LOADED
- `docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md` — Rule: Theme Rebranding, GWT scenarios: Header displays GGF green, Status badges use brand colors
- `css/style.css` — current dark theme with gold accents

## WHY THIS APPROACH
Complexity: lightweight
Justification: 1 file modification, clear CSS variable updates, no judgment needed

## SANDWICH CONTEXT
[CRITICAL: CSS variables must use GGF brand colors exactly: #006B3F, #F5A623, #C4D600, #4ECDC4]
You are implementing CSS Theme Rebranding for Factory Guest List.
Spec: docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md
Design decision: Option A — CSS Variables + Flatpickr + Vanilla JS
Files in scope: css/style.css
Available after: none (prereq)
Architecture rule: Must use CSS variables for all colors
[RESTATE: CSS variables must use GGF brand colors exactly]

## DELIVERABLE
Given the user is on any page, When the navigation bar renders, Then the background color is #006B3F
Given a guest has status "Active", When the badge renders, Then the color is #006B3F with white text
Given a guest has status "On-Going", When the badge renders, Then the color is #F5A623
Given a guest has status "Reschedule", When the badge renders, Then the color is #C4D600
Given a guest has status "Cancel", When the badge renders, Then the color is #4ECDC4
Given the user is on any page, Then the page background is light (#f5f5f5)

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - All CSS variables updated to GGF colors
  - Status badge styles for all 4 statuses
  - Light background theme

Must-not-have:
  - Hardcoded colors (use CSS variables)
  - Old status badge styles (menunggu, meeting, selesai)

Open question risks:
  - Old localStorage data ignored → if wrong: old status badges will show broken styles

Rollback note:
  - Revert CSS variables to original dark theme values

Red flags:
  - Work outside css/style.css → DONE_WITH_CONCERNS

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: old data assumption proves wrong
Escalate when: constraint violated

---

### Task 2: Navigation Bar [depends: T1]

## OBJECTIVE
Add navigation bar with GGF logo and 3 links (Login, Admin, Display) to all 3 HTML pages. Add responsive hamburger menu for mobile.

Files:
- Modify: `admin.html`
- Modify: `display.html`
- Modify: `login.html`
- Modify: `css/style.css`
- Test: `tests/html/nav.test.js`

Steps:
1. Write failing test for: Navigation bar appears on all pages
   Test file: `tests/html/nav.test.js`
   Level: unit
   Test intent: Given the user is on the Login page, When the page renders, Then the navigation bar is visible with GGF logo
   Exercise through: DOM query for `nav.navbar` and `img.logo`
   Test doubles: none
   Expected RED: `nav.navbar` element does not exist in login.html

2. Run test — verify FAIL:
   `npx vitest run tests/html/nav.test.js`
   Expected failure: element not found

3. Implement minimal code to satisfy the test:
   Files: `login.html`, `admin.html`, `display.html`
   Implement: Add navigation bar HTML to all 3 pages:
   ```html
   <nav class="navbar">
     <div class="nav-logo">
       <img src="img/GGF.png" alt="GGF Logo" class="logo">
     </div>
     <div class="nav-links">
       <a href="login.html" class="nav-link">Login</a>
       <a href="admin.html" class="nav-link">Admin</a>
       <a href="display.html" class="nav-link">Display</a>
     </div>
     <button class="nav-hamburger" onclick="this.parentElement.classList.toggle('active')">
       ☰
     </button>
   </nav>
   ```

4. Run test — verify PASS:
   `npx vitest run tests/html/nav.test.js`
   Expected: PASS

5. Write failing test for: Current page is highlighted
   Test file: `tests/html/nav.test.js`
   Level: unit
   Test intent: Given the user is on the Admin page, When the navigation renders, Then the "Admin" link has class "active"
   Exercise through: DOM query for `.nav-link.active` with href containing "admin"
   Test doubles: none
   Expected RED: `.nav-link.active` class not applied

6. Run test — verify FAIL:
   `npx vitest run tests/html/nav.test.js`
   Expected failure: active class not found

7. Implement minimal code to satisfy the test:
   Files: `admin.html`, `display.html`, `login.html`
   Implement: Add `class="nav-link active"` to current page link in each HTML file

8. Run test — verify PASS:
   `npx vitest run tests/html/nav.test.js`
   Expected: PASS

9. Write failing test for: Navigation collapses on mobile
   Test file: `tests/html/nav.test.js`
   Level: unit
   Test intent: Given the CSS file is loaded, When we check for responsive rules, Then `@media (max-width: 768px)` exists with `.nav-hamburger` display block and `.nav-links` display none
   Exercise through: Read CSS file content and check for media query rules
   Test doubles: none
   Expected RED: No media query for responsive nav in CSS file

10. Run test — verify FAIL:
    `npx vitest run tests/html/nav.test.js`
    Expected failure: media query not found in file content

11. Implement minimal code to satisfy the test:
    File: `css/style.css`
    Implement: Add nav styles and responsive media query:
    - `.navbar` — flex, background: #006B3F, padding, align-items
    - `.nav-logo .logo` — height: 40px
    - `.nav-links` — flex, gap
    - `.nav-link` — color: white, text-decoration, padding
    - `.nav-link.active` — font-weight: bold, border-bottom
    - `.nav-hamburger` — display: none, background: none, color: white, font-size
    - Media query `@media (max-width: 768px)` — hamburger visible, links hidden, vertical layout

12. Run test — verify PASS:
    `npx vitest run tests/html/nav.test.js`
    Expected: PASS

13. Write failing test for: Navigation links have correct href attributes
    Test file: `tests/html/nav.test.js`
    Level: unit
    Test intent: Given the navigation bar renders, When we check the links, Then href attributes contain 'login.html', 'admin.html', 'display.html'
    Exercise through: DOM query for `.nav-link` elements and their href attributes
    Test doubles: none
    Expected RED: Links may not have correct href values

14. Run test — verify FAIL:
    `npx vitest run tests/html/nav.test.js`
    Expected failure: href assertion error

15. Implement minimal code to satisfy the test:
    Files: `admin.html`, `display.html`, `login.html`
    Implement: Verify href attributes in navigation links are correct

16. Run test — verify PASS:
    `npx vitest run tests/html/nav.test.js`
    Expected: PASS

17. Refactor while green:
    - Ensure nav styles use CSS variables for colors
    - Re-run test: `npx vitest run tests/html/nav.test.js` — must stay PASS

18. Commit:
    `git add admin.html display.html login.html css/style.css tests/html/nav.test.js`
    `git commit -m "feat(nav): add responsive navigation bar to all pages"`

## REFERENCES LOADED
- `docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md` — Rule: Navigation Bar, GWT scenarios: Navigation bar appears on all pages, Current page is highlighted, Navigation collapses on mobile
- `admin.html`, `display.html`, `login.html` — current HTML structure

## WHY THIS APPROACH
Complexity: standard
Justification: 4 files modification, responsive design requires careful CSS

## SANDWICH CONTEXT
[CRITICAL: Navigation must appear on ALL pages — Login, Admin, Display]
You are implementing Navigation Bar for Factory Guest List.
Spec: docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md
Design decision: Option A — CSS Variables + Flatpickr + Vanilla JS
Files in scope: admin.html, display.html, login.html, css/style.css
Available after: T1 (CSS theme)
Architecture rule: Vanilla JS only, CSS variables for colors
[RESTATE: Navigation must appear on ALL pages]

## DELIVERABLE
Given the user is on any page, Then the navigation bar is visible with GGF logo
Given the user clicks a navigation link, Then the user is redirected to the correct page
Given the user is on the current page, Then the corresponding nav link is highlighted
Given the user is on mobile (≤768px), Then the navigation collapses to hamburger menu

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Navigation bar on all 3 pages
  - GGF logo in navigation
  - Current page highlighted
  - Responsive hamburger menu

Must-not-have:
  - JavaScript frameworks
  - Hardcoded colors (use CSS variables)

Open question risks:
  - Flatpickr CDN availability → if wrong: offline usage breaks date picker (not this task)

Rollback note:
  - Remove navigation bar HTML from all pages

Red flags:
  - Work outside listed files → DONE_WITH_CONCERNS

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: CDN assumption proves wrong
Escalate when: constraint violated

---

### Task 3: Status Flow [depends: T1]

## OBJECTIVE
Replace status flow from "Menunggu/Meeting/Selesai" cycle to "Active/On-Going/Reschedule/Cancel" with 4 separate buttons for free transition.

Files:
- Modify: `js/app.js`
- Modify: `admin.html`
- Modify: `display.html` (inline loadBoard function)
- Test: `tests/js/status.test.js`

Steps:
1. Write failing test for: New guest gets Active status
   Test file: `tests/js/status.test.js`
   Level: unit
   Test intent: Given the admin submits a new guest form, When the guest is added, Then the default status is "Active"
   Exercise through: `addGuest()` function return value
   Test doubles: mock localStorage
   Expected RED: `addGuest()` currently returns status "menunggu", not "active"

2. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: assertion error — expected "active", received "menunggu"

3. Implement minimal code to satisfy the test:
   File: `js/app.js`
   Implement:
   - Update `addGuest()` to set `status: 'active'` (lowercase)
   - Update `getStatusLabel()` to handle new statuses:
     - 'active' → 'Active'
     - 'ongoing' → 'On-Going'
     - 'reschedule' → 'Reschedule'
     - 'cancel' → 'Cancel'
   - Update `getStatusClass()` to return `status-${status}`

4. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

5. Write failing test for: Admin changes guest status via buttons
   Test file: `tests/js/status.test.js`
   Level: unit
   Test intent: Given a guest with status "active", When the admin changes to "ongoing", Then the status updates to "ongoing"
   Exercise through: `updateGuestStatus(id, 'ongoing')` function
   Test doubles: mock localStorage
   Expected RED: `updateGuestStatus()` works but button UI not implemented

6. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: button click handler not implemented

7. Implement minimal code to satisfy the test:
   Files: `js/app.js`, `admin.html`
   Implement:
   - Add `changeStatus(id, newStatus)` function in app.js
   - Update `createGuestRow()` to show 4 status buttons instead of 1 cycle button
   - Update admin.html action column to call `changeStatus()`

8. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

9. Write failing test for: Status badge displays correct color
   Test file: `tests/js/status.test.js`
   Level: unit
   Test intent: Given a guest with status "reschedule", When the badge renders, Then the class is "status-reschedule"
   Exercise through: `getStatusClass('reschedule')` function
   Test doubles: none
   Expected RED: `getStatusClass()` returns "status-menunggu" for unknown status

10. Run test — verify FAIL:
    `npx vitest run tests/js/status.test.js`
    Expected failure: old status classes returned

11. Implement minimal code to satisfy the test:
    File: `js/app.js`
    Implement: Update `getStatusClass()` to handle new status values

12. Run test — verify PASS:
    `npx vitest run tests/js/status.test.js`
    Expected: PASS

13. Write failing test for: Free status transition (Cancel → Active)
    Test file: `tests/js/status.test.js`
    Level: unit
    Test intent: Given a guest with status "cancel", When the admin changes to "active", Then the status updates to "active"
    Exercise through: `updateGuestStatus(id, 'active')` function
    Test doubles: mock localStorage
    Expected RED: Transition from cancel to active may not work if old cycle logic remains

14. Run test — verify FAIL:
    `npx vitest run tests/js/status.test.js`
    Expected failure: assertion error

15. Implement minimal code to satisfy the test:
    File: `js/app.js`
    Implement: Ensure `updateGuestStatus()` accepts any status value without restrictions

16. Run test — verify PASS:
    `npx vitest run tests/js/status.test.js`
    Expected: PASS

17. Write failing test for: All statuses appear on Display board
    Test file: `tests/js/status.test.js`
    Level: integration
    Test intent: Given guests with statuses "active", "ongoing", "reschedule", "cancel", When `createGuestRow(guest, false)` is called for each, Then all 4 rows render with correct status classes
    Exercise through: `createGuestRow()` function with isAdmin=false
    Test doubles: mock guest objects
    Expected RED: `createGuestRow()` may not handle new status classes for display mode

18. Run test — verify FAIL:
    `npx vitest run tests/js/status.test.js`
    Expected failure: assertion error

19. Implement minimal code to satisfy the test:
    Files: `js/app.js`, `display.html`
    Implement:
    - Verify `createGuestRow()` uses `getStatusClass()` for display mode
    - Remove hardcoded `statusPriority` map (menunggu/meeting/selesai) from `display.html` inline `loadBoard()`
    - Replace old inline sort with simple date-only sort as temporary measure (T4 will replace with `sortGuestsByDate()`)

20. Run test — verify PASS:
    `npx vitest run tests/js/status.test.js`
    Expected: PASS

21. Refactor while green:
    - Remove old `getNextStatus()` function
    - Remove old status constants
    - Re-run test: `npx vitest run tests/js/status.test.js` — must stay PASS

22. Commit:
    `git add js/app.js admin.html display.html tests/js/status.test.js`
    `git commit -m "feat(status): replace status flow with Active/On-Going/Reschedule/Cancel"`

## REFERENCES LOADED
- `docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md` — Rule: Status Flow, GWT scenarios: New guest gets Active status, Admin changes guest status, Status badge displays correct color
- `js/app.js` — current status logic (lines 113-120)

## WHY THIS APPROACH
Complexity: standard
Justification: 2 files modification, status logic changes require careful testing

## SANDWICH CONTEXT
[CRITICAL: Status must be lowercase strings: 'active', 'ongoing', 'reschedule', 'cancel']
You are implementing Status Flow for Factory Guest List.
Spec: docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md
Design decision: Option A — CSS Variables + Flatpickr + Vanilla JS
Files in scope: js/app.js, admin.html, display.html
Available after: T1 (CSS theme)
Architecture rule: Vanilla JS only, localStorage schema unchanged
[RESTATE: Status must be lowercase strings]

## DELIVERABLE
Given a new guest is added, Then the default status is "Active"
Given the admin clicks a status button, Then the status changes to the selected value
Given a guest has any status, Then the admin can change to any other status
Given a guest has any status, Then the badge displays the correct label and color

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Default status "active" for new guests
  - 4 status buttons in admin table
  - Correct labels and colors for all statuses
  - Free transition (any status to any status)

Must-not-have:
  - Old status values (menunggu, meeting, selesai)
  - Cycle-based status change

Open question risks:
  - Old localStorage data ignored → if wrong: old status values will show broken badges

Rollback note:
  - Restore original status flow (menunggu/meeting/selesai cycle)

Red flags:
  - Work outside listed files → DONE_WITH_CONCERNS

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: old data assumption proves wrong
Escalate when: constraint violated

---

### Task 4: Sort by Visit Date [depends: T3]

## OBJECTIVE
Implement sort logic for guests by visit date: today first, future dates ascending, past dates descending, same date by creation time (newest first).

Files:
- Modify: `js/app.js`
- Modify: `display.html` (inline loadBoard function)
- Test: `tests/js/sort.test.js`

Steps:
1. Write failing test for: Guests sorted by nearest date
   Test file: `tests/js/sort.test.js`
   Level: unit
   Test intent: Given guests with dates "2025-09-15", "2025-09-01", "2025-08-20", When sorted, Then the order is "2025-09-01", "2025-09-15", "2025-08-20"
   Exercise through: `sortGuestsByDate(guests)` function
   Test doubles: mock guest data
   Expected RED: `sortGuestsByDate()` does not exist

2. Run test — verify FAIL:
   `npx vitest run tests/js/sort.test.js`
   Expected failure: function not found

3. Implement minimal code to satisfy the test:
   File: `js/app.js`
   Implement: `sortGuestsByDate(guests)` function with logic:
   - Get today's date (YYYY-MM-DD)
   - Separate guests into: today, future, past
   - Sort future dates ascending (nearest first)
   - Sort past dates descending (most recent first)
   - Sort same-date guests by createdAt descending (newest first)
   - Concatenate: today + future + past

4. Run test — verify PASS:
   `npx vitest run tests/js/sort.test.js`
   Expected: PASS

5. Write failing test for: Today's guests appear first
   Test file: `tests/js/sort.test.js`
   Level: unit
   Test intent: Given today is "2025-08-31" and guests with dates "2025-09-05", "2025-08-31", "2025-08-25", When sorted, Then the order is today, future, past
   Exercise through: `sortGuestsByDate(guests)` function
   Test doubles: mock guest data with fixed today
   Expected RED: today's guests not prioritized

6. Run test — verify FAIL:
   `npx vitest run tests/js/sort.test.js`
   Expected failure: assertion error

7. Implement minimal code to satisfy the test:
   File: `js/app.js`
   Implement: Update sort logic to prioritize today's guests

8. Run test — verify PASS:
   `npx vitest run tests/js/sort.test.js`
   Expected: PASS

9. Write failing test for: Same date sorted by creation time
   Test file: `tests/js/sort.test.js`
   Level: unit
   Test intent: Given two guests with same date and different createdAt, When sorted, Then newer createdAt appears first
   Exercise through: `sortGuestsByDate(guests)` function
   Test doubles: mock guest data with same date
   Expected RED: createdAt not used for tiebreaking

10. Run test — verify FAIL:
    `npx vitest run tests/js/sort.test.js`
    Expected failure: assertion error

11. Implement minimal code to satisfy the test:
    File: `js/app.js`
    Implement: Add createdAt tiebreaker to sort logic

12. Run test — verify PASS:
    `npx vitest run tests/js/sort.test.js`
    Expected: PASS

13. Write failing test for: Display board uses sortGuestsByDate
    Test file: `tests/js/sort.test.js`
    Level: unit
    Test intent: Given display.html's inline `loadBoard()` function, When we read the source file, Then it contains a call to `sortGuestsByDate()` from app.js
    Exercise through: Read display.html file content and check for `sortGuestsByDate()` function call
    Test doubles: none
    Expected RED: `display.html` still uses old inline sort logic

14. Run test — verify FAIL:
    `npx vitest run tests/js/sort.test.js`
    Expected failure: old sort logic still present

15. Implement minimal code to satisfy the test:
    File: `display.html`
    Implement: Update inline `loadBoard()` to call `sortGuestsByDate()` from app.js instead of old inline sort

16. Run test — verify PASS:
    `npx vitest run tests/js/sort.test.js`
    Expected: PASS

17. Refactor while green:
    - Extract date comparison helpers if logic gets complex
    - Re-run test: `npx vitest run tests/js/sort.test.js` — must stay PASS

18. Commit:
    `git add js/app.js display.html tests/js/sort.test.js`
    `git commit -m "feat(sort): implement visit date sorting with today priority"`

## REFERENCES LOADED
- `docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md` — Rule: Sort by Visit Date, GWT scenarios: Guests sorted by nearest date, Today's guests appear first, Same date sorted by creation time
- `js/app.js` — current sort logic in `loadBoard()` (lines 196-210)

## WHY THIS APPROACH
Complexity: standard
Justification: 1 file modification, sort logic requires careful edge case handling

## SANDWICH CONTEXT
[CRITICAL: Sort order: today first, future ascending, past descending, same-date by createdAt descending]
You are implementing Sort by Visit Date for Factory Guest List.
Spec: docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md
Design decision: Option A — CSS Variables + Flatpickr + Vanilla JS
Files in scope: js/app.js, display.html
Available after: T3 (Status Flow)
Architecture rule: Vanilla JS only, pure function for sort logic
[RESTATE: Sort order: today first, future ascending, past descending]

## DELIVERABLE
Given guests with different dates, Then future dates appear first (ascending)
Given guests with different dates, Then past dates appear after future (descending)
Given today's date, Then today's guests appear first
Given same-date guests, Then newer creation time appears first

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - `sortGuestsByDate()` function
  - Today's guests prioritized
  - Future dates ascending
  - Past dates descending
  - Same-date tiebreaker by createdAt

Must-not-have:
  - Modifying localStorage schema
  - Changing sort in admin page (only display board)

Open question risks:
  - None — sort logic is self-contained

Rollback note:
  - Restore original sort logic (newest first)

Red flags:
  - Work outside js/app.js → DONE_WITH_CONCERNS

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: none
Escalate when: constraint violated

---

### Task 5: Date Picker Fix [depends: T1]

## OBJECTIVE
Replace native `<input type="date">` with Flatpickr library for reliable cross-browser date picking. Theme Flatpickr with GGF colors.

Files:
- Modify: `admin.html`
- Modify: `css/style.css`
- Test: `tests/js/datepicker.test.js`

Steps:
1. Write failing test for: Date picker opens on click
   Test file: `tests/js/datepicker.test.js`
   Level: unit
   Test intent: Given the admin is on the Admin page, When the admin clicks the date input, Then the Flatpickr calendar popup appears
   Exercise through: Flatpickr instance creation
   Test doubles: mock DOM element
   Expected RED: Flatpickr not loaded, no instance created

2. Run test — verify FAIL:
   `npx vitest run tests/js/datepicker.test.js`
   Expected failure: flatpickr not defined

3. Implement minimal code to satisfy the test:
   Files: `admin.html`, `js/app.js`
   Implement:
   - Add Flatpickr CDN links to admin.html `<head>`:
     ```html
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
     <script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js"></script>
     ```
   - Initialize Flatpickr on date input in admin.html script:
     ```javascript
     flatpickr('#tanggal', {
       dateFormat: 'Y-m-d',
       defaultDate: 'today'
     });
     ```

4. Run test — verify PASS:
   `npx vitest run tests/js/datepicker.test.js`
   Expected: PASS

5. Write failing test for: Date picker styled with GGF theme
   Test file: `tests/js/datepicker.test.js`
   Level: unit
   Test intent: Given the CSS file is loaded, When we check for Flatpickr overrides, Then `.flatpickr-months .flatpickr-month` has `background-color: #006B3F`
   Exercise through: Read CSS file content and check for override rules
   Test doubles: none
   Expected RED: No CSS overrides for Flatpickr exist in style.css

6. Run test — verify FAIL:
   `npx vitest run tests/js/datepicker.test.js`
   Expected failure: CSS override not found in file content

7. Implement minimal code to satisfy the test:
   File: `css/style.css`
   Implement: Add Flatpickr theme overrides:
   ```css
   .flatpickr-calendar {
     border-radius: 8px;
     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
   }
   .flatpickr-months .flatpickr-month {
     background-color: #006B3F;
     color: white;
   }
   .flatpickr-current-month .flatpickr-monthDropdown-months {
     color: white;
   }
   span.flatpickr-day.selected {
     background: #F5A623;
     border-color: #F5A623;
   }
   span.flatpickr-day:hover {
     background: rgba(245, 166, 35, 0.2);
   }
   ```

8. Run test — verify PASS:
   `npx vitest run tests/js/datepicker.test.js`
   Expected: PASS

9. Write failing test for: Admin selects a date updates input value
   Test file: `tests/js/datepicker.test.js`
   Level: unit
   Test intent: Given Flatpickr is initialized on date input, When a date is selected programmatically via `flatpickr.setDate('2025-09-15')`, Then the input value is '2025-09-15'
   Exercise through: Flatpickr instance `setDate()` method and input value check
   Test doubles: mock DOM element
   Expected RED: `setDate()` may not sync with input value

10. Run test — verify FAIL:
    `npx vitest run tests/js/datepicker.test.js`
    Expected failure: input value not updated

11. Implement minimal code to satisfy the test:
    File: `admin.html`
    Implement: Ensure Flatpickr initialization syncs with input value

12. Run test — verify PASS:
    `npx vitest run tests/js/datepicker.test.js`
    Expected: PASS

13. Refactor while green:
    - Ensure date input still works with form submission
    - Re-run test: `npx vitest run tests/js/datepicker.test.js` — must stay PASS

14. Commit:
    `git add admin.html css/style.css tests/js/datepicker.test.js`
    `git commit -m "fix(datepicker): replace native date input with Flatpickr"`

## REFERENCES LOADED
- `docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md` — Rule: Date Picker Fix, GWT scenarios: Date picker opens on click, Date picker styled with GGF theme
- Flatpickr docs — CDN setup, initialization, dateFormat options
- `admin.html` — current date input (line 45)

## WHY THIS APPROACH
Complexity: lightweight
Justification: 2 files modification, Flatpickr is well-documented and straightforward

## SANDWICH CONTEXT
[CRITICAL: Flatpickr must be loaded from CDN, dateFormat must be 'Y-m-d']
You are implementing Date Picker Fix for Factory Guest List.
Spec: docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md
Design decision: Option A — CSS Variables + Flatpickr + Vanilla JS
Files in scope: admin.html, css/style.css
Available after: T1 (CSS theme)
Architecture rule: Vanilla JS only, CDN dependency allowed
[RESTATE: Flatpickr must be loaded from CDN]

## DELIVERABLE
Given the admin clicks the date input, Then the Flatpickr calendar appears
Given Firefox browser, Then the calendar popup appears
Given the calendar is open, Then it displays with GGF theme colors
Given the admin clicks a date, Then the input value updates and calendar closes

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Flatpickr CDN links in admin.html
  - Flatpickr initialization on date input
  - GGF theme CSS overrides
  - dateFormat: 'Y-m-d'

Must-not-have:
  - Native date input fallback
  - Hardcoded colors (use CSS variables)

Open question risks:
  - CDN availability → if wrong: offline usage breaks date picker

Rollback note:
  - Remove Flatpickr script/CSS tags from admin.html

Red flags:
  - Work outside listed files → DONE_WITH_CONCERNS

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: CDN assumption proves wrong
Escalate when: constraint violated

---

## Plan Summary

| Task | Name | Depends | Complexity | Key Verification |
|------|------|---------|------------|-----------------|
| T1 | CSS Theme Rebranding | prereq | lightweight | Header #006B3F, status badges correct colors |
| T2 | Navigation Bar | T1 | standard | Nav on all pages, responsive hamburger |
| T3 | Status Flow | T1 | standard | 4 status buttons, free transition |
| T4 | Sort by Visit Date | T3 | standard | Today first, future ascending, past descending |
| T5 | Date Picker Fix | T1 | lightweight | Flatpickr opens, GGF themed |

```
