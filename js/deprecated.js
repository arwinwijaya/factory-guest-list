/* ============================================
   DAFTAR TAMU FACTORY - Deprecated Functions
   ============================================ */

/**
 * @deprecated Moved to deprecated.js - not referenced in any HTML or JS file
 * Format date string to long format (weekday, month, day, year)
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

/**
 * @deprecated Moved to deprecated.js - not referenced in any HTML or JS file
 * Format time from date string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time string
 */
function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * @deprecated Moved to deprecated.js - not referenced in any HTML or JS file
 * Get guests filtered by status
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered guests
 */
function getGuestsByStatus(status) {
    const guests = getGuests();
    return guests.filter(g => g.status === status);
}

/**
 * @deprecated Moved to deprecated.js - not referenced in any HTML or JS file
 * Get today's guests
 * @returns {Array} Guests visiting today
 */
function getTodayGuests() {
    const today = getTodayStr();
    const guests = getGuests();
    return guests.filter(g => g.tanggal === today);
}
