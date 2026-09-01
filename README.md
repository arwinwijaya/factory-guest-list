# Factory Guest List 🏭

Aplikasi web untuk mengelola daftar tamu pabrik dengan antarmuka yang mudah digunakan.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.3.0-green.svg)

## ✨ Fitur Utama

- 🔐 **Login Authentication** - Akses admin wajib login terlebih dahulu
- 👥 **CRUD Operations** - Tambah, lihat, ubah status, hapus tamu
- 🏷️ **Status Management** - Active (otomatis), On-Going, Reschedule, Cancel
- 📅 **Date Validation** - Tidak bisa buat agenda dari tanggal kemarin
- 🔄 **Auto Status** - Status otomatis berdasarkan tanggal (hari ini = Active, masa depan = On-Going)
- 🗑️ **Auto Cleanup** - Tamu dengan tanggal lewat otomatis dihapus
- 🖥️ **Display Board** - Tampilan publik untuk lobby/resepsionis
- 📦 **Export/Import** - Backup dan restore data (JSON)
- 🎯 **Favicon** - Logo GGF di tab browser

## 🚀 Demo

Buka `login.html` di browser untuk mencoba aplikasi.

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

## 📁 Struktur Project

```
factory-guest-list/
├── admin.html          # Halaman admin (CRUD)
├── display.html        # Tampilan board tamu
├── login.html          # Halaman login
├── css/
│   └── style.css       # Stylesheet dengan CSS variables
├── js/
│   └── app.js          # Logic aplikasi
├── img/
│   └── GGF.png         # Logo GGF
├── tests/
│   └── js/             # Unit tests
├── docs/               # Dokumentasi
└── WORK-INSTRUCTION.md # Panduan kerja
```

## 🎨 Tema & Warna

Aplikasi menggunakan warna brand GGF (Global Green Factory):

| Warna | Kode | Penggunaan |
|-------|------|------------|
| Hijau | `#006B3F` | Primary, tombol, heading, status Active |
| Orange | `#F5A623` | Status On-Going |
| Kuning | `#C4D600` | Aksen kecil, status Reschedule |
| Teal | `#4ECDC4` | Status Cancel |

## 📱 Responsive

Aplikasi mendukung tampilan:
- Desktop (>= 768px)
- Mobile (< 768px) dengan hamburger menu

## 🛠️ Teknologi

- **HTML5** - Struktur halaman
- **CSS3** - Styling dengan CSS Variables
- **JavaScript** - Logic aplikasi (Vanilla JS)
- **Flatpickr** - Date picker (CDN)
- **Vitest** - Unit testing

## 📦 Installation

1. Download file ZIP aplikasi
2. Ekstrak file ZIP ke folder yang diinginkan
3. Buka file `login.html` di browser
4. Login dengan kredensial default (`admin` / `admin123`)

📖 **Panduan lengkap:** Lihat [docs/SETUP.md](docs/SETUP.md)

## 📖 Dokumentasi

| Dokumen | Deskripsi |
|---------|----------|
| [SETUP.md](docs/SETUP.md) | Panduan instalasi dan setup |
| [WORK-INSTRUCTION.md](WORK-INSTRUCTION.md) | Panduan kerja dan flow proses |
| [API.md](docs/API.md) | Dokumentasi fungsi JavaScript |
| [CHANGELOG.md](CHANGELOG.md) | Riwayat perubahan versi |

## 🧪 Testing

```bash
# Jalankan semua tests
npx vitest run

# Jalankan tests dengan watch mode
npx vitest

# Jalankan tests tertentu
npx vitest run tests/js/status.test.js
```

### Test Coverage

| Test File | Tests | Deskripsi |
|-----------|-------|-----------|
| style.test.js | 27 | CSS theme & status badges |
| nav.test.js | 10 | Navigation bar |
| status.test.js | 28 | Status flow & conditional buttons |
| sort.test.js | 13 | Date sorting |
| datepicker.test.js | 13 | Flatpickr integration & minDate |
| **Total** | **94** | |

## 📝 Git Convention

```
feat(scope): description    # Fitur baru
fix(scope): description     # Bug fix
docs(scope): description    # Dokumentasi
chore(scope): description   # Maintenance
```

**Scopes:** `theme`, `nav`, `status`, `sort`, `datepicker`

## 🤝 Contributing

1. Fork repository
2. Buat branch baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'feat: add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

Lihat `CONTRIBUTING.md` untuk panduan lengkap.

## 📄 License

MIT License - Lihat `LICENSE` untuk detail.

## 👥 Team

- **GGF Team** - Factory Guest List Development

## 📞 Support

Untuk bantuan atau pertanyaan:
- Buat issue di GitHub
- Email: muhamad.arwinwijaya@gg-foods.com

## 🙏 Acknowledgments

- GGF (Global Green Factory) untuk brand guidelines
- Flatpickr untuk date picker library
- Vitest untuk testing framework

---

**Made with ❤️ for Factory Management**
