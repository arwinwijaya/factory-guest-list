import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '../../');

/**
 * Load app.js source code and evaluate it in a JSDOM environment
 * with a mocked localStorage. Functions are exposed on window.
 */
function createAppEnv() {
  const appJs = readFileSync(resolve(root, 'js/app.js'), 'utf-8');

  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost/',
    runScripts: 'dangerously',
  });

  const { window } = dom;
  const store = {};

  const mockStorage = {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i) => Object.keys(store)[i] || null),
  };

  Object.defineProperty(window, 'localStorage', { value: mockStorage, writable: true });

  // Execute app.js via the window's eval to get function declarations on window
  window.eval(appJs);

  return {
    window,
    document: window.document,
    localStorage: mockStorage,
    store,
  };
}

// Helper to get today's date string (YYYY-MM-DD)
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Helper to get a past date string (yesterday)
function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Helper to get a future date string (tomorrow)
function getTomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ============================================
// Cycle 1: New guest status based on date
// ============================================
describe('Cycle 1: New guest status based on date', () => {
  let env;

  beforeEach(() => {
    env = createAppEnv();
  });

  it('Given the admin adds a guest for today, When the guest is added, Then the status is "active"', () => {
    const guestData = {
      nama: 'Budi Santoso',
      tanggal: getTodayStr(),
      perusahaan: 'PT Maju Jaya',
      keperluan: 'Meeting kerja sama',
    };

    const newGuest = env.window.addGuest(guestData);

    expect(newGuest).toBeDefined();
    expect(newGuest.status).toBe('active');
  });

  it('Given the admin adds a guest for a future date, When the guest is added, Then the status is "ongoing"', () => {
    const guestData = {
      nama: 'Siti Rahayu',
      tanggal: getTomorrowStr(),
      perusahaan: 'CV Berkah',
      keperluan: 'Kunjungan pabrik',
    };

    const newGuest = env.window.addGuest(guestData);

    expect(newGuest).toBeDefined();
    expect(newGuest.status).toBe('ongoing');
  });

  it('Given a new guest is added for today, When we check the stored data, Then status is "active"', () => {
    const guestData = {
      nama: 'Andi Wijaya',
      tanggal: getTodayStr(),
      perusahaan: 'PT Sejahtera',
      keperluan: 'Audit',
    };

    env.window.addGuest(guestData);
    const guests = env.window.getGuests();

    expect(guests).toHaveLength(1);
    expect(guests[0].status).toBe('active');
  });

  it('Given a new guest is added for a future date, When we check the stored data, Then status is "ongoing"', () => {
    const guestData = {
      nama: 'Rina Hartati',
      tanggal: getTomorrowStr(),
      perusahaan: 'PT Makmur',
      keperluan: 'Presentasi',
    };

    env.window.addGuest(guestData);
    const guests = env.window.getGuests();

    expect(guests).toHaveLength(1);
    expect(guests[0].status).toBe('ongoing');
  });
});

// ============================================
// Cycle 2: Admin changes guest status via buttons
// ============================================
describe('Cycle 2: Admin changes guest status via buttons', () => {
  let env;

  beforeEach(() => {
    env = createAppEnv();
  });

  it('Given a guest with status "active", When the admin changes to "ongoing", Then the status updates to "ongoing"', () => {
    const guestData = {
      nama: 'Andi Wijaya',
      tanggal: getTodayStr(),
      perusahaan: 'PT Sejahtera',
      keperluan: 'Audit',
    };

    const newGuest = env.window.addGuest(guestData);
    expect(newGuest.status).toBe('active');

    const success = env.window.updateGuestStatus(newGuest.id, 'ongoing');
    expect(success).toBe(true);

    const updatedGuest = env.window.getGuestById(newGuest.id);
    expect(updatedGuest.status).toBe('ongoing');
  });

  it('Given a guest, When admin changes status, Then changeStatus function exists', () => {
    expect(typeof env.window.changeStatus).toBe('function');
  });
});

