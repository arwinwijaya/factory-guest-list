# Task T3 — CSS Cleanup

**Phase:** 1
**Depends:** T1
**Source plan:** ../../execution-plan.md

---

### Pocket Packet

### Task 3: CSS Cleanup [depends: T1] [parallel: T2]

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
