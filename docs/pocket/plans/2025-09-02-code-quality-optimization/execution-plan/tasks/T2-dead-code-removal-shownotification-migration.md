# Task T2 — Dead Code Removal & showNotification Migration

**Phase:** 1
**Depends:** T1
**Source plan:** ../../execution-plan.md

---

### Pocket Packet

### Task 2: Dead Code Removal & showNotification Migration [depends: T1]

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