// ============================================
// Cycle 3: Status badge displays correct color
// ============================================
describe('Cycle 3: Status badge displays correct color', () => {
  it('Given a guest with status "reschedule", When getStatusClass is called, Then the class is "status-reschedule"', () => {
    const env = createAppEnv();
    const className = env.window.getStatusClass('reschedule');
    expect(className).toBe('status-reschedule');
  });

  it('getStatusLabel returns "Active" for "active" status', () => {
    const env = createAppEnv();
    expect(env.window.getStatusLabel('active')).toBe('Active');
  });

  it('getStatusLabel returns "On-Going" for "ongoing" status', () => {
    const env = createAppEnv();
    expect(env.window.getStatusLabel('ongoing')).toBe('On-Going');
  });

  it('getStatusLabel returns "Reschedule" for "reschedule" status', () => {
    const env = createAppEnv();
    expect(env.window.getStatusLabel('reschedule')).toBe('Reschedule');
  });

  it('getStatusLabel returns "Cancel" for "cancel" status', () => {
    const env = createAppEnv();
    expect(env.window.getStatusLabel('cancel')).toBe('Cancel');
  });

  it('getStatusClass returns "status-active" for "active"', () => {
    const env = createAppEnv();
    expect(env.window.getStatusClass('active')).toBe('status-active');
  });

  it('getStatusClass returns "status-ongoing" for "ongoing"', () => {
    const env = createAppEnv();
    expect(env.window.getStatusClass('ongoing')).toBe('status-ongoing');
  });

  it('getStatusClass returns "status-cancel" for "cancel"', () => {
    const env = createAppEnv();
    expect(env.window.getStatusClass('cancel')).toBe('status-cancel');
  });
});

// ============================================
// Cycle 4: Free status transition (Cancel -> Active)
// ============================================
describe('Cycle 4: Free status transition (Cancel -> Active)', () => {
  let env;

  beforeEach(() => {
    env = createAppEnv();
  });

  it('Given a guest with status "cancel", When the admin changes to "active", Then the status updates to "active"', () => {
    const guestData = {
      nama: 'Rina Hartati',
      tanggal: getTodayStr(),
      perusahaan: 'PT Makmur',
      keperluan: 'Presentasi',
    };

    const newGuest = env.window.addGuest(guestData);

    // Transition active -> cancel
    env.window.updateGuestStatus(newGuest.id, 'cancel');
    let guest = env.window.getGuestById(newGuest.id);
    expect(guest.status).toBe('cancel');

    // Transition cancel -> active (free transition)
    const success = env.window.updateGuestStatus(newGuest.id, 'active');
    expect(success).toBe(true);

    guest = env.window.getGuestById(newGuest.id);
    expect(guest.status).toBe('active');
  });

  it('Given a guest with any status, When changed to any other status, Then transition succeeds', () => {
    const guestData = {
      nama: 'Dedi Kurniawan',
      tanggal: getTodayStr(),
      perusahaan: 'CV Jaya',
      keperluan: 'Konsultasi',
    };

    const newGuest = env.window.addGuest(guestData);
    const transitions = ['ongoing', 'reschedule', 'cancel', 'active', 'ongoing', 'reschedule'];

    transitions.forEach((status) => {
      const success = env.window.updateGuestStatus(newGuest.id, status);
      expect(success).toBe(true);
      const guest = env.window.getGuestById(newGuest.id);
      expect(guest.status).toBe(status);
    });
  });
});

