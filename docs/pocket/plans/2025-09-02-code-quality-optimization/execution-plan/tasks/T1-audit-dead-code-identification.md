# Task T1 — Audit & Dead Code Identification

**Phase:** 1
**Depends:** none
**Source plan:** ../../execution-plan.md

---

### Pocket Packet

### Task 1: Audit & Dead Code Identification [prereq]

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
