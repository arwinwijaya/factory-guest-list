# EXECUTION PLAN — Code Quality Optimization

**Date:** 2025-09-02
**Spec:** docs/pocket/spec/2025-09-02-code-quality-optimization/code-quality-optimization.md
**Status:** draft
**Total tasks:** 6
**Test Framework:** Vitest + JSDOM

---

## Execution Overview

### Recommended Order
```
T1 → T2, T3 (parallel) → T4 → T5 → T6
```

> Dependency order above is **recommended** — pocket skill enforces actual parallelism and sequencing based on its routing logic.

### Parallelizable Groups
| Group | Tasks | Unblocked After |
|-------|-------|------------------|
| Group A | T2, T3 | T1 completes |

### Constraints Reminder
**Architecture:** Global functions, inline `<script>`, client-side only
**Out-of-scope:** display.html, login.html, ES Modules, build step, new features
**Assumptions at risk:** Domain mana yang paling besar? (assumed: Guest Data), Berapa banyak dead code? (assumed: 5-10 fungsi)
**Sequencing:** Dependency order shown is recommended only — pocket enforces actual blocking rules.

### File Structure Map
```
Rule: Dead Code Removal
  Create: js/deprecated.js                    (created by: T2)
  Modify: js/app.js                          (modified by: T2, T4, T5)
  Modify: admin.html                         (modified by: T2, T5)
  Test:   tests/js/status.test.js

Rule: Code Organization
  Modify: js/app.js                          (modified by: T4)
  Test:   tests/js/status.test.js

Rule: CSS Cleanup
  Modify: css/style.css                      (modified by: T3)
  Test:   tests/css/style.test.js

Rule: Selective Extraction
  Create: js/guest-data.js                   (created by: T5)
  Modify: js/app.js                          (modified by: T5)
  Modify: admin.html                         (modified by: T5)
  Modify: display.html                       (modified by: T5)
  Test:   tests/js/status.test.js

Rule: Quality Metrics
  Create: docs/pocket/spec/2025-09-02-code-quality-optimization/metrics-report.md  (created by: T6)
  Test:   tests/js/status.test.js, tests/css/style.test.js
```

---

## Pocket Packets

---

### Task 1: Audit & Dead Code Identification [prereq]
---

## OBJECTIVE
Audit codebase to identify dead code, unused CSS selectors, and naming inconsistencies. This is a read-only analysis task — no code changes.

Files:
- Read: `js/app.js`, `css/style.css`, `admin.html`, `display.html`, `login.html`
- Create: `docs/pocket/spec/2025-09-02-code-quality-optimization/audit-results.md`

Steps:
1. Scan all functions in `js/app.js` for references:
   - Check `js/app.js` internal calls
   - Check `admin.html` inline script
   - Check `admin.html` inline handlers (`onclick=`, `onchange=`, `oninput=`)
   - Check `display.html` inline script and handlers
   - Check `login.html` inline script and handlers

2. Identify unused functions (zero references):
   - List function name, line number, and domain category
   - Mark as "dead code candidate"

3. Identify CSS selectors not used in:
   - `admin.html` class attributes
   - `display.html` class attributes
   - `login.html` class attributes
   - `js/app.js` `classList.add()` / `className` assignments

4. Check naming consistency:
   - Flag any non-camelCase function names
   - Flag any inconsistent naming patterns

5. Write audit results to `audit-results.md`

6. Commit:
   `git add docs/pocket/spec/2025-09-02-code-quality-optimization/audit-results.md`
   `git commit -m "docs(audit): add dead code and CSS analysis results"`

## REFERENCES LOADED
- `js/app.js` — 44 functions, 831 lines
- `css/style.css` — 73 selectors, 976 lines
- `admin.html` — inline script with showNotification, removeGuest, handleImport, debouncedSearch

## WHY THIS APPROACH
Justification: Audit must happen before any changes to avoid breaking working code
Complexity: lightweight (read-only)

## SANDWICH CONTEXT
[CRITICAL: No code changes in this task — analysis only]
You are performing audit for Code Quality Optimization.
Spec: docs/pocket/spec/2025-09-02-code-quality-optimization/code-quality-optimization.md
Design decision: Option C — Hybrid (Cleanup + Selective Extraction)
Files in scope: js/app.js, css/style.css, admin.html, display.html, login.html (read-only)
Test framework: Vitest + JSDOM
Available after: none (prereq)
Architecture rule: Must NOT modify any files except audit-results.md
[RESTATE: No code changes in this task — analysis only]