// ============================================
// Cycle 5: All statuses appear on Display board
// ============================================
describe('Cycle 5: All statuses appear on Display board', () => {
  it('Given guests with all 4 statuses, When createGuestRow is called for each, Then all rows render with correct status classes', () => {
    const env = createAppEnv();

    const statuses = ['active', 'ongoing', 'reschedule', 'cancel'];
    const expectedClasses = ['status-active', 'status-ongoing', 'status-reschedule', 'status-cancel'];
    const expectedLabels = ['Active', 'On-Going', 'Reschedule', 'Cancel'];

    statuses.forEach((status, index) => {
      const guest = {
        id: `test_${status}`,
        nama: `Tamu ${status}`,
        tanggal: '2025-09-15',
        perusahaan: 'PT Test',
        keperluan: 'Testing',
        status: status,
      };

      const row = env.window.createGuestRow(guest, false);

      // Check status class
      const statusSpan = row.querySelector('.board-status');
      expect(statusSpan).not.toBeNull();
      expect(statusSpan.className).toContain(expectedClasses[index]);
      expect(statusSpan.textContent.trim()).toBe(expectedLabels[index]);
    });
  });

  it('Given guests with all 4 statuses in admin mode, When createGuestRow is called, Then status badge and buttons render correctly', () => {
    const env = createAppEnv();

    const guest = {
      id: 'test_admin_guest',
      nama: 'Tamu Admin',
      tanggal: '2025-09-15',
      perusahaan: 'PT Admin',
      keperluan: 'Testing Admin',
      status: 'active',
    };

    const row = env.window.createGuestRow(guest, true);

    // Check status badge
    const statusSpan = row.querySelector('.status-badge');
    expect(statusSpan).not.toBeNull();
    expect(statusSpan.className).toContain('status-active');
    expect(statusSpan.textContent.trim()).toBe('Active');

    // Check action buttons exist (should have 3 status buttons + delete)
    const buttons = row.querySelectorAll('.action-buttons .status-btn');
    expect(buttons.length).toBe(3);

    // Check delete button is NOT disabled
    const deleteBtn = row.querySelector('.btn-danger');
    expect(deleteBtn).not.toBeNull();
    expect(deleteBtn.hasAttribute('disabled')).toBe(false);
  });

  it('Given a guest with status "active" (today), When createGuestRow is called, Then On-Going button is disabled', () => {
    const env = createAppEnv();
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

    const guest = {
      id: 'test_active',
      nama: 'Tamu Active',
      tanggal: today,
      perusahaan: 'PT Test',
      keperluan: 'Testing',
      status: 'active',
    };

    const row = env.window.createGuestRow(guest, true);
    const buttons = row.querySelectorAll('.action-buttons .status-btn');

    // On-Going button should be disabled (today's date)
    expect(buttons[0].hasAttribute('disabled')).toBe(true);
    // Reschedule button should be enabled
    expect(buttons[1].hasAttribute('disabled')).toBe(false);
    // Cancel button should be enabled
    expect(buttons[2].hasAttribute('disabled')).toBe(false);
  });

  it('Given a guest with status "ongoing" and future date, When createGuestRow is called, Then only On-Going button is disabled', () => {
    const env = createAppEnv();
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const tomorrow = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

    const guest = {
      id: 'test_ongoing',
      nama: 'Tamu Ongoing',
      tanggal: tomorrow,
      perusahaan: 'PT Test',
      keperluan: 'Testing',
      status: 'ongoing',
    };

    const row = env.window.createGuestRow(guest, true);
    const buttons = row.querySelectorAll('.action-buttons .status-btn');

    // On-Going button should be disabled (matches status)
    expect(buttons[0].hasAttribute('disabled')).toBe(true);
    // Reschedule button should be enabled
    expect(buttons[1].hasAttribute('disabled')).toBe(false);
    // Cancel button should be enabled
    expect(buttons[2].hasAttribute('disabled')).toBe(false);
  });
});

// ============================================
// Refactor: Old status functions removed
// ============================================
describe('Refactor: Old status functions removed', () => {
  it('getNextStatus should not exist', () => {
    const env = createAppEnv();
    expect(typeof env.window.getNextStatus).toBe('undefined');
  });

  it('Default status for addGuest should not be "menunggu"', () => {
    const env = createAppEnv();
    const guestData = {
      nama: 'Test',
      tanggal: getTodayStr(),
      perusahaan: 'Test',
      keperluan: 'Test',
    };
    const guest = env.window.addGuest(guestData);
    expect(guest.status).not.toBe('menunggu');
  });
});

// ============================================
// Integration: admin.html has status buttons
// ============================================
describe('Integration: admin.html has status buttons', () => {
  it('admin.html contains changeStatus function call', () => {
    const adminHtml = readFileSync(resolve(root, 'admin.html'), 'utf-8');
    expect(adminHtml).toContain('changeStatus');
  });

  it('admin.html does not contain old toggleStatus cycle function', () => {
    const adminHtml = readFileSync(resolve(root, 'admin.html'), 'utf-8');
    expect(adminHtml).not.toContain('toggleStatus');
  });
});

