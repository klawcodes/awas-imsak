<div align="center">

<img src="public/img/icon-app.png" alt="Ikon Awas Imsak" width="140" />

# 🌙 Awas Imsak

**Teman setia Anda dalam bulan puasa.**
Temukan jadwal imsak dan sholat, serta fitur-fitur lainnya untuk mendukung puasa Anda dengan lebih baik.

[🌐 Buka Aplikasi](https://imsak.my.id) · [🐛 Laporkan Bug](https://github.com/klawcodes/awas-imsak/issues) · [💡 Usul Fitur](https://github.com/klawcodes/awas-imsak/issues)

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-7-119EFF?logo=capacitor&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## ✨ Tentang

**Awas Imsak** adalah aplikasi web (dan Android lewat Capacitor) untuk menemani ibadah puasa, terutama di bulan Ramadhan. Aplikasi ini menampilkan jadwal imsak dan sholat agar Anda tidak terlewat waktu penting.

Versi web tersedia di **[imsak.my.id](https://imsak.my.id)**.

## 🧰 Tech Stack

| Kategori   | Teknologi                                                                   |
| ---------- | --------------------------------------------------------------------------- |
| Framework  | [Next.js 14](https://nextjs.org/) (App Router) + React 18                   |
| Bahasa     | TypeScript                                                                  |
| Styling    | Tailwind CSS, [NextUI](https://nextui.org/)                                 |
| State      | Redux Toolkit, React Redux                                                  |
| Animasi    | Framer Motion, GSAP, AOS, tsParticles                                       |
| UI lainnya | React Select, React Hot Toast, React Paginate, Slick Carousel, Font Awesome |
| Mobile     | [Capacitor](https://capacitorjs.com/) (Android)                             |

## 📁 Struktur Proyek

```
awas-imsak/
├── android/        # Project Android (Capacitor)
├── app/            # Halaman & routing (Next.js App Router)
├── components/     # Komponen UI
├── fonts/          # Font lokal
├── public/         # Aset statis
├── redux/          # Store, slice, dan state management
├── utils/          # Fungsi bantu
├── capacitor.config.ts
├── next.config.mjs
└── tailwind.config.ts
```

## 🚀 Menjalankan Secara Lokal

### Prasyarat

- [Node.js](https://nodejs.org/) 18.17 atau lebih baru
- npm / yarn / pnpm

### Langkah

```bash
# 1. Clone repo
git clone https://github.com/klawcodes/awas-imsak.git
cd awas-imsak

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Script yang tersedia

| Perintah        | Fungsi                         |
| --------------- | ------------------------------ |
| `npm run dev`   | Menjalankan server development |
| `npm run build` | Build untuk production         |
| `npm run start` | Menjalankan hasil build        |
| `npm run lint`  | Mengecek kode dengan ESLint    |

## 📱 Build Android (Capacitor)

```bash
# Build project web
npm run build

# Sinkronkan ke project Android
npx cap sync android

# Buka di Android Studio
npx cap open android
```

> Pastikan `webDir` pada `capacitor.config.ts` sesuai dengan folder hasil build Anda.

## 🤝 Kontribusi

Kontribusi, issue, dan usulan fitur sangat disambut.

1. Fork repo ini
2. Buat branch baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m "Tambah fitur ..."`
4. Push: `git push origin fitur/nama-fitur`
5. Buka Pull Request

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi **MIT**. Lihat file [`LICENSE`](./LICENSE) untuk detail lengkapnya.

Anda bebas menggunakan, memodifikasi, dan mendistribusikan proyek ini, **dengan syarat tetap menyertakan pemberitahuan hak cipta (copyright) dan teks lisensi asli** di setiap salinan atau turunannya. Mengganti nama atau menghapus atribusi pembuat asli tanpa kredit merupakan pelanggaran lisensi.

## 👤 Pembuat

Dibuat oleh [**klawcodes**](https://github.com/klawcodes).

Kalau proyek ini bermanfaat, jangan lupa beri ⭐ di repo ini.
