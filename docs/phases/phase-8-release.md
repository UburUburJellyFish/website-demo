# Phase 8 · Rilis

## Tujuan

Website online di hosting statis, dengan semua teks yang sudah dikonfirmasi.

## Prasyarat

- Phase 7 selesai.
- Semua baris "Perlu konfirmasi" di `03-content.md` sudah dijawab (terutama link TestFlight, versi iOS, privasi).

## Tambahan dari Aaron (2026-11-25)

- [x] QR di CTA diperbesar: kartu mengikuti tinggi layar (sampai 30rem, 435px di 1280×800, dulu 256px), di tengah
      vertikal; balon di kiri dari 1280px, di atas kartu di bawahnya. QR WebP 900px.
- [x] Halaman Privacy Policy `/privacy` untuk App Store (isi dari audit kode app, kontak `supportclaires@gmail.com`). Link di footer.
      Lihat `03-content.md`, "/privacy".
- [x] Revisi: desain `/privacy` dirombak supaya tidak mirip website teman, dalam gaya Claire, memakai skill
      UI/UX Pro Max (dipasang di `~/.claude/skills/`): hero langit bintang + maskot, kartu clay warna deck, 4 bab dengan
      balon Claire, bar bab sticky + progres baca.

## Tugas

- [x] Pilih hosting (keputusan Aaron / tim): **Vercel**.

  | Pilihan | Catatan |
  |---|---|
  | Vercel | Paling mudah untuk Next, gratis untuk proyek pribadi, deploy otomatis dari GitHub |
  | Netlify | Sama mudahnya, upload folder `out/` atau sambung GitHub |
  | GitHub Pages | Gratis, butuh `basePath` kalau tidak pakai domain sendiri (cek dokumentasi `basePath`) |

- [x] Domain (opsional) dan `metadataBase` di `layout.tsx`. `site.url` = `https://claire-peach.vercel.app` (tanpa
      domain sendiri); `metadataBase`, `sitemap.xml` dan baris Sitemap di `robots.txt` ikut dari situ.
- [x] Buat repo GitHub untuk website (izin Aaron dulu, termasuk nama repo dan public/private). Sudah dibuat Aaron:
      `UburUburJellyFish/website-demo` (baru berisi commit awal). **Commit/push belum diizinkan.**
- [ ] Cek akhir sebelum deploy:
  - [x] `npm run lint` dan `npm run build` lolos.
  - [x] Buka `out/` dengan server statis lokal, cek semua scene, link, dan gambar. (`scripts/test/gzip-server.mjs`)
  - [x] Tidak ada teks placeholder (`[nama anggota tim]`, `TODO`) di halaman.
  - [x] Tidak ada data kesehatan asli di screenshot. (data contoh "Sticky", phase 1)
  - [x] Link "Join the beta" dan QR membuka TestFlight yang benar. (`https://testflight.apple.com/join/utWcPjDc`)
  - [x] Disclaimer dan kalimat merek Apple ada di footer.
- [x] Deploy, lalu cek URL live di HP dan laptop. Di-deploy Aaron lewat Vercel (2026-11-25). Dicek di Chrome (built-in
      browser) desktop 1280×800 dan ukuran HP 375×812: semua halaman/file 200, Brotli aktif, link header tepat (klik
      sungguhan), `/privacy` tanpa scroll horizontal, console bersih. **Belum dicek di iPhone sungguhan (Safari).**
- [x] Tulis URL live dan cara deploy ulang di `README.md`.

## Selesai jika

- [ ] Website bisa dibuka dari URL publik di iPhone (Safari) dan laptop (Chrome, Safari).
- [x] Lighthouse di URL live sama dengan hasil phase 7. Lebih baik: Home dan `/privacy` 100/100/100/100 di mobile dan
      desktop (Vercel memakai CDN + Brotli).
- [ ] `docs/README.md`: semua phase dicentang.