// ============================================
// Integration: display.html has no old statusPriority
// ============================================
describe('Integration: display.html uses new status values', () => {
  it('display.html does not contain old statusPriority with menunggu/meeting/selesai', () => {
    const displayHtml = readFileSync(resolve(root, 'display.html'), 'utf-8');
    expect(displayHtml).not.toContain("'menunggu'");
    expect(displayHtml).not.toContain("'meeting'");
    expect(displayHtml).not.toContain("'selesai'");
  });
});

// ============================================
// UX Enhancement: Confirmation Modal
// =============================================
describe('UX Enhancement: showDeleteConfirmation function', () => {
  let env;

  beforeEach(() => {
    vi.useFakeTimers();
    env = createAppEnv();
    // Seed with a test guest
    env.window.saveGuests([
      { id: 'guest_123', nama: 'John Doe', tanggal: '2025-09-15', perusahaan: 'PT Maju', keperluan: 'Meeting', status: 'active', createdAt: new Date().toISOString() },
    ]);
    // Create modal HTML structure
    env.document.body.innerHTML = `
      <div id="deleteModal" class="modal-overlay" style="display:none;">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Apakah Anda Yakin?</h3>
          </div>
          <div class="modal-body">
            <p class="modal-guest-name"></p>
            <p class="modal-guest-company"></p>
            <p class="modal-guest-date"></p>
            <p class="modal-warning">Data yang dihapus tidak dapat dikembalikan.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Tidak</button>
            <button class="btn btn-danger" onclick="confirmDelete()">Ya</button>
          </div>
        </div>
      </div>
    `;
  });

  it('Given guest "guest_123", When showDeleteConfirmation called, Then guestId stored and modal visible', () => {
    env.window.showDeleteConfirmation('guest_123');
    expect(env.window._pendingDeleteId).toBe('guest_123');
    const modal = env.document.getElementById('deleteModal');
    expect(modal.style.display).toBe('flex');
  });

  it('Given modal is open, Then title shows "Apakah Anda Yakin?"', () => {
    env.window.showDeleteConfirmation('guest_123');
    const title = env.document.querySelector('.modal-header h3');
    expect(title.textContent).toBe('Apakah Anda Yakin?');
  });

  it('Given modal is open, Then body shows guest nama, perusahaan, tanggal', () => {
    env.window.showDeleteConfirmation('guest_123');
    expect(env.document.querySelector('.modal-guest-name').textContent).toContain('John Doe');
    expect(env.document.querySelector('.modal-guest-company').textContent).toContain('PT Maju');
    expect(env.document.querySelector('.modal-guest-date').textContent).toContain('15');
  });

  it('Given modal is open, Then buttons [Tidak] and [Ya] are present', () => {
    env.window.showDeleteConfirmation('guest_123');
    const buttons = env.document.querySelectorAll('.modal-footer .btn');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('Tidak');
    expect(buttons[1].textContent.trim()).toBe('Ya');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Given modal is open, When closeModal called, Then modal hidden', () => {
    env.window.showDeleteConfirmation('guest_123');
    expect(env.document.getElementById('deleteModal').style.display).toBe('flex');
    env.window.closeModal();
    vi.advanceTimersByTime(200);
    expect(env.document.getElementById('deleteModal').style.display).toBe('none');
  });

  it('Given modal is open, When confirmDelete called, Then guest removed and modal closed', () => {
    env.window.showDeleteConfirmation('guest_123');
    env.window.confirmDelete();
    const guests = env.window.getGuests();
    expect(guests.find(g => g.id === 'guest_123')).toBeUndefined();
    expect(env.document.getElementById('deleteModal').style.display).toBe('none');
  });
});

