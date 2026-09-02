/* ============================================
   DAFTAR TAMU FACTORY - App Logic
   ============================================ */

// Constants
const STORAGE_KEY = 'daftar_tamu_factory';
const AUTH_KEY = 'daftar_tamu_auth';
const DEFAULT_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// ============================================
// UX ENHANCEMENT STATE
// ============================================

var guestListState = {
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 10,
    filteredGuests: [],
    totalGuests: 0
};

// ============================================
// SEARCH FUNCTIONS
// ============================================

/**
 * Search guests by query across all text fields
 * @param {string} query - Search query (min 2 chars to filter)
 * @returns {Array} Filtered guests
 */
function searchGuests(query) {
    const guests = getGuests();
    
    // If query is empty or less than 2 chars, return all guests
    if (!query || query.length < 2) {
        return guests;
    }
    
    const lowerQuery = query.toLowerCase();
    
    return guests.filter(guest => {
        const fields = [
            guest.nama || '',
            guest.perusahaan || '',
            guest.keperluan || '',
            guest.tanggal || '',
            guest.status || ''
        ];
        
        return fields.some(field => 
            field.toLowerCase().includes(lowerQuery)
        );
    });
}

/**
 * Highlight matching text in a string
 * @param {string} text - Original text
 * @param {string} query - Search query to highlight
 * @returns {string} Text with matches wrapped in <b> tags
 */
function highlightText(text, query) {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<b>$1</b>');
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ============================================
// PAGINATION FUNCTIONS
// ============================================

/**
 * Paginate an array of guests
 * @param {Array} guests - Array of guest objects
 * @param {number} page - Current page (1-indexed)
 * @param {number|string} perPage - Items per page or 'All'
 * @returns {Object} { items, totalPages, currentPage, totalItems }
 */
function paginateGuests(guests, page, perPage) {
    const totalItems = guests.length;
    
    // Handle 'All' option
    if (perPage === 'All') {
        return {
            items: guests,
            totalPages: 1,
            currentPage: 1,
            totalItems
        };
    }
    
    const totalPages = Math.ceil(totalItems / perPage) || 0;
    
    // Ensure page is within bounds
    const validPage = Math.max(1, Math.min(page, totalPages || 1));
    
    const startIndex = (validPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    return {
        items: guests.slice(startIndex, endIndex),
        totalPages,
        currentPage: validPage,
        totalItems
    };
}

/**
 * Change current page and trigger re-render
 * @param {number} page - Target page number
 */
function changePage(page) {
    guestListState.currentPage = page;
    if (typeof renderGuestList === 'function') {
        renderGuestList();
    }
}

/**
 * Change items per page and reset to page 1
 * @param {number|string} count - Items per page or 'All'
 */
function changeItemsPerPage(count) {
    guestListState.itemsPerPage = count;
    guestListState.currentPage = 1;
    if (typeof renderGuestList === 'function') {
        renderGuestList();
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================

var _pendingDeleteId = null;

/**
 * Show delete confirmation modal with guest details
 * @param {string} guestId - ID of guest to delete
 */
function showDeleteConfirmation(guestId) {
    const guest = getGuestById(guestId);
    if (!guest) return;
    
    _pendingDeleteId = guestId;
    
    const modal = document.getElementById('deleteModal');
    if (!modal) return;
    
    // Populate modal with guest details
    const nameEl = modal.querySelector('.modal-guest-name');
    const companyEl = modal.querySelector('.modal-guest-company');
    const dateEl = modal.querySelector('.modal-guest-date');
    
    if (nameEl) nameEl.textContent = guest.nama;
    if (companyEl) companyEl.textContent = guest.perusahaan;
    if (dateEl) dateEl.textContent = formatDateShort(guest.tanggal);
    
    // Show modal with animation
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.opacity = '1'; }, 10);
}

/**
 * Close the delete confirmation modal
 */
function closeModal() {
    const modal = document.getElementById('deleteModal');
    if (!modal) return;
    
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        _pendingDeleteId = null;
    }, 200);
}

/**
 * Confirm delete - remove guest and close modal
 */
function confirmDelete() {
    if (_pendingDeleteId) {
        deleteGuest(_pendingDeleteId);
        _pendingDeleteId = null;
    }
    
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Refresh guest list if function exists
    if (typeof loadGuests === 'function') {
        loadGuests();
    }
}

// ============================================
// LOADING STATE FUNCTIONS
// ============================================

/**
 * Show loading spinner in the table area
 */