## DELIVERABLE
Verification — task is DONE when all pass:

Given app.js has 44 functions, When audit runs, Then each function is categorized by domain
Given function with zero references, When audit runs, Then function listed as dead code candidate
Given function referenced in HTML onclick, When audit runs, Then function preserved
Given CSS selector not in HTML or JS, When audit runs, Then selector listed for removal
Given non-camelCase function, When audit runs, Then function flagged

All tests PASS. Commit exists with message matching `docs(audit): add dead code and CSS analysis results`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - All 44 functions categorized
  - Dead code candidates identified with evidence
  - Unused CSS selectors identified with evidence
  - Naming inconsistencies flagged
  - Audit results written to file

Must-not-have:
  - Any code changes
  - Any file modifications (except audit-results.md)
  - Assumptions without evidence

Open question risks:
  - Domain mana yang paling besar? → assumed: Guest Data (paling banyak fungsi)

Rollback note:
  - N/A (read-only task)

## STOP CONDITIONS
Done when: audit-results.md is complete with all categories
Uncertain when: function reference is ambiguous
Escalate when: need to modify source files (out of scope for this task)

---

### Task 2: Dead Code Removal & showNotification Migration [depends: T1]
---

## OBJECTIVE
Move dead code functions to `js/deprecated.js` and migrate `showNotification` from `admin.html` to `js/app.js`.

Files:
- Create: `js/deprecated.js`
- Modify: `js/app.js` (remove deprecated functions, add showNotification)
- Modify: `admin.html` (remove showNotification definition)
- Test: `tests/js/status.test.js`

Steps:
1. Write failing test for: deprecated functions are accessible in deprecated.js
   Test file: `tests/js/status.test.js`
   Level: unit

   Test intent:
   Given deprecated.js contains function "X"
   When deprecated.js is loaded
   Then function "X" is accessible on window

   Exercise through:
   - window.eval(deprecatedJs)

   Test doubles:
   - do NOT mock: deprecated.js functions

   Expected RED:
   - deprecated.js does not exist yet

2. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: deprecated.js not found

3. Implement minimal code to satisfy the test:
   File: `js/deprecated.js`
   Implement: Create file with dead code functions from audit (T1)

4. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

5. Write failing test for: showNotification exists in app.js
   Test file: `tests/js/status.test.js`
   Level: unit

   Test intent:
   Given app.js is loaded
   When showNotification is called
   Then function exists and executes without error

   Exercise through:
   - window.showNotification('test')

   Test doubles:
   - mock: DOM elements for notification

   Expected RED:
   - showNotification not in app.js yet

6. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: showNotification is not a function

7. Implement minimal code to satisfy the test:
   File: `js/app.js`
   Implement: Move showNotification from admin.html to app.js

   File: `admin.html`
   Implement: Remove showNotification definition from inline script

8. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

9. Refactor while green (bounded):
   - Verify all 157 tests still pass
   - Re-run test: `npx vitest run` — must stay PASS

10. Commit:
    `git add js/deprecated.js js/app.js admin.html tests/js/status.test.js`
    `git commit -m "refactor(cleanup): move dead code to deprecated.js and migrate showNotification"`

## REFERENCES LOADED
- `js/app.js` — functions to audit for dead code
- `admin.html` — showNotification definition at line ~282
- `tests/js/status.test.js` — existing test patterns

## WHY THIS APPROACH
Justification: Dead code removal reduces app.js size; showNotification migration fixes cross-file dependency
Complexity: standard (multi-file coordination)

## SANDWICH CONTEXT
[CRITICAL: All 157 tests must pass after changes]
You are implementing dead code removal for Code Quality Optimization.
Spec: docs/pocket/spec/2025-09-02-code-quality-optimization/code-quality-optimization.md
Design decision: Option C — Hybrid (Cleanup + Selective Extraction)
Files in scope: js/deprecated.js, js/app.js, admin.html, tests/js/status.test.js
Test framework: Vitest + JSDOM
Available after: T1 (audit results)
Architecture rule: Global functions, inline <script>, client-side only
[RESTATE: All 157 tests must pass after changes]

