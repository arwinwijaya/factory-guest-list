# API Documentation - Factory Guest List

Dokumentasi lengkap untuk semua fungsi JavaScript yang tersedia.

---

## Table of Contents

- [Constants](#constants)
- [Authentication Functions](#authentication-functions)
- [Guest Data Functions](#guest-data-functions)
- [Utility Functions](#utility-functions)
- [Status Helpers](#status-helpers)
- [Export/Import Functions](#exportimport-functions)
- [Sort Functions](#sort-functions)
- [Display Helpers](#display-helpers)
- [Initialization Functions](#initialization-functions)

---

## Constants

### STORAGE_KEY
```javascript
const STORAGE_KEY = 'daftar_tamu_factory';
```
Key untuk menyimpan data tamu di localStorage.

### AUTH_KEY
```javascript
const AUTH_KEY = 'daftar_tamu_auth';
```
Key untuk menyimpan status login di localStorage.

### DEFAULT_CREDENTIALS
```javascript
const DEFAULT_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};
```
Default credentials untuk login.

---

## Authentication Functions

### login(username, password)
Melakukan login dengan username dan password.

**Parameters:**
- `username` (string) - Username untuk login
- `password` (string) - Password untuk login

**Returns:**
- `boolean` - `true` jika login berhasil, `false` jika gagal

**Example:**
```javascript
const success = login('admin', 'admin123');
if (success) {
    console.log('Login berhasil!');
}
```

---

### logout()
Melakukan logout dan redirect ke halaman login.

**Parameters:**
- Tidak ada

**Returns:**
- Tidak ada (void)

**Example:**
```javascript
logout(); // Redirect ke login.html
```

---

### isLoggedIn()
Mengecek apakah user sedang login.

**Parameters:**
- Tidak ada

**Returns:**
- `boolean` - `true` jika sedang login, `false` jika tidak

**Example:**
```javascript
if (isLoggedIn()) {
    console.log('User sudah login');
}
```

---

### checkAuth()
Mengecek autentikasi dan redirect ke login jika belum login.

**Parameters:**
- Tidak ada

**Returns:**
- `boolean` - `true` jika terautentikasi, `false` jika tidak (akan redirect)

**Example:**
```javascript
// Di halaman yang membutuhkan autentikasi
if (!checkAuth()) {
    // Akan redirect ke login.html
    return;
}
```

---

## Guest Data Functions

### getGuests()
Mengambil semua data tamu dari localStorage.

**Parameters:**
- Tidak ada

**Returns:**
- `Array<Object>` - Array berisi objek tamu

**Object Structure:**
```javascript
{
    id: string,           // ID unik tamu
    nama: string,         // Nama tamu
    tanggal: string,      // Tanggal kunjungan (YYYY-MM-DD)
    perusahaan: string,   // Nama perusahaan
    keperluan: string,    // Keperluan kunjungan
    status: string,       // Status: 'active', 'ongoing', 'reschedule', 'cancel'
    createdAt: string,    // Waktu pembuatan (ISO string)
    updatedAt?: string    // Waktu update (ISO string, optional)
}
```

**Example:**
```javascript
const guests = getGuests();
console.log(`Total tamu: ${guests.length}`);
```

---

### saveGuests(guests)
Menyimpan data tamu ke localStorage.

**Parameters:**
- `guests` (Array<Object>) - Array berisi objek tamu

**Returns:**
- Tidak ada (void)

**Example:**
```javascript
const guests = getGuests();
guests[0].status = 'ongoing';
saveGuests(guests);
```

---

### addGuest(guestData)
Menambahkan tamu baru dengan status otomatis berdasarkan tanggal.

**Parameters:**
- `guestData` (Object) - Data tamu baru
  - `nama` (string) - Nama tamu
  - `tanggal` (string) - Tanggal kunjungan (YYYY-MM-DD, minimal hari ini)
  - `perusahaan` (string) - Nama perusahaan
  - `keperluan` (string) - Keperluan kunjungan

**Returns:**
- `Object` - Data tamu yang baru ditambahkan dengan ID dan status otomatis

**Status Logic:**
- `tanggal === today` → status: `'active'`
- `tanggal > today` → status: `'ongoing'`

**Example:**
```javascript
// Tamu hari ini → status "active"
const todayGuest = addGuest({
    nama: 'John Doe',
    tanggal: '2025-09-01', // hari ini
    perusahaan: 'PT Maju Jaya',
    keperluan: 'Meeting kerja sama'
});
console.log(todayGuest.status); // "active"

// Tamu masa depan → status "ongoing"
const futureGuest = addGuest({
    nama: 'Jane Smith',
    tanggal: '2025-09-15', // masa depan
    perusahaan: 'CV Berkah',
    keperluan: 'Kunjungan pabrik'
});
console.log(futureGuest.status); // "ongoing"
```

---

### deleteGuest(id)
Menghapus tamu berdasarkan ID.

**Parameters:**
- `id` (string) - ID tamu yang akan dihapus

**Returns:**
- Tidak ada (void)

**Example:**
```javascript
deleteGuest('guest_1234567890_abc123');
```

---

### updateGuestStatus(id, newStatus)
Mengupdate status tamu.

**Parameters:**
- `id` (string) - ID tamu
- `newStatus` (string) - Status baru: 'active', 'ongoing', 'reschedule', atau 'cancel'

**Returns:**
- `boolean` - `true` jika berhasil, `false` jika tamu tidak ditemukan

**Example:**
```javascript
const success = updateGuestStatus('guest_1234567890_abc123', 'ongoing');
if (success) {
    console.log('Status berhasil diupdate');
}
```

---

### getGuestById(id)
Mengambil data tamu berdasarkan ID.

**Parameters:**
- `id` (string) - ID tamu

**Returns:**
- `Object|null` - Data tamu atau `null` jika tidak ditemukan

**Example:**
```javascript
const guest = getGuestById('guest_1234567890_abc123');
if (guest) {
    console.log(`Nama: ${guest.nama}`);
}
```

---

### getTodayGuests()
Mengambil semua tamu yang kunjungannya hari ini.

**Parameters:**
- Tidak ada

**Returns:**
- `Array<Object>` - Array berisi tamu hari ini

**Example:**
```javascript
const todayGuests = getTodayGuests();
console.log(`Tamu hari ini: ${todayGuests.length}`);
```

---

### getGuestsByStatus(status)
Mengambil tamu berdasarkan status.

**Parameters:**
- `status` (string) - Status yang dicari: 'active', 'ongoing', 'reschedule', atau 'cancel'

**Returns:**
- `Array<Object>` - Array berisi tamu dengan status tersebut

**Example:**
```javascript
const activeGuests = getGuestsByStatus('active');
console.log(`Tamu aktif: ${activeGuests.length}`);
```

---

## Utility Functions

### generateId()
Menghasilkan ID unik untuk tamu baru.

**Parameters:**
- Tidak ada

**Returns:**
- `string` - ID unik dalam format `guest_<timestamp>_<random>`

**Example:**
```javascript
const id = generateId();
console.log(id); // "guest_1234567890_abc123xyz"
```

---

### formatDate(dateString)
Format tanggal menjadi format panjang (Bahasa Indonesia).

**Parameters:**
- `dateString` (string) - Tanggal dalam format ISO

**Returns:**
- `string` - Tanggal terformat (contoh: "Senin, 1 September 2025")

**Example:**
```javascript
const formatted = formatDate('2025-09-01');
console.log(formatted); // "Senin, 1 September 2025"
```

---

### formatDateShort(dateString)
Format tanggal menjadi format singkat.

**Parameters:**
- `dateString` (string) - Tanggal dalam format ISO

**Returns:**
- `string` - Tanggal terformat (contoh: "01 Sep 2025")

**Example:**
```javascript
const formatted = formatDateShort('2025-09-01');
console.log(formatted); // "01 Sep 2025"
```

---

### formatTime(dateString)
Format waktu dari string ISO.

**Parameters:**
- `dateString` (string) - Waktu dalam format ISO

**Returns:**
- `string` - Waktu terformat (contoh: "14:30")

**Example:**
```javascript
const time = formatTime('2025-09-01T14:30:00.000Z');
console.log(time); // "14:30" (disesuaikan timezone)
```

---

### getCurrentTime()
Mengambil waktu saat ini.

**Parameters:**
- Tidak ada

**Returns:**
- `string` - Waktu saat ini (contoh: "14:30:45")

**Example:**
```javascript
const time = getCurrentTime();
console.log(`Sekarang: ${time}`);
```

---

### getCurrentDate()
Mengambil tanggal saat ini dalam format panjang.

**Parameters:**
- Tidak ada

**Returns:**
- `string` - Tanggal saat ini (contoh: "Senin, 1 September 2025")

**Example:**
```javascript
const date = getCurrentDate();
console.log(`Hari ini: ${date}`);
```

---

## Status Helpers

### getStatusLabel(status)
Mengambil label untuk status tamu.

**Parameters:**
- `status` (string) - Status tamu

**Returns:**
- `string` - Label status

**Status Mapping:**
| Status | Label |
|--------|-------|
| `active` | Active |
| `ongoing` | On-Going |
| `reschedule` | Reschedule |
| `cancel` | Cancel |

**Example:**
```javascript
const label = getStatusLabel('ongoing');
console.log(label); // "On-Going"
```

---

### getStatusClass(status)
Mengambil CSS class untuk status tamu.

**Parameters:**
- `status` (string) - Status tamu

**Returns:**
- `string` - CSS class dalam format `status-{status}`

**Example:**
```javascript
const cssClass = getStatusClass('active');
console.log(cssClass); // "status-active"
```

---

### changeStatus(id, newStatus)
Mengubah status tamu dan memperbarui tampilan.

**Parameters:**
- `id` (string) - ID tamu
- `newStatus` (string) - Status baru

**Returns:**
- `boolean` - `true` jika berhasil, `false` jika gagal

**Example:**
```javascript
changeStatus('guest_1234567890_abc123', 'reschedule');
// Status berubah dan tampilan diperbarui
```

---

## Export/Import Functions

### exportToJSON()
Mengekspor semua data tamu ke file JSON.

**Parameters:**
- Tidak ada

**Returns:**
- Tidak ada (void) - File JSON akan didownload

**Example:**
```javascript
exportToJSON(); // Download file daftar-tamu-YYYY-MM-DD.json
```

---

### importFromJSON(file)
Mengimpor data tamu dari file JSON.

**Parameters:**
- `file` (File) - File JSON yang akan diimpor

**Returns:**
- `Promise<number>` - Jumlah tamu baru yang berhasil diimpor

**Example:**
```javascript
const input = document.createElement('input');
input.type = 'file';
input.onchange = async (e) => {
    const file = e.target.files[0];
    try {
        const count = await importFromJSON(file);
        console.log(`${count} tamu baru berhasil diimpor`);
    } catch (err) {
        console.error('Gagal mengimpor:', err);
    }
};
input.click();
```

---

## Sort Functions

### sortGuestsByDate(guests, todayStr?)
Mengurutkan tamu berdasarkan tanggal kunjungan.

**Parameters:**
- `guests` (Array<Object>) - Array berisi objek tamu
- `todayStr` (string, optional) - Tanggal hari ini (YYYY-MM-DD) untuk testing

**Returns:**
- `Array<Object>` - Array tamu yang sudah diurutkan (tidak mengubah array asli)

**Sort Priority:**
1. Tamu hari ini (paling atas)
2. Tanggal depan (ascending - terdekat duluan)
3. Tanggal lalu (descending - terbaru duluan)
4. Jika tanggal sama, urutkan berdasarkan waktu dibuat (terbaru duluan)

**Example:**
```javascript
const guests = getGuests();
const sorted = sortGuestsByDate(guests);
console.log(sorted);
```

---

## Display Helpers

### createGuestRow(guest, isAdmin?)
Membuat baris HTML untuk tamu.

**Parameters:**
- `guest` (Object) - Data tamu
- `isAdmin` (boolean, optional) - `true` untuk mode admin (dengan tombol aksi), default `false`

**Returns:**
- `HTMLElement` - Element `<tr>` yang berisi data tamu

**Example:**
```javascript
// Mode display (read-only)
const row = createGuestRow(guest, false);
tableBody.appendChild(row);

// Mode admin (dengan tombol aksi)
const adminRow = createGuestRow(guest, true);
tableBody.appendChild(adminRow);
```

---

## Initialization Functions

### initClock()
Menginisialisasi jam digital yang berjalan.

**Parameters:**
- Tidak ada

**Returns:**
- Tidak ada (void)

**Note:**
Membutuhkan element dengan id `clock` di HTML.

**Example:**
```javascript
initClock(); // Jam akan update setiap detik
```

---

### initDate()
Menampilkan tanggal saat ini.

**Parameters:**
- Tidak ada

**Returns:**
- Tidak ada (void)

**Note:**
Membutuhkan element dengan id `current-date` di HTML.

**Example:**
```javascript
initDate(); // Menampilkan "Senin, 1 September 2025"
```

---

### startAutoRefresh(callback, interval?)
Memulai auto-refresh untuk display board.

**Parameters:**
- `callback` (Function) - Fungsi yang akan dipanggil saat refresh
- `interval` (number, optional) - Interval dalam milidetik (default: 30000 = 30 detik)

**Returns:**
- Tidak ada (void)

**Example:**
```javascript
startAutoRefresh(() => {
    loadBoard();
}, 30000); // Refresh setiap 30 detik
```

---

### stopAutoRefresh()
Menghentikan auto-refresh.

**Parameters:**
- Tidak ada

**Returns:**
- Tidak ada (void)

**Example:**
```javascript
stopAutoRefresh(); // Berhenti auto-refresh
```

---

## Data Structure

### Guest Object
```javascript
{
    id: "guest_1234567890_abc123",  // ID unik
    nama: "John Doe",                // Nama tamu
    tanggal: "2025-09-01",           // Tanggal kunjungan (YYYY-MM-DD)
    perusahaan: "PT Maju Jaya",      // Nama perusahaan
    keperluan: "Meeting kerja sama", // Keperluan kunjungan
    status: "active",                // Status: active|ongoing|reschedule|cancel
    createdAt: "2025-09-01T10:00:00.000Z",  // Waktu pembuatan
    updatedAt: "2025-09-01T14:30:00.000Z"   // Waktu update (optional)
}
```

### Auth Object (localStorage)
```javascript
{
    loggedIn: true,
    timestamp: "2025-09-01T10:00:00.000Z"
}
```

---

## Error Handling

Semua fungsi menggunakan pendekatan defensive programming:

1. **getGuests()** - Mengembalikan array kosong jika data tidak valid
2. **isLoggedIn()** - Mengembalikan `false` jika parsing gagal
3. **importFromJSON()** - Menggunakan Promise dengan reject untuk error handling

---

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

**Note:**
- Menggunakan ES6+ features (arrow functions, template literals, destructuring)
- Menggunakan localStorage (tidak mendukung IE8 ke bawah)
