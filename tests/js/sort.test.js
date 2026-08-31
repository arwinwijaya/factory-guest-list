import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '../../');

/**
 * Load app.js source code and evaluate it in a JSDOM environment.
 * Functions are exposed on window.
 */
function createAppEnv() {
  const appJs = readFileSync(resolve(root, 'js/app.js'), 'utf-8');

  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost/',
    runScripts: 'dangerously',
  });

  const { window } = dom;
  window.eval(appJs);

  return { window };
}

/**
 * Helper to create a mock guest object.
 */
function mockGuest(nama, tanggal, createdAt) {
  return {
    id: 'guest_' + Math.random().toString(36).substr(2, 9),
    nama,
    tanggal,
    perusahaan: 'PT Test',
    keperluan: 'Testing',
    status: 'active',
    createdAt: createdAt || new Date('2025-08-20T10:00:00').toISOString(),
  };
}

// ============================================
// Cycle 1: Guests sorted by nearest date
// ============================================
describe('Cycle 1: Guests sorted by nearest date', () => {
  it('Given guests with dates "2025-09-15", "2025-09-01", "2025-08-20", When sorted, Then the order is "2025-09-01", "2025-09-15", "2025-08-20"', () => {
    const { window } = createAppEnv();
    const sortGuestsByDate = window.sortGuestsByDate;
    expect(typeof sortGuestsByDate).toBe('function');

    const guests = [
      mockGuest('C', '2025-09-15'),
      mockGuest('A', '2025-09-01'),
      mockGuest('B', '2025-08-20'),
    ];

    const sorted = sortGuestsByDate(guests, '2025-08-31');

    expect(sorted[0].tanggal).toBe('2025-09-01'); // future, nearest
    expect(sorted[1].tanggal).toBe('2025-09-15'); // future, farther
    expect(sorted[2].tanggal).toBe('2025-08-20'); // past, only one
  });

  it('Given future dates ascending, When sorted, Then nearest future date appears first', () => {
    const { window } = createAppEnv();

    const guests = [
      mockGuest('Far', '2025-12-25'),
      mockGuest('Near', '2025-09-02'),
      mockGuest('Nearest', '2025-09-01'),
    ];

    const sorted = window.sortGuestsByDate(guests, '2025-08-31');

    expect(sorted[0].nama).toBe('Nearest');
    expect(sorted[1].nama).toBe('Near');
    expect(sorted[2].nama).toBe('Far');
  });
});

// ============================================
// Cycle 2: Today's guests appear first
// ============================================
describe('Cycle 2: Today\'s guests appear first', () => {
  it('Given today is "2025-08-31" and guests with dates "2025-09-05", "2025-08-31", "2025-08-25", When sorted, Then the order is today, future, past', () => {
    const { window } = createAppEnv();

    const guests = [
      mockGuest('Future', '2025-09-05'),
      mockGuest('Today', '2025-08-31'),
      mockGuest('Past', '2025-08-25'),
    ];

    const sorted = window.sortGuestsByDate(guests, '2025-08-31');

    expect(sorted[0].tanggal).toBe('2025-08-31'); // today first
    expect(sorted[1].tanggal).toBe('2025-09-05'); // future second
    expect(sorted[2].tanggal).toBe('2025-08-25'); // past last
  });

  it('Given multiple today guests, When sorted, Then all today guests appear before future and past', () => {
    const { window } = createAppEnv();

    const guests = [
      mockGuest('Future1', '2025-10-01'),
      mockGuest('Today1', '2025-08-31'),
      mockGuest('Past1', '2025-08-20'),
      mockGuest('Today2', '2025-08-31'),
    ];

    const sorted = window.sortGuestsByDate(guests, '2025-08-31');

    // First two should be today
    expect(sorted[0].tanggal).toBe('2025-08-31');
    expect(sorted[1].tanggal).toBe('2025-08-31');
    // Third should be future
    expect(sorted[2].tanggal).toBe('2025-10-01');
    // Fourth should be past
    expect(sorted[3].tanggal).toBe('2025-08-20');
  });

  it('Given past dates sorted descending, When sorted, Then most recent past appears first', () => {
    const { window } = createAppEnv();

    const guests = [
      mockGuest('Oldest', '2025-08-01'),
      mockGuest('Middle', '2025-08-15'),
      mockGuest('Recent', '2025-08-25'),
    ];

    const sorted = window.sortGuestsByDate(guests, '2025-08-31');

    // Past dates descending (most recent first)
    expect(sorted[0].tanggal).toBe('2025-08-25');
    expect(sorted[1].tanggal).toBe('2025-08-15');
    expect(sorted[2].tanggal).toBe('2025-08-01');
  });
});

