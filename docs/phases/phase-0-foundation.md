# Phase 0 · Fondasi

## Tujuan

Menyiapkan dasar yang dipakai semua phase: semua token warna AppColor, gaya teks, struktur folder, dan konten
yang dipindah ke `src/content/`. Tampilan halaman belum berubah banyak.

## Prasyarat

- Setup awal sudah ada (Next 16, Tailwind 4, static export).

## Baca dulu

- `docs/01-design-system.md` (semua)
- `docs/04-architecture.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/` bagian fonts dan CSS

## Tugas

- [x] `src/app/globals.css`: ganti token lama (`--cream`, `--tile`, ...) dengan **semua** token di
      `01-design-system.md`, nama sesuai AppColor (kebab-case). Light di `:root`, dark di
      `@media (prefers-color-scheme: dark)`, lalu daftarkan di `@theme inline` sebagai `--color-*`.
- [x] Tambah token turunan: `--home-daily-log-card`, `--log-field`, `--log-chip`, `--log-placeholder`,
      `--voice-muted`, `--frame-line`, `--shadow`, `--text-muted` (pakai `color-mix`).
- [x] Matikan warna bawaan Tailwind supaya tidak bisa dipakai tanpa sengaja:
      `@theme { --color-*: initial; }` sebelum token Claire (cek sintaks di dokumentasi Tailwind 4).
- [x] Gaya teks sebagai utility di `globals.css` (`@utility`): `type-display-xl`, `type-display-l`, `type-label`,
      `type-body-l`, `type-body`, `type-small`, ukuran sesuai tabel tipografi.
- [x] Ganti semua class lama di komponen (`bg-cream`, `text-ink`, `bg-tile`, `bg-accent`, `text-navy`, `bg-star`)
      ke nama baru (`bg-home-cream`, `text-home-ink`, `bg-home-tile`, `bg-home-accent`, `text-navy`, `bg-home-star`).
- [x] Perbaiki teks tombol kuning di Hero: `text-[#366799]` → `text-voice-bottom` (kontras 4,22 → 9,55, tetap di
      dark mode; `text-navy` ternyata jadi terang di dark mode).
- [x] Buat folder kosong sesuai `04-architecture.md`: `src/lib/parallax/`, `src/timeline/`,
      `src/components/{layout,parallax,scenes,ui,sections,easter-egg}/` (isi `.gitkeep` bila perlu).
- [x] Pindah `SiteHeader.tsx` dan `SiteFooter.tsx` ke `src/components/layout/`.
- [x] Pecah `src/content/site.ts` menjadi `site.ts`, `scenes.ts`, `features.ts`, `about.ts`, `screens.ts`
      dan isi dengan teks dari `03-content.md` (semua scene, semua kartu fitur, About, footer, metadata).
      `screens.ts` boleh berisi daftar nama file saja dulu (gambar dibuat di phase 1).
- [x] Update `metadata` di `layout.tsx` sesuai tabel Metadata di `03-content.md`.
- [x] Tambah `lucide-react` kalau ikon akan dipakai (`npm install lucide-react`).
- [x] Tambah `CLAUDE.md`/README bila ada aturan baru yang perlu diingat (teks di atas `home-star` = `voice-bottom`).

## File

| Aksi | File |
|---|---|
| Ubah | `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/*` |
| Buat | `src/content/{scenes,features,about,screens}.ts`, folder baru |
| Pindah | `SiteHeader.tsx`, `SiteFooter.tsx` → `src/components/layout/` |

## Selesai jika

- [x] `grep -rnE "#[0-9a-fA-F]{3,8}" src --include=*.tsx` tidak menemukan hex di komponen.
- [x] Semua hex di `globals.css` ada di tabel `01-design-system.md`.
- [x] Class `bg-zinc-*`, `text-gray-*`, `bg-black` dan sejenisnya gagal/tidak ada.
- [x] Semua teks dari `03-content.md` ada di `src/content/`.
- [x] Halaman tetap tampil seperti sebelumnya (light dan dark), tombol kuning teksnya `voice-bottom`.
- [x] `npm run lint` dan `npm run build` lolos.

## Cara cek

```bash
npm run lint
```

```bash
npm run build
```

Buka `npm run dev`, cek light dan dark mode.

## Bukan bagian phase ini

Gambar baru, mesin parallax, scene, desain ulang halaman.
