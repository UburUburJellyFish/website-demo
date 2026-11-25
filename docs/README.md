# Rencana Website Claire

Rencana lengkap website Claire: website satu halaman dengan **parallax seperti
[davegamache.com/parallax](http://davegamache.com/parallax/)**, semua fitur app, dan bagian About.
Semua warna memakai hex dari `AppColor.swift` di app.

Kerjakan **per phase, berurutan**. Satu phase = satu sesi kerja = satu commit.

> Status kerja terkini, langkah berikutnya, dan log ada di [`../PROGRESS.md`](../PROGRESS.md).
> Baca itu dulu. Instruksi untuk Gemini ada di [`../GEMINI.md`](../GEMINI.md).

## Aturan utama

1. **Hanya frontend.** Static export (`out/`), tanpa database, API, form, cookie, login, atau analytics.
2. **Warna hanya dari AppColor.** Daftar lengkap di `01-design-system.md`. Transparansi boleh, hex lain tidak.
3. **Parallax mengikuti referensi.** Mesin sendiri dengan cara kerja yang sama, lihat `02-parallax.md`.
4. **Teks website bahasa Inggris**, ditulis di `src/content/`, isinya di `03-content.md`.
5. **Claire tidak pernah menentukan dosis.** Semua teks harus konsisten dengan ini.
6. **Satu komponen per file.**
7. **Next.js 16 berbeda dari versi lama.** Baca `node_modules/next/dist/docs/` sebelum menulis kode
   (lihat `AGENTS.md`).
8. Repo app (`C5-M01-UburUbur`) hanya dibaca, tidak diubah.

## Dokumen

| File | Isi |
|---|---|
| [01-design-system.md](01-design-system.md) | Semua warna AppColor (website light saja), kontras, tipografi, bentuk, komponen visual (bezel Apple), gerak |
| [02-parallax.md](02-parallax.md) | Analisis referensi, cara kerjanya, spesifikasi mesin, timeline 24 keyframe (desktop dan mobile) |
| [03-content.md](03-content.md) | Daftar 19 fitur app, semua teks scene, Everything in Claire, About, Footer, hal yang perlu dikonfirmasi |
| [04-architecture.md](04-architecture.md) | Struktur folder, daftar komponen, alur data, dependensi, konfigurasi Next |
| [05-assets.md](05-assets.md) | Semua gambar: asal di repo app, tujuan, ukuran, cara ambil screenshot dari rekaman |
| [phases/](phases/) | Satu file per phase |

## Phase

| Phase | Nama | Hasil | Status |
|---|---|---|---|
| 0 | [Fondasi](phases/phase-0-foundation.md) | Semua token AppColor, gaya teks, struktur folder, konten di `src/content/` | [x] |
| 1 | [Aset](phases/phase-1-assets.md) | Screenshot, maskot, ikon perasaan, QR dalam WebP | [x] |
| 2 | [Mesin parallax](phases/phase-2-parallax-engine.md) | Mesin + panggung sticky, diuji dengan 2 scene dummy | [x] |
| 3 | [Scene pembuka](phases/phase-3-opening-scenes.md) | Intro, Burden (16 tile meledak), Meet Claire | [x] |
| 4 | [Scene mencatat](phases/phase-4-logging-scene.md) | Voice, Meal, Glucose, Insulin, Activity | [x] |
| 5 | [Scene pendamping](phases/phase-5-companion-scenes.md) | Tips, Your dose, History & Insights, Connect, CTA | [x] |
| 6 | [Bagian biasa](phases/phase-6-sections.md) | Header + nav, Everything in Claire, About, Footer | [x] |
| 7 | [Polish](phases/phase-7-polish.md) | Responsif, aksesibilitas, performa, SEO, easter egg | [x] |
| 8 | [Rilis](phases/phase-8-release.md) | Deploy ke hosting statis: https://claire-peach.vercel.app | [ ] tinggal cek di iPhone (Safari) |

Phase 1 dan 2 tidak saling bergantung, jadi boleh dikerjakan bersamaan. Phase lain berurutan.

### Lighthouse (phase 7, 2026-11-25)

Build produksi, Lighthouse 13.6 di Chrome headless, server lokal dengan gzip (seperti hosting sungguhan).

| | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Mobile | 95 | 100 | 100 | 100 | 0,9 s | 2,9 s | 0 ms | 0 |
| Desktop | 100 | 100 | 100 | 100 | 0,2 s | 0,6 s | 0 ms | 0 |
| Live mobile (phase 8, Vercel) | 100 | 100 | 100 | 100 | 1,1 s | 1,5 s | 20 ms | 0,001 |
| Live desktop (phase 8, Vercel) | 100 | 100 | 100 | 100 | 0,3 s | 0,5 s | 0 ms | 0 |

JS halaman: 7 file, 150 KB gzip (sebagian besar React/Next). Mesin parallax ±730 baris TypeScript, tanpa library
animasi. Server tanpa kompresi (`python3 -m http.server`) memberi skor mobile lebih rendah (±77): itu bukan angka
hosting sungguhan.

## Cara menjalankan satu phase

1. Buka `PROGRESS.md`, isi "Sedang dikerjakan".
2. Buka file phase-nya, cek **Prasyarat**.
3. Baca dokumen di bagian **Baca dulu**.
4. Kerjakan **Tugas** berurutan. Setiap satu tugas selesai: centang di file phase **dan** tulis satu baris di Log
   `PROGRESS.md`.
5. Cek semua poin **Selesai jika**, termasuk `npm run lint` dan `npm run build`.
6. Centang status di tabel di atas, update "Status sekarang" di `PROGRESS.md`, lalu commit dengan pesan
   `Phase N: <nama>`.

Contoh perintah untuk Claude:

```text
Kerjakan docs/phases/phase-0-foundation.md
```

## Urutan halaman (ringkas)

```
Header (tetap)
┌─ Panggung parallax (sticky, ±24 layar) ─────────────────────────────┐
│ 1 intro    Wordmark "Claire, live beyond diabetes" naik dan hilang  │
│ 2 burden   "Every. Single. Day." 16 tile log meledak                 │
│ 3 meet     Bintang Claire muncul, HP naik dengan layar Home          │
│ 4 log      Voice (latar navy) → Meal → Glucose → Insulin → Activity  │
│ 5 tips     Running low? / Running high?                              │
│ 6 dose     "Your dose, your call." (latar navy gelap)                │
│ 7 history  Dinding HP miring, HP Summary tegak dan membesar          │
│ 8 connect  Glucometer, Apple Health, reminders, widget berkumpul     │
│ 9 cta      Join the beta + QR (latar kuning bintang)                 │
└─────────────────────────────────────────────────────────────────────┘
Everything in Claire (18 kartu, 4 grup)
About Claire
Footer
```

## Keputusan yang masih terbuka

Detailnya di bagian "Perlu konfirmasi" di `03-content.md`.

- Kalimat privasi
- Nama anggota tim
- Hosting dan domain (phase 8)
- Video promo dipakai atau tidak (phase 7)

## Hasil Lighthouse

Diisi di phase 7 dan 8.

| Halaman | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Lokal (mobile) | | | | |
| Lokal (desktop) | | | | |
| Live | | | | |
