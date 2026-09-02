/* ============================================
   DAFTAR TAMU FACTORY - Guest Data
   ============================================ */

// Constants
const STORAGE_KEY = 'daftar_tamu_factory';

// ============================================
// === GUEST DATA ===
// ============================================

function getGuests() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveGuests(guests) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
}

function addGuest(guestData) {
    const guests = getGuests();
    
    // Determine status based on date:
    // - Today → 'active'
    // - Future → 'ongoing'
    const today = getTodayStr();
    const status = guestData.tanggal === today ? 'active' : 'ongoing';
    
    const newGuest = {
        id: generateId(),
        nama: guestData.nama,
        tanggal: guestData.tanggal,
        perusahaan: guestData.perusahaan,
        keperluan: guestData.keperluan,
        status: status,
        createdAt: new Date().toISOString()
    };
    
    guests.unshift(newGuest); // Add to beginning
    saveGuests(guests);
    
    return newGuest;
}

function deleteGuest(id) {
    let guests = getGuests();
    guests = guests.filter(g => g.id !== id);
    saveGuests(guests);
}

function updateGuestStatus(id, newStatus) {
    const guests = getGuests();
    const guest = guests.find(g => g.id === id);
    
    if (guest) {
        guest.status = newStatus;
        guest.updatedAt = new Date().toISOString();
        saveGuests(guests);
        return true;
    }
    
    return false;
}

function getGuestById(id) {
    const guests = getGuests();
    return guests.find(g => g.id === id) || null;
}

/**
 * Remove guests whose visit date is before today
 * @returns {number} Number of guests removed
 */
function cleanPastGuests() {
    const today = getTodayStr();
    const guests = getGuests();
    const remaining = guests.filter(g => g.tanggal >= today);
    const removedCount = guests.length - remaining.length;
    if (removedCount > 0) {
        saveGuests(remaining);
    }
    return removedCount;
}

// ============================================
// === UTILITIES (Guest Data dependencies)
// ============================================

/**
 * Get today's date string in YYYY-MM-DD format (local timezone)
 * @param {Date} [date] - Optional Date object for testing
 * @returns {string} Today's date string
 */
function getTodayStr(date) {
    const d = date || new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function generateId() {
    return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// === SORT ===
// ============================================

/**
 * Sort guests by visit date with the following priority:
 * 1. Today's guests first
 * 2. Future dates ascending (nearest first)
 * 3. Past dates descending (most recent first)
 * 4. Same-date tiebreaker by createdAt descending (newest first)
 *
 * @param {Array} guests - Array of guest objects
 * @param {string} [todayStr] - Optional today's date string (YYYY-MM-DD) for testability
 * @returns {Array} Sorted array (does not mutate original)
 */
function sortGuestsByDate(guests, todayStr) {
    if (!Array.isArray(guests) || guests.length === 0) return [];

    const today = todayStr || new Date().toISOString().split('T')[0];

    // Classify each guest into: today, future, past
    const todayGuests = [];
    const futureGuests = [];
    const pastGuests = [];

    guests.forEach(guest => {
        if (guest.tanggal === today) {
            todayGuests.push(guest);
        } else if (guest.tanggal > today) {
            futureGuests.push(guest);
        } else {
            pastGuests.push(guest);
        }
    });

    // Helper: sort by createdAt descending (newest first)
    const byCreatedAtDesc = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

    // Today: newest createdAt first
    todayGuests.sort(byCreatedAtDesc);

    // Future: ascending by tanggal (nearest first), tiebreak by createdAt desc
    futureGuests.sort((a, b) => {
        const dateDiff = a.tanggal.localeCompare(b.tanggal);
        if (dateDiff !== 0) return dateDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Past: descending by tanggal (most recent first), tiebreak by createdAt desc
    pastGuests.sort((a, b) => {
        const dateDiff = b.tanggal.localeCompare(a.tanggal);
        if (dateDiff !== 0) return dateDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return [...todayGuests, ...futureGuests, ...pastGuests];
}