## DELIVERABLE
Verification — task is DONE when all pass:

Given function with zero references, When deprecation executed, Then function in deprecated.js
Given function referenced in HTML onclick, When deprecation executed, Then function preserved in app.js
Given showNotification in admin.html, When migration executed, Then showNotification in app.js
Given deprecated.js loaded, When tests run, Then all 157 tests pass

All tests PASS. Commit exists with message matching `refactor(cleanup): move dead code to deprecated.js and migrate showNotification`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Dead code functions moved to deprecated.js
  - showNotification moved to app.js
  - admin.html no longer defines showNotification
  - All 157 tests pass
  - Tests written BEFORE implementation (TDD)

Must-not-have:
  - Functions with references moved to deprecated.js
  - Breaking any existing functionality
  - Modifications to display.html or login.html

Open question risks:
  - Berapa banyak fungsi yang dead code? → assumed: 5-10 fungsi (from audit T1)

Rollback note:
  - Revert commit to restore original app.js and admin.html

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: audit results unclear about function usage
Escalate when: tests fail after changes

---

### Task 3: CSS Cleanup [depends: T1] [parallel: T2]
---

## OBJECTIVE
Remove unused CSS selectors from `css/style.css` based on audit results from T1.

Files:
- Modify: `css/style.css` (remove unused selectors)
- Test: `tests/css/style.test.js`

Steps:
1. Write failing test for: unused selectors are removed
   Test file: `tests/css/style.test.js`
   Level: unit

   Test intent:
   Given selector ".X" is unused (from audit T1)
   When CSS cleanup is executed
   Then selector ".X" is not in style.css

   Exercise through:
   - getSelectorStyles(cssContent, '.X')

   Test doubles:
   - do NOT mock: CSS file

   Expected RED:
   - Selector still exists in style.css

2. Run test — verify FAIL:
   `npx vitest run tests/css/style.test.js`
   Expected failure: selector still exists

3. Implement minimal code to satisfy the test:
   File: `css/style.css`
   Implement: Remove unused selectors identified in T1 audit

4. Run test — verify PASS:
   `npx vitest run tests/css/style.test.js`
   Expected: PASS

5. Refactor while green (bounded):
   - Verify CSS variables in :root are preserved
   - Verify selectors used via classList.add() are preserved
   - Re-run test: `npx vitest run tests/css/style.test.js` — must stay PASS

6. Commit:
   `git add css/style.css tests/css/style.test.js`
   `git commit -m "refactor(css): remove unused selectors"`

## REFERENCES LOADED
- `css/style.css` — 73 selectors to audit
- `tests/css/style.test.js` — existing CSS test patterns
- `js/app.js` — check for classList.add() usage

## WHY THIS APPROACH
Justification: Unused CSS adds noise and maintenance burden
Complexity: lightweight (straightforward removal)

## SANDWICH CONTEXT
[CRITICAL: CSS variables and JS-used selectors must be preserved]
You are implementing CSS cleanup for Code Quality Optimization.
Spec: docs/pocket/spec/2025-09-02-code-quality-optimization/code-quality-optimization.md
Design decision: Option C — Hybrid (Cleanup + Selective Extraction)
Files in scope: css/style.css, tests/css/style.test.js
Test framework: Vitest + JSDOM
Available after: T1 (audit results)
Architecture rule: Must NOT touch display.html, login.html
[RESTATE: CSS variables and JS-used selectors must be preserved]

## DELIVERABLE
Verification — task is DONE when all pass:

Given unused selector from audit, When cleanup executed, Then selector removed
Given selector used via classList.add(), When cleanup executed, Then selector preserved
Given CSS variable in :root, When cleanup executed, Then variable preserved if referenced
Given CSS tests, When cleanup complete, Then all CSS tests pass

All tests PASS. Commit exists with message matching `refactor(css): remove unused selectors`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Unused selectors removed
  - CSS variables preserved
  - JS-used selectors preserved
  - All CSS tests pass
  - Tests written BEFORE implementation (TDD)

