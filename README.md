# Claire Website

Website untuk aplikasi Claire. Hanya frontend: tidak ada database, API, atau penyimpanan data.
Dibuat dengan Next.js 16 (App Router), TypeScript, dan Tailwind CSS 4.

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Build

```bash
npm run build
```

Hasilnya HTML/CSS/JS statis di folder `out/` (`output: "export"` di `next.config.ts`).
Folder itu bisa di-upload ke hosting statis mana pun (Vercel, Netlify, GitHub Pages).

## Struktur folder

```
src/
  app/
    layout.tsx      font, metadata, <html>
    page.tsx        halaman utama, menyusun komponen
    globals.css     warna brand (dari AppColor.swift) + Tailwind
    icon.png        favicon (bintang Claire)
    fonts/          Astonpoliz.ttf (font judul)
  components/       satu komponen per file
  content/
    site.ts         semua teks website ada di sini
public/
  images/           wordmark dan bintang Claire
```

## Catatan

- Ganti teks di `src/content/site.ts`, bukan di komponen.
- Warna: `bg-cream`, `bg-tile`, `bg-accent`, `text-ink`, `text-navy`, `bg-star`, `bg-orange`.
  Nilainya di `src/app/globals.css`, ikut light/dark mode.
- Font judul: class `font-display`.
- Karena static export, fitur yang butuh server tidak bisa dipakai
  (Server Actions, Route Handlers, cookies, `cacheComponents`).