// ============================================
// UX Enhancement: Pagination Functions
// =============================================
describe('UX Enhancement: paginateGuests function', () => {
  let env;

  beforeEach(() => {
    env = createAppEnv();
    // Seed with 25 test guests
    const guests = Array.from({ length: 25 }, (_, i) => ({
      id: `guest_${i + 1}`,
      nama: `Guest ${i + 1}`,
      tanggal: '2025-09-15',
      perusahaan: 'PT Test',
      keperluan: 'Testing',
      status: 'active',
      createdAt: new Date().toISOString()
    }));
    env.window.saveGuests(guests);
  });

  it('Given array of 25 guests, page 1, perPage 10, When paginateGuests called, Then first 10 guests returned', () => {
    const result = env.window.paginateGuests(env.window.getGuests(), 1, 10);
    expect(result.items.length).toBe(10);
    expect(result.items[0].id).toBe('guest_1');
    expect(result.items[9].id).toBe('guest_10');
  });

  it('Given array of 25 guests, page 2, perPage 10, When paginateGuests called, Then guests 11-20 returned', () => {
    const result = env.window.paginateGuests(env.window.getGuests(), 2, 10);
    expect(result.items.length).toBe(10);
    expect(result.items[0].id).toBe('guest_11');
    expect(result.items[9].id).toBe('guest_20');
  });

  it('Given array of 25 guests, page 3, perPage 10, When paginateGuests called, Then guests 21-25 returned', () => {
    const result = env.window.paginateGuests(env.window.getGuests(), 3, 10);
    expect(result.items.length).toBe(5);
    expect(result.items[0].id).toBe('guest_21');
    expect(result.items[4].id).toBe('guest_25');
  });

  it('Given array of 25 guests, page 1, perPage "All", When paginateGuests called, Then all 25 guests returned', () => {
    const result = env.window.paginateGuests(env.window.getGuests(), 1, 'All');
    expect(result.items.length).toBe(25);
    expect(result.totalPages).toBe(1);
  });

  it('Given 25 guests, When paginateGuests called, Then returns correct metadata', () => {
    const result = env.window.paginateGuests(env.window.getGuests(), 1, 10);
    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(1);
    expect(result.totalItems).toBe(25);
  });

  it('Given page > totalPages, When paginateGuests called, Then returns last page', () => {
    const result = env.window.paginateGuests(env.window.getGuests(), 10, 10);
    expect(result.currentPage).toBe(3);
    expect(result.items.length).toBe(5);
  });

  it('Given empty array, When paginateGuests called, Then returns empty result', () => {
    const result = env.window.paginateGuests([], 1, 10);
    expect(result.items.length).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.totalItems).toBe(0);
  });
});

describe('UX Enhancement: changePage function', () => {
  let env;

  beforeEach(() => {
    env = createAppEnv();
    const guests = Array.from({ length: 25 }, (_, i) => ({
      id: `guest_${i + 1}`,
      nama: `Guest ${i + 1}`,
      tanggal: '2025-09-15',
      perusahaan: 'PT Test',
      keperluan: 'Testing',
      status: 'active',
      createdAt: new Date().toISOString()
    }));
    env.window.saveGuests(guests);
    env.window.guestListState.itemsPerPage = 10;
  });

  it('Given page 1, When changePage(2) called, Then currentPage becomes 2', () => {
    env.window.changePage(2);
    expect(env.window.guestListState.currentPage).toBe(2);
  });

  it('Given page 2, When changePage(1) called, Then currentPage becomes 1', () => {
    env.window.guestListState.currentPage = 2;
    env.window.changePage(1);
    expect(env.window.guestListState.currentPage).toBe(1);
  });
});