Must-not-have:
  - Removing selectors used via classList.add()
  - Removing CSS variables referenced by Flatpickr
  - Modifications to HTML files

Open question risks:
  - Apakah ada naming inconsistencies? → assumed: beberapa (perlu audit T1)

Rollback note:
  - Revert commit to restore original style.css

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: selector usage is ambiguous
Escalate when: CSS tests fail after changes

---

### Task 4: Code Organization & Reorganization [depends: T2]
---

## OBJECTIVE
Reorganize `js/app.js` functions by domain with frequency-based ordering within each group.

Files:
- Modify: `js/app.js` (reorganize function order, add domain headers)
- Test: `tests/js/status.test.js`

Steps:
1. Write failing test for: functions are grouped by domain
   Test file: `tests/js/status.test.js`
   Level: unit

   Test intent:
   Given app.js is loaded
   When file is parsed
   Then domain headers exist: UX ENHANCEMENT, AUTH, GUEST DATA, etc.

   Exercise through:
   - Read app.js content and check for domain headers

   Test doubles:
   - do NOT mock: app.js

   Expected RED:
   - Domain headers not in consistent format

2. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: domain headers not found

3. Implement minimal code to satisfy the test:
   File: `js/app.js`
   Implement: Reorganize functions under domain headers with format `// === DOMAIN NAME ===`

   Domain groups:
   - UX ENHANCEMENT (search, pagination, modal, loading, render)
   - AUTH (login, logout, isLoggedIn, checkAuth)
   - GUEST DATA (getGuests, saveGuests, addGuest, deleteGuest, etc.)
   - UTILITIES (getTodayStr, generateId, formatDate, etc.)
   - STATUS HELPERS (getStatusLabel, getStatusClass, changeStatus)
   - EXPORT/IMPORT (exportToJSON, importFromJSON)
   - SORT (sortGuestsByDate)
   - DISPLAY (createGuestRow, initClock, initDate, etc.)

4. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

5. Write failing test for: frequency ordering within groups
   Test file: `tests/js/status.test.js`
   Level: unit

   Test intent:
   Given Guest Data group
   When file is parsed
   Then getGuests() appears before getGuestById()

   Exercise through:
   - Read app.js content and check function order

   Test doubles:
   - do NOT mock: app.js

   Expected RED:
   - Function order not optimized

6. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: getGuests() not before getGuestById()

7. Implement minimal code to satisfy the test:
   File: `js/app.js`
   Implement: Reorder functions within each domain group by frequency of use

8. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

9. Refactor while green (bounded):
   - Verify all 157 tests still pass
   - Verify no functions were lost during reorganization
   - Re-run test: `npx vitest run` — must stay PASS

10. Commit:
    `git add js/app.js tests/js/status.test.js`
    `git commit -m "refactor(organize): group functions by domain with frequency ordering"`

## REFERENCES LOADED
- `js/app.js` — 44 functions to reorganize
- `tests/js/status.test.js` — existing test patterns

## WHY THIS APPROACH
Justification: Domain grouping improves navigation; frequency ordering puts常用 functions first
Complexity: standard (multi-step reorganization)

## SANDWICH CONTEXT
[CRITICAL: No functions may be lost during reorganization]
You are implementing code organization for Code Quality Optimization.
Spec: docs/pocket/spec/2025-09-02-code-quality-optimization/code-quality-optimization.md
Design decision: Option C — Hybrid (Cleanup + Selective Extraction)
Files in scope: js/app.js, tests/js/status.test.js
Test framework: Vitest + JSDOM
Available after: T2 (dead code removed, showNotification migrated)
Architecture rule: Global functions, inline <script>, client-side only
[RESTATE: No functions may be lost during reorganization]

## DELIVERABLE
Verification — task is DONE when all pass:

Given app.js functions, When reorganized, Then grouped by domain headers
Given Guest Data group, When reorganized, Then getGuests() before getGuestById()
Given all functions, When reorganization complete, Then no functions lost
Given all tests, When reorganization complete, Then all 157 tests pass

All tests PASS. Commit exists with message matching `refactor(organize): group functions by domain with frequency ordering`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Functions grouped by domain headers
  - Frequency ordering within groups
  - No functions lost during reorganization
  - All 157 tests pass
  - Tests written BEFORE implementation (TDD)

