# Phase 1 · Aset

## Tujuan

Semua gambar yang dibutuhkan website sudah ada di `public/images/`, dikecilkan, dalam WebP, dan terdaftar
di `src/content/screens.ts` dengan alt text dan ukurannya.

## Prasyarat

- Phase 0 selesai.
- Repo app ada di `/Users/aaron/Documents/App/C5-M01-UburUbur` (hanya dibaca).
- `ffmpeg` terpasang.

## Baca dulu

- `docs/05-assets.md` (semua)

## Tugas

- [x] `npm install -D sharp`.
- [x] Buat `scripts/optimize-images.mjs` sesuai spesifikasi di `05-assets.md`. Tambah script `"images"` di
      `package.json`.
- [x] Tambah `assets-src/` ke `.gitignore`.
- [x] Brand: konversi wordmark, ikon, maskot utama, maskot widget ke `public/images/brand/`.
      Hapus `public/images/claire-wordmark.webp` dan `claire-star.png` lama, update semua pemakaiannya.
      `src/app/icon.png` tetap PNG 512² (favicon).
- [x] Wordmark versi dark `public/images/brand/claire-wordmark-dark.webp`: di skrip, ganti warna piksel biru/navy
      ke `#B0C5E8` (alpha tetap), piksel kuning bintang tidak diubah. Pakai di `IntroScene`/`Hero` lewat `<picture>`
      dengan `media="(prefers-color-scheme: dark)"`, lalu hapus class `dark:invert dark:hue-rotate-180`.
- [x] Ikon perasaan: 7 file ke `public/images/feelings/`.
- [x] Screenshot: buka tiap rekaman, tentukan detik terbaik, ambil frame dengan ffmpeg ke `assets-src/screens/`,
      lalu konversi ke `public/images/screens/`. Catat detik yang dipakai di tabel `05-assets.md`.
- [x] **Cek tiap screenshot**: tidak ada data asli, tidak ada tulisan "Mock data", tidak ada notifikasi,
      tidak ada label debug.
- [x] QR: konversi `Claire-QR-3-Peek.png`, lalu scan dengan iPhone untuk memastikan masih terbaca.
- [x] Isi `src/content/screens.ts`: `{ src, alt, width, height }` untuk tiap screenshot. Brand, perasaan, QR di
      `src/content/images.ts`.
- [x] Kalau ada screenshot yang tidak bisa didapat (mis. voice log dengan jawaban Claire, widget Lock Screen),
      tulis di bagian "Perlu konfirmasi" di `03-content.md` dan pakai pengganti sementara.

## File

| Aksi | File |
|---|---|
| Buat | `scripts/optimize-images.mjs`, `public/images/{brand,feelings,screens,qr}/*`, isi `src/content/screens.ts` |
| Ubah | `package.json`, `.gitignore`, komponen yang memakai gambar lama |
| Hapus | `public/images/claire-wordmark.webp`, `public/images/claire-star.png` (setelah dipindah) |

## Selesai jika

- [x] Semua file di tabel `05-assets.md` ada.
- [x] Tidak ada gambar di `public/` yang lebih dari 300 KB (kecuali GIF opsional, max 600 KB).
- [x] Total `public/images/` di bawah 4 MB.
- [x] `screens.ts` berisi lebar dan tinggi yang benar (cek dengan `sips -g pixelWidth -g pixelHeight`).
- [x] QR terbaca (dicek dengan Vision macOS, bukan kamera iPhone).
- [x] `npm run build` lolos.

## Cara cek

```bash
du -sh public/images/*
```

```bash
npm run images
```

(menjalankan dua kali tidak mengonversi ulang file yang sudah ada)

## Bukan bagian phase ini

Memakai gambar di scene (phase 3–5), video promo (phase 7).