// ============================================
// Cycle 3: Same date sorted by creation time
// ============================================
describe('Cycle 3: Same date sorted by creation time', () => {
  it('Given two guests with same date and different createdAt, When sorted, Then newer createdAt appears first', () => {
    const { window } = createAppEnv();

    const guests = [
      mockGuest('Older Created', '2025-09-01', '2025-08-20T10:00:00.000Z'),
      mockGuest('Newer Created', '2025-09-01', '2025-08-20T14:00:00.000Z'),
    ];

    const sorted = window.sortGuestsByDate(guests, '2025-08-31');

    expect(sorted[0].nama).toBe('Newer Created');
    expect(sorted[1].nama).toBe('Older Created');
  });

  it('Given multiple same-date guests, When sorted, Then all ordered by createdAt descending within the date group', () => {
    const { window } = createAppEnv();

    const guests = [
      mockGuest('Oldest', '2025-09-01', '2025-08-20T08:00:00.000Z'),
      mockGuest('Newest', '2025-09-01', '2025-08-20T16:00:00.000Z'),
      mockGuest('Middle', '2025-09-01', '2025-08-20T12:00:00.000Z'),
    ];

    const sorted = window.sortGuestsByDate(guests, '2025-08-31');

    expect(sorted[0].nama).toBe('Newest');
    expect(sorted[1].nama).toBe('Middle');
    expect(sorted[2].nama).toBe('Oldest');
  });

  it('Given today guests with same date, When sorted, Then newer createdAt appears first within today group', () => {
    const { window } = createAppEnv();

    const guests = [
      mockGuest('Today Old', '2025-08-31', '2025-08-31T08:00:00.000Z'),
      mockGuest('Today New', '2025-08-31', '2025-08-31T15:00:00.000Z'),
    ];

    const sorted = window.sortGuestsByDate(guests, '2025-08-31');

    expect(sorted[0].nama).toBe('Today New');
    expect(sorted[1].nama).toBe('Today Old');
  });

  it('Given past guests with same date, When sorted, Then newer createdAt appears first within past group', () => {
    const { window } = createAppEnv();

    const guests = [
      mockGuest('Past Old', '2025-08-10', '2025-08-10T09:00:00.000Z'),
      mockGuest('Past New', '2025-08-10', '2025-08-10T13:00:00.000Z'),
    ];

    const sorted = window.sortGuestsByDate(guests, '2025-08-31');

    expect(sorted[0].nama).toBe('Past New');
    expect(sorted[1].nama).toBe('Past Old');
  });
});

// ============================================
// Cycle 4: Display board uses sortGuestsByDate
// ============================================
describe('Cycle 4: Display board uses sortGuestsByDate', () => {
  it('Given display.html inline loadBoard function, When we read the source file, Then it contains a call to sortGuestsByDate()', () => {
    const displayHtml = readFileSync(resolve(root, 'display.html'), 'utf-8');
    expect(displayHtml).toContain('sortGuestsByDate(');
  });

  it('display.html no longer uses inline sort logic with dateB - dateA', () => {
    const displayHtml = readFileSync(resolve(root, 'display.html'), 'utf-8');
    expect(displayHtml).not.toContain('dateB - dateA');
  });

  it('sortGuestsByDate function is defined in app.js', () => {
    const appJs = readFileSync(resolve(root, 'js/app.js'), 'utf-8');
    expect(appJs).toContain('function sortGuestsByDate');
  });
});

// ============================================
// Integration: Full sort scenario
// ============================================
describe('Integration: Full sort scenario matches spec', () => {
  it('Given a mix of today, future, and past guests with same-date variants, When sorted, Then order matches spec rules', () => {
    const { window } = createAppEnv();

    const guests = [
      mockGuest('Past Far', '2025-07-01', '2025-07-01T10:00:00.000Z'),
      mockGuest('Future Near', '2025-09-01', '2025-08-25T09:00:00.000Z'),
      mockGuest('Today Late', '2025-08-31', '2025-08-31T16:00:00.000Z'),
      mockGuest('Future Far', '2025-12-25', '2025-08-25T10:00:00.000Z'),
      mockGuest('Today Early', '2025-08-31', '2025-08-31T08:00:00.000Z'),
      mockGuest('Past Near', '2025-08-25', '2025-08-25T10:00:00.000Z'),
      mockGuest('Future Mid', '2025-09-15', '2025-08-25T11:00:00.000Z'),
    ];

    const sorted = window.sortGuestsByDate(guests, '2025-08-31');

    // Expected order:
    // 1. Today (newest first): Today Late, Today Early
    // 2. Future (ascending): Future Near (09-01), Future Mid (09-15), Future Far (12-25)
    // 3. Past (descending): Past Near (08-25), Past Far (07-01)
    expect(sorted[0].nama).toBe('Today Late');
    expect(sorted[1].nama).toBe('Today Early');
    expect(sorted[2].nama).toBe('Future Near');
    expect(sorted[3].nama).toBe('Future Mid');
    expect(sorted[4].nama).toBe('Future Far');
    expect(sorted[5].nama).toBe('Past Near');
    expect(sorted[6].nama).toBe('Past Far');
  });
});
