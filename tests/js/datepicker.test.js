import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '../../');

// ============================================
// Helper: Create a DOM environment with Flatpickr loaded
// ============================================
function createFlatpickrEnv() {
  const flatpickrCss = readFileSync(
    resolve(root, 'node_modules/flatpickr/dist/flatpickr.min.css'),
    'utf-8'
  );

  const dom = new JSDOM(`<!DOCTYPE html>
<html>
<head><style>${flatpickrCss}</style></head>
<body>
  <input type="text" id="tanggal" name="tanggal">
</body>
</html>`, {
    url: 'http://localhost/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
  });

  const { window } = dom;

  // Load Flatpickr source into the JSDOM window
  const flatpickrJs = readFileSync(
    resolve(root, 'node_modules/flatpickr/dist/flatpickr.min.js'),
    'utf-8'
  );
  window.eval(flatpickrJs);

  return { window, document: window.document };
}

// ============================================
// Helper: Read a file as UTF-8
// ============================================
function readFile(relPath) {
  return readFileSync(resolve(root, relPath), 'utf-8');
}

// ============================================
// Cycle 1: Date picker opens on click
// ============================================
describe('Cycle 1: Date picker opens on click', () => {
  it('Given the admin is on the Admin page, When the admin clicks the date input, Then the Flatpickr calendar popup appears', () => {
    const { window, document } = createFlatpickrEnv();

    // Verify Flatpickr is loaded
    expect(typeof window.flatpickr).toBe('function');

    // Initialize Flatpickr on the date input
    const fp = window.flatpickr('#tanggal', {
      dateFormat: 'Y-m-d',
      defaultDate: 'today',
    });

    // Verify instance was created
    expect(fp).toBeDefined();
    expect(fp.isOpen).toBe(false);

    // Open the picker
    fp.open();

    // Verify calendar popup is visible
    const calendarEl = document.querySelector('.flatpickr-calendar');
    expect(calendarEl).not.toBeNull();
    // After open(), calendar should have the 'open' class
    expect(calendarEl.classList.contains('open')).toBe(true);

    fp.destroy();
  });

  it('Flatpickr is loaded from CDN as a global function', () => {
    // Check that admin.html references the Flatpickr CDN
    const adminHtml = readFile('admin.html');

    // Check for Flatpickr CSS CDN link
    expect(adminHtml).toContain('flatpickr/dist/flatpickr.min.css');
    // Check for Flatpickr JS CDN link
    expect(adminHtml).toContain('flatpickr/dist/flatpickr.min.js');
  });

  it('Flatpickr is initialized on the #tanggal input in admin.html', () => {
    const adminHtml = readFile('admin.html');

    // Check that Flatpickr is initialized on the date input
    expect(adminHtml).toContain("flatpickr('#tanggal'");
    // Check that dateFormat is set to 'Y-m-d'
    expect(adminHtml).toContain("dateFormat: 'Y-m-d'");
  });

  it('Flatpickr has minDate set to today to prevent past date selection', () => {
    const adminHtml = readFile('admin.html');

    // Check that minDate is set to 'today'
    expect(adminHtml).toContain("minDate: 'today'");
  });
});

// ============================================
// Cycle 2: Date picker styled with GGF theme
// ============================================
describe('Cycle 2: Date picker styled with GGF theme', () => {
  it('Given the CSS file is loaded, When we check for Flatpickr overrides, Then `.flatpickr-months .flatpickr-month` has `background-color: var(--primary-color)`', () => {
    const css = readFile('css/style.css');

    // Check that Flatpickr month header uses GGF primary color
    expect(css).toContain('.flatpickr-months .flatpickr-month');
    expect(css).toContain('background-color: var(--primary-color)');
  });

  it('Given the CSS file is loaded, When we check for selected day style, Then selected days use accent-orange color', () => {
    const css = readFile('css/style.css');

    // Check that selected day uses GGF accent orange
    expect(css).toContain('span.flatpickr-day.selected');
    expect(css).toContain('var(--accent-orange)');
  });

  it('Given the CSS file is loaded, When we check for hover style, Then hover uses accent-orange transparency', () => {
    const css = readFile('css/style.css');

    // Check hover style for Flatpickr days
    expect(css).toContain('span.flatpickr-day:hover');
    expect(css).toContain('rgba(245, 166, 35,');
  });

  it('Given the CSS file is loaded, When we check for calendar border-radius, Then the calendar has rounded corners', () => {
    const css = readFile('css/style.css');

    // Check calendar border-radius
    expect(css).toContain('.flatpickr-calendar');
    expect(css).toContain('border-radius: 8px');
  });

  it('Given the CSS file is loaded, When we check month dropdown color, Then the month dropdown text is white', () => {
    const css = readFile('css/style.css');

    // Check month dropdown text color
    expect(css).toContain('.flatpickr-current-month .flatpickr-monthDropdown-months');
    expect(css).toContain('color: white');
  });
});

// ============================================
// Cycle 3: Admin selects a date updates input value
// ============================================
describe('Cycle 3: Admin selects a date updates input value', () => {
  it('Given Flatpickr is initialized on date input, When a date is selected programmatically via flatpickr.setDate(), Then the input value is the selected date', () => {
    const { window, document } = createFlatpickrEnv();

    // Initialize Flatpickr with Y-m-d format
    const fp = window.flatpickr('#tanggal', {
      dateFormat: 'Y-m-d',
    });

    // Set date programmatically
    fp.setDate('2025-09-15', true);

    // Verify the input value is updated
    const input = document.getElementById('tanggal');
    expect(input.value).toBe('2025-09-15');

    fp.destroy();
  });

  it('Given Flatpickr is initialized, When setDate is called with today, Then the input value matches today in Y-m-d format', () => {
    const { window, document } = createFlatpickrEnv();

    const fp = window.flatpickr('#tanggal', {
      dateFormat: 'Y-m-d',
    });

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    fp.setDate('today', true);

    const input = document.getElementById('tanggal');
    expect(input.value).toBe(todayStr);

    fp.destroy();
  });

  it('Given admin.html initializes Flatpickr with defaultDate today, When page loads, Then the date input has a value', () => {
    const adminHtml = readFile('admin.html');

    // Check that Flatpickr initialization includes defaultDate
    expect(adminHtml).toContain("defaultDate: 'today'");
  });

  it('Form submission still reads the correct value from the input', () => {
    const { window, document } = createFlatpickrEnv();

    const fp = window.flatpickr('#tanggal', {
      dateFormat: 'Y-m-d',
    });

    fp.setDate('2025-10-01', true);

    const input = document.getElementById('tanggal');
    expect(input.value).toBe('2025-10-01');
    expect(input.name).toBe('tanggal');

    fp.destroy();
  });
});
