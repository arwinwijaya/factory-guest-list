# Task T4 — Code Organization & Reorganization

**Phase:** 1
**Depends:** T2
**Source plan:** ../../execution-plan.md

---

### Pocket Packet

### Task 4: Code Organization & Reorganization [depends: T2]

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
