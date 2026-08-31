# Factory Guest List 🏭

Aplikasi web untuk mengelola daftar tamu pabrik dengan antarmuka yang mudah digunakan.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## ✨ Fitur Utama

- 🔐 **Login Authentication** - Akses admin terbatas
- 👥 **CRUD Operations** - Tambah, lihat, ubah status, hapus tamu
- 🏷️ **Status Management** - Active, On-Going, Reschedule, Cancel
- 📅 **Date Sorting** - Urutan berdasarkan tanggal kunjungan
- 🖥️ **Display Board** - Tampilan publik untuk lobby/resepsionis
- 📦 **Export/Import** - Backup dan restore data (JSON)

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
| Hijau | `#006B3F` | Primary, navbar, header |
| Orange | `#F5A623` | Aksen, status On-Going |
| Kuning | `#C4D600` | Status Reschedule |
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

```bash
# Clone repository
git clone https://github.com/arwinwijaya/factory-guest-list.git

# Masuk ke folder project
cd factory-guest-list

# Install dependencies (untuk testing)
npm install

# Jalankan tests
npx vitest run
```

## 🚀 Deployment

### Static Hosting (Recommended)

1. Upload semua file ke web hosting (Netlify, Vercel, GitHub Pages)
2. Pastikan file berikut ada di root:
   - `login.html`
   - `admin.html`
   - `display.html`
   - `css/style.css`
   - `js/app.js`
   - `img/GGF.png`

### Local Development

```bash
# Menggunakan Python
python -m http.server 8000

# Menggunakan Node.js
npx serve .

# Buka browser
http://localhost:8000/login.html
```

## 📖 Dokumentasi

Lihat `WORK-INSTRUCTION.md` untuk panduan lengkap:
- Flow Process
- Work Instructions
- Troubleshooting
- Version History

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
| status.test.js | 21 | Status flow |
| sort.test.js | 13 | Date sorting |
| datepicker.test.js | 12 | Flatpickr integration |
| **Total** | **83** | |

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

- **Xiaomi LLM Core Team** - AI Assistant Development

## 📞 Support

Untuk bantuan atau pertanyaan:
- Buat issue di GitHub
- Email: [your-email@example.com]

## 🙏 Acknowledgments

- GGF (Global Green Factory) untuk brand guidelines
- Flatpickr untuk date picker library
- Vitest untuk testing framework

---

**Made with ❤️ for Factory Management**
