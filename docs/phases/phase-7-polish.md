# Phase 7 · Polish: responsif, aksesibilitas, performa, SEO, easter egg

## Tujuan

Website rapi di semua ukuran layar, bisa dipakai semua orang, cepat, mudah ditemukan, dan punya kejutan kecil
seperti app-nya.

## Prasyarat

- Phase 6 selesai.

## Tambahan dari Aaron (2026-11-25)

- [x] Dark mode dihapus, website light saja (`01-design-system.md`, "Dark mode").
- [x] Bingkai HP diganti bezel iPhone resmi Apple; aturan "Apple Product Images" dipatuhi sebisanya (tanpa bayangan,
      miring, putar; tidak ada yang menimpa bezel). Detail di `02-parallax.md`, "Seperti yang dibangun di phase 7".

## Tugas

### Responsif

- [x] Cek di 320, 375, 414, 768, 1024, 1280, 1440, 1920 px lebar. Tidak ada scroll horizontal.
      Juga dicek "tidak ada yang menimpa bezel" dengan skrip di semua ukuran (`02-parallax.md`, phase 7).
- [x] Cek landscape HP (812×375): parallax tetap jalan atau teks tidak tertutup HP.
      Di bawah tinggi 600px halaman bertumpuk (tanpa parallax), jadi tidak ada yang tertutup.
- [ ] Safari iOS: address bar muncul/hilang tidak membuat scene loncat.
      **Belum diuji di Safari sungguhan** (Simulator sedang dipakai sesi lain). Kodenya: perubahan tinggi saja < 15%
      diabaikan engine, dan peralihan mode di layar sentuh hanya terjadi kalau lebar berubah. Uji di phase 8.

### Aksesibilitas (WCAG 2.1 AA)

- [x] Satu `<h1>` (di `intro`), heading berurutan di scene dan section. (`SceneLabel` sekarang `h2`.)
- [x] Semua gambar punya alt yang benar; dekorasi (`StarField`, glow) `aria-hidden` dan `alt=""`. (Bezel `alt=""`
      + `aria-hidden`, bintang header = tombol dengan label "Claire's star".)
- [x] Fokus keyboard terlihat jelas (outline `navy`, di latar gelap `home-cream`). (Aturan global `:focus-visible`,
      di panggung navy `on-dark`.)
- [x] Link "Skip to features" di awal halaman untuk pengguna keyboard.
- [x] Kontras semua teks sesuai tabel `01-design-system.md`. (Light saja; pengecualian: easter egg pelangi.)
- [x] Reduced motion, zoom 200%, dan ukuran teks besar tetap terbaca. (Zoom 200% dan teks > 20px otomatis memakai
      halaman bertumpuk.)
- [x] Jalankan audit Lighthouse Accessibility, target ≥ 95. (100 mobile dan desktop)

### Performa

- [x] Lighthouse Performance mobile ≥ 85, desktop ≥ 95. (95 / 100, lihat `docs/README.md`)
- [x] Gambar di bawah layar pertama `loading="lazy"` (bawaan), wordmark `fetchPriority="high"` (bukan `priority`,
      deprecated di Next 16). **Diganti:** wordmark `preload` (sekarang hanya satu gambar, tanpa versi dark), dan
      gambar panggung yang belum tampil ditunda sampai `load` (`html.px-ready`).
- [x] Total JS halaman diperiksa di output build, mesin parallax kecil (tanpa library animasi). (150 KB gzip)
- [x] Tidak ada long task > 50ms saat scroll (Performance panel). (0 long task, median 8,3 ms/frame)

### SEO dan berbagi

- [x] `metadata` lengkap: title, description, `openGraph`, `twitter`, `metadataBase` (setelah domain jelas).
      `metadataBase` otomatis dari `site.url` (masih `null`).
- [x] `public/og.png` 1200×630: wordmark di latar `home-cream`, bintang, warna AppColor saja.
      Dibuat sebagai `src/app/opengraph-image.png` + `twitter-image.png` (konvensi file Next) oleh `npm run og`.
- [x] `robots.txt` dan `sitemap.xml` statis (cek cara Next 16 untuk static export di dokumentasi).
      `robots.ts`/`sitemap.ts` dengan `dynamic = "force-static"`. Sitemap kosong sampai `site.url` diisi.
- [x] Teks semua scene ada di HTML hasil build (cek `out/index.html`).

### Easter egg

- [x] `RainbowStar` (`"use client"`): ketuk ikon bintang di header 8 kali berturut-turut → latar halaman berputar
      melewati pelangi `hsl(<hue> 100% 77.5%)` (sama dengan `AppColor.rainbow`), 8 kali lagi kembali normal.
      Tidak disimpan. Mati saat reduced motion (cukup ganti ke satu warna pelangi tanpa berputar).
      **Mengikuti app** (`HomeView.swift`, `HomeBackground.swift`): jeda antar ketukan ≤ 2 detik, satu putaran
      8 detik, saat reduced motion 24 detik (pelan, bukan diam). Bintang header jadi tombol; nama "Claire" tetap
      link ke atas.
- [x] Getar kecil (`navigator.vibrate`) kalau tersedia, seperti `sensoryFeedback` di app.

### Video (opsional, putuskan dulu)

- [ ] Kalau dipakai: kompres `Claire-Promo.mp4` sesuai `05-assets.md`, taruh di bawah About,
      `preload="none"`, `poster`, kontrol tampil, tanpa autoplay bersuara. **Belum diputuskan Aaron, dilewati.**

## Selesai jika

- [x] Semua target Lighthouse tercapai (catat angkanya di `docs/README.md`).
- [x] Easter egg jalan di desktop (klik) dan HP (tap). (Diuji dengan klik; tap memakai event yang sama,
      `touch-action: manipulation` supaya ketukan cepat tidak memicu zoom.)
- [x] `npm run lint` dan `npm run build` lolos.
