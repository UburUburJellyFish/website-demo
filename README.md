# Claire Website

Website untuk aplikasi Claire: cerita parallax, semua fitur, About, dan halaman **Privacy Policy** (`/privacy`)
untuk App Store. Hanya frontend: tidak ada database, API, cookie, analytics, atau penyimpanan data.
Next.js 16 (App Router, static export), TypeScript, Tailwind CSS 4.

**Live: https://claire-peach.vercel.app** (Privacy Policy: https://claire-peach.vercel.app/privacy)

**Rencana lengkap dan phase kerja ada di [`docs/README.md`](docs/README.md). Status terakhir di
[`PROGRESS.md`](PROGRESS.md).**

## Halaman

| URL | Isi |
|---|---|
| `/` | Cerita parallax, Everything in Claire, About |
| `/privacy` | Privacy Policy app Claire (dipakai di App Store Connect) |

## Menjalankan

```bash
npm install
```

```bash
npm run dev
```

Buka http://localhost:3000.

## Build

```bash
npm run build
```

Hasilnya HTML/CSS/JS statis di folder `out/` (`output: "export"` di `next.config.ts`).

Skrip lain: `npm run lint`, `npm run images` (gambar WebP dari repo app), `npm run og` (gambar pratinjau link).
Alat uji ada di `scripts/test/` (cara pakai di tiap file).

## Deploy ke Vercel

Hosting: **Vercel** (keputusan Aaron, 2026-11-25), project `claire` di akun Hobby Aaron, URL
https://claire-peach.vercel.app. Repo GitHub: `UburUburJellyFish/website-demo`. Vercel mengenali Next.js dan static
export sendiri, tidak perlu `vercel.json`. Catatan: paket Hobby Vercel tidak mendukung repo **private milik organisasi**;
kalau deploy dari GitHub ditolak, jadikan repo public atau deploy dari laptop dengan `npx vercel --prod`.

Pertama kali (dilakukan Aaron, butuh login):

1. Commit dan push ke `main` di `UburUburJellyFish/website-demo`.
2. Buka https://vercel.com/new, login dengan GitHub, pilih **Import** untuk repo `website-demo`
   (organisasi `UburUburJellyFish` mungkin perlu memberi izin ke Vercel).
3. Framework Preset: **Next.js** (otomatis). Build Command dan Output biarkan bawaan. Klik **Deploy**.
4. Catat URL-nya (misalnya `https://website-demo.vercel.app`, atau domain sendiri di Project → Settings → Domains).
5. Isi URL itu di `src/content/site.ts` (`url: "https://..."`), commit, push. Ini membuat `og:image` dan
   `sitemap.xml` memakai alamat yang benar.

Deploy berikutnya: cukup push ke `main`; Vercel membangun dan menayangkan otomatis. Setiap pull request mendapat
URL preview sendiri.

## App Store Connect

| Kolom | Isi |
|---|---|
| Privacy Policy URL | `https://claire-peach.vercel.app/privacy` |
| Marketing URL (opsional) | `https://claire-peach.vercel.app/` |
| Support URL | Wajib di App Store Connect dan harus berisi cara menghubungi tim. Website belum punya halaman Support; bisa memakai `/privacy#contact` sementara, atau dibuat halaman `/support` |

Isi halaman privacy berasal dari audit kode app (2026-11-25). Kalau app berubah (data baru, layanan baru),
perbarui `src/content/privacy.ts` dan tanggal "Last updated", dan pastikan label App Privacy di App Store Connect
cocok.

## Struktur folder

```
src/
  app/            layout, halaman /, /privacy, globals.css, metadata, robots, sitemap, gambar pratinjau link
  components/     satu komponen per file (layout, parallax, scenes, sections, privacy, ui, easter-egg)
  content/        semua teks website (site, scenes, features, about, privacy, images, screens)
  lib/parallax/   mesin parallax buatan sendiri
  timeline/       timeline cerita Claire
public/images/    WebP: brand, screenshot app, perasaan, QR, bezel iPhone resmi Apple
scripts/          optimize-images, make-og-image, test/
docs/             rencana dan catatan per phase
```

## Catatan

- Teks hanya di `src/content/`, bukan di komponen.
- Warna hanya token AppColor di `src/app/globals.css` (contoh `bg-home-cream`, `text-navy`). Website light saja.
- Font judul: class `font-display` (Astonpoliz).
- Static export: fitur yang butuh server tidak bisa dipakai (Server Actions, Route Handlers dinamis, cookies,
  `cacheComponents`).