function showLoading() {
    const container = document.getElementById('loadingContainer');
    if (container) {
        container.style.display = 'flex';
    }
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    const container = document.getElementById('loadingContainer');
    if (container) {
        container.style.display = 'none';
    }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

/**
 * Render the guest list with search, pagination, and empty states
 */
function renderGuestList() {
    const tbody = document.getElementById('guestTableBody');
    const emptyState = document.getElementById('emptyState');
    const noResultsState = document.getElementById('noResultsState');
    const noResultsText = document.getElementById('noResultsText');
    const paginationContainer = document.getElementById('paginationContainer');
    const guestCount = document.getElementById('guestCount');
    const paginationInfo = document.getElementById('paginationInfo');
    const pageNumbers = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!tbody) return;
    
    // Get all guests and apply search filter
    const allGuests = getGuests();
    const filteredGuests = searchGuests(guestListState.searchQuery);
    
    // Update state
    guestListState.filteredGuests = filteredGuests;
    guestListState.totalGuests = allGuests.length;
    
    // Reset to page 1 if search query changed
    if (guestListState.searchQuery && guestListState.searchQuery.length >= 2) {
        guestListState.currentPage = 1;
    }
    
    // Clear table
    tbody.innerHTML = '';
    
    // Handle empty states
    if (allGuests.length === 0) {
        // No data at all
        renderEmptyState('no-data');
        if (guestCount) guestCount.textContent = '0 tamu';
        if (paginationContainer) paginationContainer.classList.add('hidden');
        return;
    }
    
    if (filteredGuests.length === 0 && guestListState.searchQuery.length >= 2) {
        // No search results
        renderEmptyState('no-results');
        if (guestCount) guestCount.textContent = '0 tamu';
        if (paginationContainer) paginationContainer.classList.add('hidden');
        return;
    }
    
    // Hide empty states
    if (emptyState) emptyState.classList.add('hidden');
    if (noResultsState) noResultsState.classList.add('hidden');
    
    // Apply pagination
    const paginatedResult = paginateGuests(
        filteredGuests,
        guestListState.currentPage,
        guestListState.itemsPerPage
    );
    
    // Update current page (may be adjusted by paginateGuests)
    guestListState.currentPage = paginatedResult.currentPage;
    
    // Render guest rows
    paginatedResult.items.forEach(guest => {
        const row = createGuestRow(guest, true);
        
        // Apply search highlight if query exists
        if (guestListState.searchQuery.length >= 2) {
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                if (cell.querySelector('.status-badge') || cell.querySelector('.action-buttons')) {
                    return; // Skip status and action cells
                }
                cell.innerHTML = highlightText(cell.innerHTML, guestListState.searchQuery);
            });
        }
        
        tbody.appendChild(row);
    });
    
    // Update guest count
    if (guestCount) {
        guestCount.textContent = `${filteredGuests.length} tamu`;
    }
    
    // Update pagination
    if (paginationContainer) {
        if (paginatedResult.totalPages > 1) {
            paginationContainer.classList.remove('hidden');
            
            // Update pagination info
            const startItem = (paginatedResult.currentPage - 1) * (guestListState.itemsPerPage === 'All' ? filteredGuests.length : guestListState.itemsPerPage) + 1;
            const endItem = Math.min(startItem + (guestListState.itemsPerPage === 'All' ? filteredGuests.length : guestListState.itemsPerPage) - 1, filteredGuests.length);
            
            if (paginationInfo) {
                paginationInfo.textContent = `Menampilkan ${startItem}-${endItem} dari ${filteredGuests.length} tamu`;
            }
            
            // Render page numbers
            if (pageNumbers) {
                pageNumbers.innerHTML = '';
                const maxVisiblePages = 3;
                let startPage = Math.max(1, paginatedResult.currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(paginatedResult.totalPages, startPage + maxVisiblePages - 1);
                
                if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
                
                for (let i = startPage; i <= endPage; i++) {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = `btn btn-small page-btn ${i === paginatedResult.currentPage ? 'active' : ''}`;
                    pageBtn.textContent = i;
                    pageBtn.onclick = () => changePage(i);
                    pageNumbers.appendChild(pageBtn);
                }
            }
            
            // Update prev/next buttons
            if (prevBtn) {
                prevBtn.disabled = paginatedResult.currentPage === 1;
            }
            if (nextBtn) {
                nextBtn.disabled = paginatedResult.currentPage === paginatedResult.totalPages;
            }
        } else {
            paginationContainer.classList.add('hidden');
        }
    }
}

/**
 * Render empty state based on type
 * @param {string} type - 'no-data' or 'no-results'
 */
function renderEmptyState(type) {
    const emptyState = document.getElementById('emptyState');
    const noResultsState = document.getElementById('noResultsState');
    const noResultsText = document.getElementById('noResultsText');
    const tbody = document.getElementById('guestTableBody');
    
    // Hide all empty states first
    if (emptyState) emptyState.classList.add('hidden');
    if (noResultsState) noResultsState.classList.add('hidden');
    
    // Clear table
    if (tbody) tbody.innerHTML = '';
    
    if (type === 'no-data') {
        if (emptyState) emptyState.classList.remove('hidden');
    } else if (type === 'no-results') {
        if (noResultsState) noResultsState.classList.remove('hidden');
        if (noResultsText) {
            noResultsText.textContent = `Tidak ada hasil untuk '${guestListState.searchQuery}'`;
        }
    }
}

