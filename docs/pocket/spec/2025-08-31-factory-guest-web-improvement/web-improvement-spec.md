# Factory Guest List — Web Improvement

**Date:** 2025-08-31
**Status:** draft
**Author:** brainstorm session
**Spec path:** docs/pocket/spec/2025-08-31-factory-guest-web-improvement/web-improvement-spec.md

---

## Summary

Web Daftar Tamu Factory perlu di-improve agar sesuai brand GGF: (1) theme warna mengikuti logo GGF, (2) navigation bar di semua halaman, (3) status Active/On-Going/Reschedule/Cancel dengan sort by tanggal terdekat, (4) fix date picker yang tidak berfungsi.

---

## Context

### Current State
- 3 halaman: login.html, admin.html, display.html
- Theme: Dark (black/gold airport board aesthetic)
- Status: 3 status (Menunggu, Meeting, Selesai) — cycle-based
- Date picker: Native `<input type="date">` — broken di Firefox
- Navigation: Text links di admin header only
- Storage: localStorage (no backend)

### Problem / Motivation
1. Theme tidak sesuai brand GGF — tampilan gelap tidak mencerminkan identitas perusahaan
2. Navigasi antar halaman tidak intuitif — user harus edit URL manual
3. Status terbatas (hanya 3) — tidak fleksibel untuk kebutuhan bisnis
4. Date picker tidak berfungsi di Firefox — admin tidak bisa pilih tanggal

### Related Areas
- `css/style.css` — CSS variables untuk theming
- `js/app.js` — Auth, CRUD, display logic, status flow
- `admin.html` — Form tambah tamu, tabel daftar tamu
- `display.html` — Display board (auto-refresh 30 detik)
- `login.html` — Authentication

---

## Scope

### In-Scope
- Custom CSS theme berdasarkan warna GGF (hijau, oranye, kuning, biru)
- Navigation bar di semua halaman (Login, Admin, Display)
- Logo GGF di navigation bar semua halaman
- Status: Active, On-Going, Reschedule, Cancel (replace total status lama)
- Default status saat tambah tamu: "Active"
- Admin ganti status via 4 tombol terpisah
- Sort by tanggal kunjungan terdekat (future dates ascending, past dates descending)
- Fix date picker pakai Flatpickr library
- Flatpickr di-theme dengan warna GGF
- Responsive design (mobile ≤768px, desktop >768px)

### Out-of-Scope
- Backend/database migration (tetap localStorage)
- Fitur baru selain 4 improvement di atas
- Mobile app atau PWA
- Multi-user/role-based access
- Data migration script untuk data lama (data lama diabaikan)
- Perubahan localStorage schema (hanya nilai status yang berubah)

---

## Architecture Constraints

- Layers this work may touch: CSS (theme), HTML (navigation, form), JS (status, sorting, date picker)
- Layers this work must NOT touch: localStorage schema structure
- Patterns that must be followed: Vanilla JS (no frameworks), CSS variables, responsive design, existing file structure
- Architecture validation result: PASS

---

## Dependencies

### Existing (to leverage)
- CSS variables (`:root`) — untuk theme system
- localStorage API — untuk data persistence
- `formatDateShort()` — untuk format tanggal di tabel

### New (proposed)
- **flatpickr@4.6.13** — Date picker library yang reliable cross-browser; 15KB gzipped; alternatives rejected: native `<input type="date">` (broken di Firefox), custom date picker (too much effort, maintenance burden)

---

## Stories + Scenarios

### Story 1: Theme Rebranding
> As a user, I want the web to use GGF brand colors, so that it looks professional and consistent with the company identity.

**Rule 1: Primary color is GGF green**
- Example A: Header background → #006B3F
- Example B: Active status badge → #006B3F

