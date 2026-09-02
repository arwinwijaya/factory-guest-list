# Task T5 — Selective Extraction — Guest Data Domain

**Phase:** 1
**Depends:** T4
**Source plan:** ../../execution-plan.md

---

### Pocket Packet

### Task 5: Selective Extraction — Guest Data Domain [depends: T4]

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
