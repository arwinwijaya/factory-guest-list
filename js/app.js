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
    
    const newGuest = {
        id: generateId(),
        nama: guestData.nama,
        tanggal: guestData.tanggal,
        perusahaan: guestData.perusahaan,
        keperluan: guestData.keperluan,
        status: 'menunggu', // menunggu, meeting, selesai
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

function getTodayGuests() {
    const today = new Date().toISOString().split('T')[0];
    const guests = getGuests();
    return guests.filter(g => g.tanggal === today);
}

function getGuestsByStatus(status) {
    const guests = getGuests();
    return guests.filter(g => g.status === status);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId() {
    return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function formatDateShort(dateString) {
    const options = { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
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
        'menunggu': 'Menunggu',
        'meeting': 'Meeting',
        'selesai': 'Selesai'
    };
    return labels[status] || status;
}

function getStatusClass(status) {
    return `status-${status}`;
}

function getNextStatus(currentStatus) {
    const flow = {
        'menunggu': 'meeting',
        'meeting': 'selesai',
        'selesai': 'menunggu'
    };
    return flow[currentStatus] || 'menunggu';
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
// DISPLAY HELPERS
// ============================================

function createGuestRow(guest, isAdmin = false) {
    const row = document.createElement('tr');
    row.className = 'flip-animation';
    row.dataset.id = guest.id;
    
    if (isAdmin) {
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
                    <button class="btn btn-small" onclick="toggleStatus('${guest.id}')">
                        Status
                    </button>
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