Must-not-have:
  - Losing any functions during reorganization
  - Changing function behavior
  - Breaking existing functionality

Open question risks:
  - Domain mana yang paling besar? → assumed: Guest Data (from audit T1)

Rollback note:
  - Revert commit to restore original app.js order

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: function categorization is ambiguous
Escalate when: tests fail after reorganization

---

### Task 5: Selective Extraction — Guest Data Domain [depends: T4]
---

## OBJECTIVE
Extract Guest Data functions from `js/app.js` to `js/guest-data.js` as a separate file. This is the largest domain and benefits most from extraction.

Files:
- Create: `js/guest-data.js`
- Modify: `js/app.js` (remove Guest Data functions)
- Modify: `admin.html` (add `<script src="js/guest-data.js">` before app.js)
- Modify: `display.html` (add `<script src="js/guest-data.js">` before app.js)
- Test: `tests/js/status.test.js`

Steps:
1. Write failing test for: Guest Data functions exist in guest-data.js
   Test file: `tests/js/status.test.js`
   Level: unit

   Test intent:
   Given guest-data.js is loaded
   When getGuests() is called
   Then function exists and executes without error

   Exercise through:
   - window.getGuests()

   Test doubles:
   - mock: localStorage

   Expected RED:
   - guest-data.js does not exist yet

2. Run test — verify FAIL:
   `npx vitest run tests/js/status.test.js`
   Expected failure: getGuests is not a function

3. Implement minimal code to satisfy the test:
   File: `js/guest-data.js`
   Implement: Move Guest Data functions from app.js:
   - getGuests, saveGuests, addGuest, deleteGuest, updateGuestStatus
   - getGuestById, getTodayGuests, cleanPastGuests, getGuestsByStatus
   - sortGuestsByDate

   File: `js/app.js`
   Implement: Remove Guest Data functions

   File: `admin.html`
   Implement: Add `<script src="js/guest-data.js"></script>` before app.js

   File: `display.html`
   Implement: Add `<script src="js/guest-data.js"></script>` before app.js

4. Run test — verify PASS:
   `npx vitest run tests/js/status.test.js`
   Expected: PASS

5. Refactor while green (bounded):
   - Verify all 157 tests still pass
   - Verify Guest Data functions work correctly from guest-data.js
   - Re-run test: `npx vitest run` — must stay PASS

6. Commit:
   `git add js/guest-data.js js/app.js admin.html display.html tests/js/status.test.js`
   `git commit -m "refactor(extract): move Guest Data functions to guest-data.js"`

## REFERENCES LOADED
- `js/app.js` — Guest Data functions to extract
- `admin.html` — script loading order
- `display.html` — script loading order

## WHY THIS APPROACH
Justification: Guest Data is the largest domain (~10 functions); extraction improves navigation
Complexity: standard (multi-file coordination)

## SANDWICH CONTEXT
[CRITICAL: All 157 tests must pass after extraction]
You are implementing selective extraction for Code Quality Optimization.
Spec: docs/pocket/spec/2025-09-02-code-quality-optimization/code-quality-optimization.md
Design decision: Option C — Hybrid (Cleanup + Selective Extraction)
Files in scope: js/guest-data.js, js/app.js, admin.html, display.html, tests/js/status.test.js
Test framework: Vitest + JSDOM
Available after: T4 (code reorganization complete)
Architecture rule: Global functions, inline <script>, client-side only
[RESTATE: All 157 tests must pass after extraction]

## DELIVERABLE
Verification — task is DONE when all pass:

Given Guest Data functions in app.js, When extraction executed, Then functions in guest-data.js
Given guest-data.js loaded, When getGuests() called, Then function executes correctly
Given admin.html, When page loads, Then guest-data.js loads before app.js
Given display.html, When page loads, Then guest-data.js loads before app.js
Given all tests, When extraction complete, Then all 157 tests pass

All tests PASS. Commit exists with message matching `refactor(extract): move Guest Data functions to guest-data.js`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Guest Data functions moved to guest-data.js
  - Script loading order correct in HTML files
  - All 157 tests pass
  - Tests written BEFORE implementation (TDD)

Must-not-have:
  - Breaking existing functionality
  - Wrong script loading order
  - Losing any functions during extraction