describe('UX Enhancement: changeItemsPerPage function', () => {
  let env;

  beforeEach(() => {
    env = createAppEnv();
    const guests = Array.from({ length: 25 }, (_, i) => ({
      id: `guest_${i + 1}`,
      nama: `Guest ${i + 1}`,
      tanggal: '2025-09-15',
      perusahaan: 'PT Test',
      keperluan: 'Testing',
      status: 'active',
      createdAt: new Date().toISOString()
    }));
    env.window.saveGuests(guests);
  });

  it('Given default 10, When changeItemsPerPage(25) called, Then itemsPerPage becomes 25', () => {
    env.window.changeItemsPerPage(25);
    expect(env.window.guestListState.itemsPerPage).toBe(25);
  });

  it('Given itemsPerPage changed, When changeItemsPerPage called, Then currentPage resets to 1', () => {
    env.window.guestListState.currentPage = 3;
    env.window.changeItemsPerPage(25);
    expect(env.window.guestListState.currentPage).toBe(1);
  });

  it('Given "All" selected, When changeItemsPerPage("All") called, Then itemsPerPage becomes "All"', () => {
    env.window.changeItemsPerPage('All');
    expect(env.window.guestListState.itemsPerPage).toBe('All');
  });
});

// ============================================
// UX Enhancement: State Object & Search Functions
// =============================================
describe('UX Enhancement: guestListState object', () => {
  let env;

  beforeEach(() => {
    env = createAppEnv();
  });

  it('guestListState exists with default values', () => {
    expect(env.window.guestListState).toBeDefined();
    expect(env.window.guestListState.searchQuery).toBe('');
    expect(env.window.guestListState.currentPage).toBe(1);
    expect(env.window.guestListState.itemsPerPage).toBe(10);
    expect(env.window.guestListState.filteredGuests).toEqual([]);
    expect(env.window.guestListState.totalGuests).toBe(0);
  });
});

describe('UX Enhancement: searchGuests function', () => {
  let env;

  beforeEach(() => {
    env = createAppEnv();
    // Seed with test guests
    env.window.saveGuests([
      { id: 'g1', nama: 'John Doe', tanggal: '2025-09-15', perusahaan: 'PT Maju', keperluan: 'Meeting', status: 'active', createdAt: new Date().toISOString() },
      { id: 'g2', nama: 'Jane Smith', tanggal: '2025-09-16', perusahaan: 'CV Berkah', keperluan: 'Kunjungan', status: 'ongoing', createdAt: new Date().toISOString() },
      { id: 'g3', nama: 'Budi Santoso', tanggal: '2025-09-17', perusahaan: 'PT Jaya', keperluan: 'Audit John', status: 'active', createdAt: new Date().toISOString() },
    ]);
  });

  it('Given array of guests, When searchGuests("john") called, Then only guests with "john" in any field returned', () => {
    const results = env.window.searchGuests('john');
    expect(results.length).toBe(2);
    expect(results.find(g => g.id === 'g1')).toBeDefined();
    expect(results.find(g => g.id === 'g3')).toBeDefined();
  });

  it('Given array of guests, When searchGuests("j") called (1 char), Then all guests returned (min 2 chars)', () => {
    const results = env.window.searchGuests('j');
    expect(results.length).toBe(3);
  });

  it('Given array of guests, When searchGuests("JOHN") called, Then guest "John Doe" returned (case-insensitive)', () => {
    const results = env.window.searchGuests('JOHN');
    expect(results.length).toBe(2);
    expect(results.find(g => g.id === 'g1')).toBeDefined();
  });

  it('Given empty query, When searchGuests("") called, Then all guests returned', () => {
    const results = env.window.searchGuests('');
    expect(results.length).toBe(3);
  });

  it('Given query with no matches, When searchGuests("xyz123") called, Then empty array returned', () => {
    const results = env.window.searchGuests('xyz123');
    expect(results.length).toBe(0);
  });
});

describe('UX Enhancement: highlightText function', () => {
  let env;

  beforeEach(() => {
    env = createAppEnv();
  });

  it('Given text "John Doe" and query "john", When highlightText() called, Then returns "<b>John</b> Doe"', () => {
    const result = env.window.highlightText('John Doe', 'john');
    expect(result).toBe('<b>John</b> Doe');
  });

  it('Given text "John Doe" and query "doe", When highlightText() called, Then returns "John <b>Doe</b>"', () => {
    const result = env.window.highlightText('John Doe', 'doe');
    expect(result).toBe('John <b>Doe</b>');
  });

  it('Given text "John Doe" and empty query, When highlightText() called, Then returns original text', () => {
    const result = env.window.highlightText('John Doe', '');
    expect(result).toBe('John Doe');
  });

  it('Given text "John Doe" and query "xyz", When highlightText() called, Then returns original text', () => {
    const result = env.window.highlightText('John Doe', 'xyz');
    expect(result).toBe('John Doe');
  });
});

