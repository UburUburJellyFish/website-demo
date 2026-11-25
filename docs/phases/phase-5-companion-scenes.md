# Phase 5 · Scene pendamping: Tips, Dose, History & Insights, Connect, CTA

## Tujuan

Sisa timeline (keyframe 15–24) jadi, sampai parallax selesai dan halaman lanjut ke bagian biasa.

## Prasyarat

- Phase 4 selesai.

## Baca dulu

- `docs/02-parallax.md` keyframe 15–24 dan mobile
- `docs/03-content.md` scene `tips`, `dose`, `history`, `connect`, `cta`

## Tugas

### `tips` (keyframe 15–16)

- [x] `TipCard`: kartu `home-card` dengan garis kiri tebal `range-low` atau `range-high`, judul tebal + teks.
- [x] `TipsScene`: label + `tips-text`, `card-low` masuk dari kiri, `card-high` dari kanan sedikit telat.
      HP geser ke kanan (mobile: turun dan mengecil) dengan layar `tips-low.webp`.

### `dose` (keyframe 17–18)

- [x] `DoseScene`: `dose-statement` (display-xl, `home-cream`) dan `dose-sub` di tengah.
      Latar `home-cream` → `voice-bottom`, `tone: "dark"`. HP keluar ke bawah.

### `history` (keyframe 19–20)

- [x] `HistoryScene`: dinding HP miring −12°, 3 kolom (mobile 2) × 3 HP kecil, isi sesuai `03-content.md`.
      Kolom bergerak dengan kecepatan berbeda.
- [x] `wall-hero` = HP Summary di kolom tengah: di keyframe 20 lepas dari dinding, tegak, membesar 1.3
      (dibangun sebagai HP Summary terpisah yang naik dari bawah sambil berputar −12° → 0° dan membesar 0.6 → 1,
      karena kolom dinding ada di dalam wadah miring)
      (homage iPhone berputar di referensi). Dinding memudar ke 0.25.
- [x] `history-text` lalu `insight-text`, `bubble-insight` ("Here's what I noticed this week.").
- [ ] Ikon perasaan kecil (`feelings/*.webp`) melayang di sekitar dinding sebagai dekorasi (opsional, **dilewati**).
- [x] Latar `voice-bottom` → `home-background`, `tone: "light"`.

### `connect` (keyframe 21–22)

- [x] `ConnectChip`: chip `home-card`, ikon dalam lingkaran `home-accent`, judul tebal + teks pendek.
- [x] `ConnectScene`: HP kembali ke tengah dengan `widget.webp`. 4 chip mulai di pojok, lalu terbang ke posisi
      melingkari HP (kebalikan ledakan). Maskot `claire-star-widget.webp` kecil di pojok HP (opsional).

### `cta` (keyframe 23–24)

- [x] `CtaScene`: latar `home-background` → `home-star`. Judul, teks, tombol "Join the beta" (gaya tombol kedua
      dengan garis dan teks `voice-bottom` supaya terlihat di latar kuning, juga di dark mode), `qr-card` (kartu `home-cream` berisi QR, seperti
      penutup video). Balon "See you there!". `anchor: "beta"`.
- [x] Mobile: QR disembunyikan, tombol lebih besar.
- [x] Link TestFlight diambil dari `src/content/site.ts`. Kalau belum ada, tombol menunjuk ke `#beta` dan beri
      komentar `TODO` di `site.ts` (lihat "Perlu konfirmasi").

## Selesai jika

- [x] Seluruh timeline 1–24 bisa di-scroll dari awal sampai akhir tanpa elemen nyangkut.
- [x] Setelah keyframe 24, halaman lanjut scroll biasa ke konten di bawahnya.
- [x] Teks di latar kuning (`voice-bottom`) dan latar navy (`on-dark`) lolos kontras, light dan dark.
- [x] Desktop, tablet, mobile, dark mode, reduced motion rapi.
- [x] `npm run lint` dan `npm run build` lolos.

## Bukan bagian phase ini

Bagian Features, About, Footer, header nav.
