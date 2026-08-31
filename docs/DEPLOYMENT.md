# Deployment Guide - Factory Guest List

Panduan lengkap untuk deployment aplikasi Factory Guest List.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Static Hosting](#static-hosting)
- [GitHub Pages](#github-pages)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Sebelum melakukan deployment, pastikan:

1. **File yang dibutuhkan:**
   - `login.html`
   - `admin.html`
   - `display.html`
   - `css/style.css`
   - `js/app.js`
   - `img/GGF.png`

2. **Tidak membutuhkan:**
   - Backend server
   - Database
   - Node.js (untuk production)

---

## Local Development

### Menggunakan Python

```bash
# Python 3
python -m http.server 8000

# Buka browser
http://localhost:8000/login.html
```

### Menggunakan Node.js

```bash
# Install serve globally
npm install -g serve

# Jalankan server
serve .

# Buka browser
http://localhost:3000/login.html
```

### Menggunakan PHP

```bash
# Jalankan PHP built-in server
php -S localhost:8000

# Buka browser
http://localhost:8000/login.html
```

---

## Static Hosting

Aplikasi ini adalah static site, sehingga bisa dihost di mana saja yang mendukung HTML/CSS/JS.

### Struktur File untuk Deployment

```
root/
├── login.html          # Entry point
├── admin.html          # Halaman admin
├── display.html        # Display board
├── css/
│   └── style.css
├── js/
│   └── app.js
└── img/
    └── GGF.png
```

---

## GitHub Pages

### Langkah-langkah:

1. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "feat: initial deployment"
   git push origin main
   ```

2. **Aktifkan GitHub Pages:**
   - Buka repository di GitHub
   - Klik **Settings** → **Pages**
   - Pilih **Source**: `main` branch
   - Klik **Save**

3. **Akses aplikasi:**
   ```
   https://<username>.github.io/factory-guest-list/
   ```

### Custom Domain (Opsional):

1. Buat file `CNAME` di root:
   ```
   yourdomain.com
   ```

2. Update DNS record di domain registrar:
   ```
   Type: CNAME
   Name: @
   Value: <username>.github.io
   ```

---

## Netlify

### Deploy via Git:

1. **Login ke Netlify:**
   - Buka https://app.netlify.com
   - Login dengan GitHub

2. **New Site from Git:**
   - Klik **New site from Git**
   - Pilih repository
   - Konfigurasi:
     - **Branch:** `main`
     - **Build command:** (kosong)
     - **Publish directory:** `.` (root)

3. **Deploy:**
   - Klik **Deploy site**
   - Tunggu proses selesai

### Deploy via Drag & Drop:

1. **Zip semua file:**
   ```bash
   # Kecuali .git, node_modules, docs
   zip -r factory-guest-list.zip . -x ".git/*" "node_modules/*" "docs/*"
   ```

2. **Upload ke Netlify:**
   - Buka https://app.netlify.com
   - Drag & drop zip file ke area deploy

### Custom Domain:

1. Buka site settings di Netlify
2. Klik **Domain settings**
3. Klik **Add custom domain**
4. Masukkan domain dan ikuti instruksi DNS

---

## Vercel

### Deploy via CLI:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Production deploy:**
   ```bash
   vercel --prod
   ```

### Deploy via Git:

1. **Import repository:**
   - Buka https://vercel.com/new
   - Pilih repository GitHub
   - Konfigurasi:
     - **Framework Preset:** Other
     - **Build Command:** (kosong)
     - **Output Directory:** `.`

2. **Deploy:**
   - Klik **Deploy**

---

## Configuration

### Environment Variables

Aplikasi tidak membutuhkan environment variables untuk production.

### Local Storage

Data disimpan di browser user. Tidak ada backend yang diperlukan.

**Perhatian:**
- Data hanya tersimpan di browser yang digunakan
- Clearing browser data akan menghapus semua data
- Tidak ada sync antar device/browser

### Default Credentials

```
Username: admin
Password: admin123
```

**⚠️ Penting:**
- Untuk production, pertimbangkan untuk mengubah credentials
- Gunakan password yang kuat
- Pertimbangkan untuk menambahkan fitur change password

---

## Security Considerations

### Current Implementation

- Credentials hardcoded di `js/app.js`
- Data disimpan di localStorage (client-side)
- Tidak ada enkripsi

### Recommendations for Production

1. **Ubah Default Credentials:**
   ```javascript
   // Di js/app.js
   const DEFAULT_CREDENTIALS = {
       username: 'your-secure-username',
       password: 'your-secure-password'
   };
   ```

2. **Tambahkan Password Hashing (Opsional):**
   - Gunakan bcrypt atau similar
   - Hash password sebelum comparison

3. **HTTPS:**
   - Selalu gunakan HTTPS untuk production
   - Semua hosting modern mendukung HTTPS

4. **Rate Limiting (Opsional):**
   - Batasi jumlah login attempts
   - Implementasi lockout setelah beberapa percobaan gagal

---

## Performance Optimization

### Current Optimizations

- Flatpickr loaded from CDN (cached)
- CSS variables for theming
- Minimal JavaScript dependencies

### Further Optimizations (Optional)

1. **Minification:**
   ```bash
   # Install tools
   npm install -g uglify-js csso-cli

   # Minify JS
   uglifyjs js/app.js -o js/app.min.js

   # Minify CSS
   csso css/style.css -o css/style.min.css
   ```

2. **Caching:**
   - Tambahkan cache headers di hosting
   - Gunakan service worker (advanced)

3. **Image Optimization:**
   ```bash
   # Optimasi logo
   npm install -g imagemin-cli
   imagemin img/GGF.png --out-dir=img/optimized
   ```

---

## Troubleshooting

### Masalah Umum

#### 1. Halaman tidak load

**Penyebab:** File tidak lengkap atau path salah

**Solusi:**
```bash
# Cek file yang ada
ls -la

# Pastikan semua file ada
ls login.html admin.html display.html css/ js/ img/
```

#### 2. CSS tidak terapply

**Penyebab:** Path CSS salah

**Solusi:**
- Buka browser DevTools (F12)
- Tab Console - cek error 404
- Pastikan path CSS benar: `css/style.css`

#### 3. JavaScript error

**Penyebab:** File JS tidak load atau ada syntax error

**Solusi:**
- Buka browser DevTools (F12)
- Tab Console - cek error messages
- Pastikan path JS benar: `js/app.js`

#### 4. Data tidak tersimpan

**Penyebab:** localStorage tidak available

**Solusi:**
- Cek apakah cookies/blockers aktif
- Coba browser lain
- Cek DevTools → Application → Local Storage

#### 5. Login gagal

**Penyebab:** Credentials salah

**Solusi:**
- Gunakan: `admin` / `admin123`
- Clear localStorage dan coba lagi

---

## Rollback

Jika ada masalah setelah deployment:

### GitHub Pages
```bash
# Kembalikan ke commit sebelumnya
git revert HEAD
git push origin main
```

### Netlify/Vercel
- Buka dashboard
- Pilih deployment sebelumnya yang berhasil
- Klik **Promote to Production**

---

## Monitoring

### Basic Monitoring

1. **Cek uptime:**
   - Gunakan UptimeRobot (free)
   - Monitor setiap 5 menit

2. **Error tracking:**
   - Gunakan Sentry (free tier)
   - Track JavaScript errors

3. **Analytics:**
   - Tambahkan Google Analytics
   - Track page views

---

## Backup Strategy

### Data Backup

Karena data disimpan di localStorage:

1. **Export Regular:**
   - Buka admin.html
   - Klik Export
   - Simpan file JSON

2. **Automated Export (Optional):**
   - Implementasi auto-export ke cloud storage
   - Gunakan Google Drive API atau similar

### Code Backup

```bash
# Backup ke remote repository
git push origin main

# Backup ke multiple remotes
git remote add backup https://github.com/backup/factory-guest-list.git
git push backup main
```

---

## Support

Untuk bantuan deployment:

1. Buka issue di GitHub
2. Lampirkan screenshot error
3. Sertakan:
   - Browser yang digunakan
   - URL deployment
   - Error message (jika ada)

---

**Last Updated:** August 2025