describe('UX Enhancement: debounce function', () => {
  let env;

  beforeEach(() => {
    env = createAppEnv();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Given a function, When debounce wraps it, Then it delays execution', () => {
    const fn = vi.fn();
    const debouncedFn = env.window.debounce(fn, 300);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('Given rapid calls, When debounce wraps function, Then only last call executes', () => {
    const fn = vi.fn();
    const debouncedFn = env.window.debounce(fn, 300);

    debouncedFn('a');
    debouncedFn('b');
    debouncedFn('c');

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith('c');
  });
});

// ============================================
// Cycle 6: getTodayStr helper uses local timezone
// ============================================
describe('Cycle 6: getTodayStr helper uses local timezone', () => {
  it('getTodayStr returns today in YYYY-MM-DD format', () => {
    const env = createAppEnv();
    const result = env.window.getTodayStr();
    const d = new Date();
    const expected = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    expect(result).toBe(expected);
  });

  it('getTodayStr accepts optional Date argument for testing', () => {
    const env = createAppEnv();
    const testDate = new Date(2025, 0, 15); // Jan 15, 2025
    const result = env.window.getTodayStr(testDate);
    expect(result).toBe('2025-01-15');
  });
});

// ============================================
// Cycle 7: cleanPastGuests removes past-dated guests
// ============================================
describe('Cycle 7: cleanPastGuests removes past-dated guests', () => {
  let env;

  beforeEach(() => {
    env = createAppEnv();
  });

  it('Given guests with past, today, and future dates, When cleanPastGuests is called, Then only today and future guests remain', () => {
    // Seed with past, today, and future guests
    env.window.saveGuests([
      { id: 'past1', nama: 'Past Guest', tanggal: getYesterdayStr(), perusahaan: 'PT', keperluan: 'X', status: 'active', createdAt: new Date().toISOString() },
      { id: 'today1', nama: 'Today Guest', tanggal: getTodayStr(), perusahaan: 'PT', keperluan: 'X', status: 'active', createdAt: new Date().toISOString() },
      { id: 'future1', nama: 'Future Guest', tanggal: getTomorrowStr(), perusahaan: 'PT', keperluan: 'X', status: 'ongoing', createdAt: new Date().toISOString() },
    ]);

    const removedCount = env.window.cleanPastGuests();

    expect(removedCount).toBe(1);
    const remaining = env.window.getGuests();
    expect(remaining.length).toBe(2);
    expect(remaining.find(g => g.id === 'past1')).toBeUndefined();
    expect(remaining.find(g => g.id === 'today1')).toBeDefined();
    expect(remaining.find(g => g.id === 'future1')).toBeDefined();
  });

  it('Given no past guests, When cleanPastGuests is called, Then no guests are removed', () => {
    env.window.saveGuests([
      { id: 'today1', nama: 'Today', tanggal: getTodayStr(), perusahaan: 'PT', keperluan: 'X', status: 'active', createdAt: new Date().toISOString() },
      { id: 'future1', nama: 'Future', tanggal: getTomorrowStr(), perusahaan: 'PT', keperluan: 'X', status: 'ongoing', createdAt: new Date().toISOString() },
    ]);

    const removedCount = env.window.cleanPastGuests();

    expect(removedCount).toBe(0);
    expect(env.window.getGuests().length).toBe(2);
  });

  it('Given only past guests, When cleanPastGuests is called, Then all guests are removed', () => {
    env.window.saveGuests([
      { id: 'past1', nama: 'Past1', tanggal: getYesterdayStr(), perusahaan: 'PT', keperluan: 'X', status: 'active', createdAt: new Date().toISOString() },
    ]);

    const removedCount = env.window.cleanPastGuests();

    expect(removedCount).toBe(1);
    expect(env.window.getGuests().length).toBe(0);
  });
});
