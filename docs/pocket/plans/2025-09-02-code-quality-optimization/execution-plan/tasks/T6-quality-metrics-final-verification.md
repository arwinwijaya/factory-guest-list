# Task T6 — Quality Metrics & Final Verification

**Phase:** 1
**Depends:** T3, T5
**Source plan:** ../../execution-plan.md

---

### Pocket Packet

### Task 6: Quality Metrics & Final Verification [depends: T3, T5]

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