**Rule 2: Accent colors match logo**
- Example A: On-Going status → orange (#F5A623)
- Example B: Reschedule status → yellow (#C4D600)
- Example C: Cancel status → blue (#4ECDC4)

**Rule 3: Light background**
- Example A: Page background → #f5f5f5
- Example B: Card background → #ffffff

```gherkin
Scenario: Header displays GGF green
  Given the user is on any page
  Then the navigation bar background is #006B3F

Scenario: Status badges use brand colors
  Given a guest has status "On-Going"
  Then the status badge background is rgba(245, 166, 35, 0.2)
  And the status badge text is #F5A623
  And the status badge border is #F5A623
```

### Story 2: Navigation Bar
> As a user, I want a navigation bar on all pages, so that I can easily switch between Login, Admin, and Display.

**Rule 1: Navigation appears on all pages**
- Example A: Login page → nav bar visible with logo + 3 links
- Example B: Admin page → nav bar visible with logo + 3 links
- Example C: Display page → nav bar visible with logo + 3 links

**Rule 2: Current page is highlighted**
- Example A: On Admin page → "Admin" link highlighted
- Example B: On Display page → "Display" link highlighted

**Rule 3: Navigation is responsive**
- Example A: Desktop → horizontal nav bar
- Example B: Mobile (≤768px) → hamburger menu

```gherkin
Scenario: Navigation bar appears on all pages
  Given the user is on the Login page
  Then the navigation bar is visible
  And the navigation bar contains the GGF logo image

Scenario: Navigation links work correctly
  Given the user is on the Admin page
  When the user clicks "Display" in the navigation
  Then the user is redirected to display.html

Scenario: Current page is highlighted
  Given the user is on the Admin page
  Then the "Admin" link has a highlight style (white text, bold)

Scenario: Navigation collapses on mobile
  Given the user is on a mobile device (viewport ≤ 768px)
  Then the navigation bar shows a hamburger menu icon
  When the user clicks the hamburger menu
  Then the navigation links are displayed vertically
```

### Story 3: Status Flow
> As an admin, I want to set guest status to Active/On-Going/Reschedule/Cancel, so that I can accurately track visitor status.

**Rule 1: Status options are Active, On-Going, Reschedule, Cancel**
- Example A: New guest → default "Active"
- Example B: Status badge shows correct label and color

**Rule 2: Admin changes status via 4 separate buttons**
- Example A: Click "On-Going" button → status changes to "On-Going"
- Example B: Click "Cancel" button → status changes to "Cancel"

**Rule 3: Status transition is free (any to any)**
- Example A: From "Cancel" → can go to "Active"
- Example B: From "Active" → can go to "Reschedule"

**Rule 4: Display board shows all statuses**
- Example A: Guest with "Cancel" status → still appears on display
- Example B: Guest with "Reschedule" status → still appears on display

```gherkin
Scenario: New guest gets Active status
  Given the admin is on the Admin page
  When the admin submits a new guest form
  Then the guest is added with status "Active"

Scenario: Admin changes guest status via buttons
  Given the admin is on the Admin page
  And there is a guest with status "Active"
  When the admin clicks the "On-Going" button for that guest
  Then the status changes to "On-Going"

Scenario: Status can be changed to any value
  Given a guest has status "Cancel"
  When the admin clicks the "Active" button
  Then the status changes to "Active"

Scenario: Status badge displays correct color
  Given a guest has status "Reschedule"
  Then the status badge background is rgba(196, 214, 0, 0.2)
  And the status badge text is #C4D600
  And the status badge border is #C4D600

Scenario: All statuses appear on Display board
  Given there are guests with statuses "Active", "On-Going", "Reschedule", "Cancel"
  When the display board loads
  Then all 4 guests appear in the table
```

### Story 4: Sort by Visit Date
> As a user, I want guests sorted by nearest visit date, so that I can see upcoming visitors first.

**Rule 1: Future dates sorted ascending (nearest first)**
- Example A: Dates "2025-09-01", "2025-09-15" → "2025-09-01" first

**Rule 2: Today's guests appear first**
- Example A: Today "2025-08-31", future "2025-09-05", past "2025-08-25" → order: today, future, past

**Rule 3: Past dates sorted descending (most recent first)**
- Example A: Past dates "2025-08-20", "2025-08-25" → "2025-08-25" first

**Rule 4: Same date sorted by creation time (newest first)**
- Example A: Two guests on "2025-09-01", created at 10:00 and 14:00 → 14:00 first

```gherkin
Scenario: Guests sorted by nearest date
  Given there are guests with dates "2025-09-15", "2025-09-01", "2025-08-20"
  When the display board loads
  Then the order is "2025-09-01", "2025-09-15", "2025-08-20"

Scenario: Today's guests appear first
  Given today is "2025-08-31"
  And there are guests with dates "2025-09-05", "2025-08-31", "2025-08-25"
  When the display board loads
  Then the order is "2025-08-31", "2025-09-05", "2025-08-25"

Scenario: Same date sorted by creation time
  Given two guests both have date "2025-09-01"
  And guest A was created at "10:00" and guest B was created at "14:00"
  When the display board loads
  Then guest B appears before guest A
```

### Story 5: Date Picker Fix
> As an admin, I want the date picker popup to work, so that I can easily select visit dates.

**Rule 1: Clicking date input opens calendar popup**
- Example A: Click date input → Flatpickr calendar appears

**Rule 2: Works on all browsers**
- Example A: Firefox → calendar popup appears (not just text cursor)

**Rule 3: Styled with GGF theme**
- Example A: Calendar header → GGF green (#006B3F)
- Example B: Selected date highlight → GGF orange (#F5A623)

**Rule 4: Admin can select date by clicking calendar**
- Example A: Click "15" → input shows "2025-09-15"

```gherkin
Scenario: Date picker opens on click
  Given the admin is on the Admin page
  When the admin clicks the date input field
  Then the Flatpickr calendar popup appears

Scenario: Date picker works on Firefox
  Given the admin is using Firefox browser
  When the admin clicks the date input field
  Then the calendar popup appears

Scenario: Date picker styled with GGF theme
  Given the calendar popup is open
  Then the calendar header background is #006B3F
  And the selected date background is #F5A623

Scenario: Admin selects a date
  Given the calendar popup is open
  When the admin clicks on day "15"
  Then the date input value is "2025-09-15"
  And the calendar popup closes
```

---

## Acceptance Criteria

```
Rule: Theme Rebranding
  ✓ Given the user is on any page, Then the navigation bar background is #006B3F
  ✓ Given a guest has status "Active", Then the badge color is #006B3F with white text
  ✓ Given a guest has status "On-Going", Then the badge color is #F5A623
  ✓ Given a guest has status "Reschedule", Then the badge color is #C4D600
  ✓ Given a guest has status "Cancel", Then the badge color is #4ECDC4
  ✓ Given the user is on any page, Then the page background is light (#f5f5f5)

Rule: Navigation Bar
  ✓ Given the user is on any page, Then the navigation bar is visible with GGF logo
  ✓ Given the user clicks a navigation link, Then the user is redirected to the correct page
  ✓ Given the user is on the current page, Then the corresponding nav link is highlighted
  ✓ Given the user is on mobile (≤768px), Then the navigation collapses to hamburger menu

Rule: Status Flow
  ✓ Given a new guest is added, Then the default status is "Active"
  ✓ Given the admin clicks a status button, Then the status changes to the selected value
  ✓ Given a guest has any status, Then the admin can change to any other status
  ✓ Given a guest has any status, Then the badge displays the correct label and color

Rule: Sort by Visit Date
  ✓ Given guests with different dates, Then future dates appear first (ascending)
  ✓ Given guests with different dates, Then past dates appear after future (descending)
  ✓ Given today's date, Then today's guests appear first
  ✓ Given same-date guests, Then newer creation time appears first

Rule: Date Picker
  ✓ Given the admin clicks the date input, Then the Flatpickr calendar appears
  ✓ Given Firefox browser, Then the calendar popup appears
  ✓ Given the calendar is open, Then it displays with GGF theme colors
  ✓ Given the admin clicks a date, Then the input value updates and calendar closes
```

---

## Design Decision

**Chosen option:** Option A — CSS Variables + Flatpickr + Vanilla JS

**Summary:** Theme via CSS custom properties mapped to GGF colors. Flatpickr for date picker. Status change via 4 separate buttons. Sort logic in vanilla JS.

**Rejected options:**
- Option B (Pico CSS): rejected because Pico's opinions on spacing/typography conflict with GGF brand requirements
- Option C (Full Custom): rejected because building a reliable cross-browser date picker is 200+ lines of code and defeats the purpose of fixing the broken native date picker

**Key tradeoffs accepted:**
- Flatpickr adds 15KB gzipped dependency — acceptable for reliable cross-browser date picker
- More custom CSS to write — acceptable for full brand control
- Old localStorage data will be ignored — acceptable per user decision

---

## Open Questions / Assumptions

| Question | Resolution | Risk if Wrong |
|----------|------------|---------------|
| How to handle old localStorage data? | Assumed: old data ignored, only new data uses new status values | Old data will show broken/missing badges |
| Should Flatpickr be loaded from CDN or local copy? | Assumed: CDN with local fallback | Offline usage might break date picker |
| What about export/import JSON with old status values? | Assumed: import will work, old status values will show as unknown | Imported data might have broken badges |

---

## Implementation Notes

1. Flatpickr should be loaded via CDN: `https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js` + CSS
2. Add Flatpickr initialization in `admin.html` script section after form reset
3. CSS variables should be updated in `:root` to match GGF colors
4. Status buttons should be added in the action column of the guest table
5. Sort logic should be added in `app.js` as a new function `sortGuestsByDate()`
6. Navigation bar should be a reusable HTML block included in all 3 pages
7. Responsive hamburger menu should use CSS only (no JS toggle needed for simple nav)

---

## Rollback Plan

1. Revert CSS variables to original dark theme values
2. Remove Flatpickr script/CSS tags from admin.html
3. Restore original status flow (menunggu/meeting/selesai cycle)
4. Remove navigation bar HTML from all pages
5. Restore original sort logic (newest first)