// ============================================
// AUTH FUNCTIONS
// ============================================

function login(username, password) {
    if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({
            loggedIn: true,
            timestamp: new Date().toISOString()
        }));
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}

function isLoggedIn() {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) return false;
    
    try {
        const authData = JSON.parse(auth);
        return authData.loggedIn === true;
    } catch {
        return false;
    }
}

function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ============================================
// GUEST DATA FUNCTIONS
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

function formatDateShort(dateString) {
    const options = { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function getCurrentDate() {
    return new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ============================================
// STATUS HELPERS
// ============================================

function getStatusLabel(status) {
    const labels = {
        'active': 'Active',
        'ongoing': 'On-Going',
        'reschedule': 'Reschedule',
        'cancel': 'Cancel'
    };
    return labels[status] || status;
}

function getStatusClass(status) {
    return `status-${status}`;
}

function changeStatus(id, newStatus) {
    const success = updateGuestStatus(id, newStatus);
    if (success && typeof loadGuests === 'function') {
        loadGuests();
        showNotification(`Status diubah ke ${getStatusLabel(newStatus)}`);
    }
    return success;
}

// ============================================
// EXPORT/IMPORT FUNCTIONS
// ============================================

function exportToJSON() {
    const guests = getGuests();
    const dataStr = JSON.stringify(guests, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `daftar-tamu-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function importFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const guests = JSON.parse(e.target.result);
                
                // Validate data structure
                if (!Array.isArray(guests)) {
                    reject(new Error('Invalid data format'));
                    return;
                }
                
                // Merge with existing data
                const existingGuests = getGuests();
                const existingIds = new Set(existingGuests.map(g => g.id));
                
                const newGuests = guests.filter(g => !existingIds.has(g.id));
                const mergedGuests = [...newGuests, ...existingGuests];
                
                saveGuests(mergedGuests);
                resolve(newGuests.length);
            } catch (err) {
                reject(err);
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsText(file);
    });
}

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================

/**
 * Show a notification message with auto-dismiss
 * @param {string} message - Notification message to display
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 14px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ============================================
// SORT FUNCTIONS
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

// ============================================
// DISPLAY HELPERS
// ============================================

function createGuestRow(guest, isAdmin = false) {
    const row = document.createElement('tr');
    row.className = 'flip-animation';
    row.dataset.id = guest.id;
    
    if (isAdmin) {
        // Compute today's date (local timezone)
        const d = new Date();
        const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        const isToday = guest.tanggal === today;

        // Disable button matching current status; On-Going disabled for today
        const disabledOngoing = guest.status === 'ongoing' || isToday ? 'disabled' : '';
        const disabledReschedule = guest.status === 'reschedule' ? 'disabled' : '';
        const disabledCancel = guest.status === 'cancel' ? 'disabled' : '';

        row.innerHTML = `
            <td>${guest.nama}</td>
            <td>${formatDateShort(guest.tanggal)}</td>
            <td>${guest.perusahaan}</td>
            <td>${guest.keperluan}</td>
            <td>
                <span class="status-badge ${getStatusClass(guest.status)}">
                    ${getStatusLabel(guest.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small status-btn" ${disabledOngoing} onclick="changeStatus('${guest.id}', 'ongoing')">On-Going</button>
                    <button class="btn btn-small status-btn" ${disabledReschedule} onclick="changeStatus('${guest.id}', 'reschedule')">Reschedule</button>
                    <button class="btn btn-small status-btn" ${disabledCancel} onclick="changeStatus('${guest.id}', 'cancel')">Cancel</button>
                    <button class="btn btn-small btn-danger" onclick="removeGuest('${guest.id}')">
                        Hapus
                    </button>
                </div>
            </td>
        `;
    } else {
        row.innerHTML = `
            <td>${guest.nama}</td>
            <td>${formatDateShort(guest.tanggal)}</td>
            <td>${guest.perusahaan}</td>
            <td>${guest.keperluan}</td>
            <td>
                <span class="board-status ${getStatusClass(guest.status)}">
                    ${getStatusLabel(guest.status)}
                </span>
            </td>
        `;
    }
    
    return row;
}

// ============================================
// INITIALIZATION
// ============================================

function initClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;
    
    function updateClock() {
        clockElement.textContent = getCurrentTime();
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

function initDate() {
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;
    
    dateElement.textContent = getCurrentDate();
}

// Auto-refresh for display board
let refreshInterval = null;

function startAutoRefresh(callback, interval = 30000) {
    stopAutoRefresh();
    refreshInterval = setInterval(callback, interval);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}