Open question risks:
  - Domain mana yang paling besar? → assumed: Guest Data (from audit T1)

Rollback note:
  - Revert commit to restore original app.js

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: extraction breaks existing functionality
Escalate when: tests fail after extraction

---

### Task 6: Quality Metrics & Final Verification [depends: T3, T5]
---

## OBJECTIVE
Measure refactor success and verify all tests pass. This is the final verification task.

Files:
- Read: `js/app.js`, `js/deprecated.js`, `css/style.css`
- Test: `tests/js/status.test.js`, `tests/css/style.test.js`

Steps:
1. Measure function count:
   - Count functions in `js/app.js`
   - Count functions in `js/deprecated.js`
   - Report reduction from original 44 functions

2. Measure line count:
   - Count lines in `js/app.js`
   - Report reduction from original 831 lines

3. Run all tests:
   `npx vitest run`
   Expected: All 157 tests pass

4. Verify CSS cleanup:
   - Count selectors in `css/style.css`
   - Report reduction from original 73 selectors

5. Write metrics report to `docs/pocket/spec/2025-09-02-code-quality-optimization/metrics-report.md`

6. Commit:
   `git add docs/pocket/spec/2025-09-02-code-quality-optimization/metrics-report.md`
   `git commit -m "docs(metrics): add refactor quality metrics report"`

## REFERENCES LOADED
- `js/app.js` — count functions and lines
- `js/deprecated.js` — count deprecated functions
- `css/style.css` — count selectors

## WHY THIS APPROACH
Justification: Metrics prove refactor achieved its goals
Complexity: lightweight (measurement only)

## SANDWICH CONTEXT
[CRITICAL: All 157 tests must pass]
You are measuring refactor success for Code Quality Optimization.
Spec: docs/pocket/spec/2025-09-02-code-quality-optimization/code-quality-optimization.md
Design decision: Option C — Hybrid (Cleanup + Selective Extraction)
Files in scope: js/app.js, js/deprecated.js, css/style.css (read-only)
Test framework: Vitest + JSDOM
Available after: T3, T5 (all refactoring complete)
Architecture rule: Must NOT modify source files
[RESTATE: All 157 tests must pass]

## DELIVERABLE
Verification — task is DONE when all pass:

Given 44 functions before, When refactor complete, Then count reported
Given 831 lines before, When refactor complete, Then reduction calculated
Given 157 tests before, When refactor complete, Then all tests pass
Given metrics report, When written, Then commit exists

All tests PASS. Commit exists with message matching `docs(metrics): add refactor quality metrics report`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Function count measured and reported
  - Line count measured and reported
  - All 157 tests pass
  - Metrics report written

Must-not-have:
  - Any code changes
  - Any file modifications (except metrics-report.md)

Open question risks:
  - None (measurement task)

Rollback note:
  - N/A (measurement task)

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, metrics report committed
Uncertain when: metrics don't show improvement
Escalate when: tests fail

---

## Plan Summary

| Task | Name | Dependencies | Key Verification |
|------|------|--------------|------------------|
| T1 | Audit & Dead Code Identification | prereq | All 44 functions categorized |
| T2 | Dead Code Removal & showNotification Migration | T1 | Dead code in deprecated.js, showNotification in app.js |
| T3 | CSS Cleanup | T1 | Unused selectors removed |
| T4 | Code Organization & Reorganization | T2 | Functions grouped by domain |
| T5 | Selective Extraction — Guest Data Domain | T4 | Guest Data functions in guest-data.js |
| T6 | Quality Metrics & Final Verification | T3, T5 | All 157 tests pass, metrics reported |

---

## QUALITY BAR (All Tasks)

Must-have:
- Tests written BEFORE implementation (TDD)
- All acceptance criteria from spec covered
- Commit message follows conventional commits format
- No modifications to display.html or login.html

Must-not-have:
- ES Modules conversion
- Build step introduction
- New feature additions
- Breaking existing functionality

Open question risks:
- Domain mana yang paling besar? → assumed: Guest Data
- Berapa banyak dead code? → assumed: 5-10 fungsi
- Naming inconsistencies? → assumed: beberapa

---

**Plan approved:** Awaiting user confirmation
