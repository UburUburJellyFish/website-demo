# Phase 6 · Bagian biasa: Header, Everything in Claire, About, Footer

## Tujuan

Konten yang di-scroll biasa setelah parallax, dan header yang bisa membawa pengunjung ke mana saja.

## Prasyarat

- Phase 5 selesai.

## Baca dulu

- `docs/03-content.md` bagian Header, `#features`, `#about`, Footer
- `docs/01-design-system.md` komponen visual

## Tugas

### Header

- [x] `SiteHeader` tetap di atas (fixed), transparan dengan sedikit blur, logo kiri, nav kanan, tombol
      "Join the beta". Warna mengikuti `data-tone` di `<html>` (`home-ink` / `home-cream`).
- [x] `HeaderNav` (`"use client"`): link Story / Features / About / Join the beta.
      Cukup link `#hash` biasa: engine mendengar `hashchange` dan lompat ke keyframe dengan `anchor` itu
      (`#story`, `#beta`); `#features` dan `#about` scroll biasa ke section. Kalau perlu dari kode, pakai
      `goToAnchor(id)` dari `src/lib/parallax/useParallax.ts`. Saat reduced motion, semuanya link anchor biasa.
      **Tambahan:** engine juga menangkap klik link ke anchor timeline (lihat `02-parallax.md`, "Seperti yang dibangun di
      phase 6"), karena klik ke hash yang sama tidak memicu `hashchange`. Footer memakai link yang sama.
- [x] Mobile: nav jadi tombol menu (ikon) yang membuka daftar link. Bisa ditutup dengan Escape dan tap di luar.
      Menu = `<details>` (bisa dibuka tanpa JavaScript, dibaca "Menu, collapsed/expanded"). Escape mengembalikan fokus
      ke tombol; memilih link juga menutup menu. Tombol "Join the beta" tetap terlihat di samping tombol menu.

### Everything in Claire (`#features`)

- [x] `FeatureSection` → 4 `FeatureGroup` (Log, Every day, Look back, Connect) → `FeatureCard`.
- [x] `FeatureCard`: ikon dalam lingkaran `home-accent`, judul, teks, latar `home-tile`, radius 3xl.
      Kartu Log memakai warna deck yang sesuai sebagai aksen kecil (titik/garis), bukan latar teks.
- [x] Grid: 1 kolom mobile, 2 kolom tablet, 3 kolom desktop.
- [x] Kartu History boleh menampilkan ikon perasaan kecil. (`ui/FeelingRow`, 5 ikon, dekorasi tanpa alt)
- [x] Efek ringan saat masuk layar (opsional): fade + naik 12px dengan `IntersectionObserver`, mati saat
      reduced motion. Bukan bagian timeline parallax.
      **Dibangun dengan CSS** (`animation-timeline: view()`, atribut `data-reveal`), bukan IntersectionObserver: tanpa
      JavaScript, dan di browser yang belum mendukung kartunya langsung tampil, jadi tidak ada yang bisa tertahan
      tersembunyi.

### About (`#about`)

- [x] `AboutSection`: judul, dua paragraf, tiga `PrincipleCard`, baris tim, kalimat privasi
      (**hanya kalau sudah dikonfirmasi**, kalau belum jangan ditampilkan).
      Daftar anggota dan kalimat privasi otomatis muncul kalau `members` diisi / `privacy.confirmed: true` di
      `src/content/about.ts`. Sekarang keduanya belum tampil.
- [x] Maskot bintang besar sebagai dekorasi di samping (desktop) atau atas (mobile).

### Footer

- [x] `SiteFooter`: disclaimer, link, hak cipta, kalimat merek Apple. Latar `home-tile`.
      Semua teks `home-ink`/`navy`: `text-muted` di atas `home-tile` hanya 3,0.

### Bersih-bersih

- [x] Hapus komponen lama dari setup awal yang sudah tidak dipakai (`Hero`, `FeatureList`, komponen lama
      `FeatureCard`/`AboutSection` di root `components/`). (`Hero` sudah dihapus di phase 2, `FeatureList` sekarang;
      `FeatureCard`/`AboutSection` ditulis ulang di `components/sections/`.)

## Selesai jika

- [x] Semua 18 kartu fitur dari `03-content.md` tampil.
- [x] Semua link header membawa ke tempat yang benar, dari posisi scroll mana pun, termasuk saat halaman dibuka
      langsung dengan `/#features`, `/#about`, `/#beta`.
- [x] Menu mobile bisa dipakai dengan keyboard dan pembaca layar.
- [x] `npm run lint` dan `npm run build` lolos.

## Bukan bagian phase ini

Audit aksesibilitas penuh, SEO, OG image, easter egg (phase 7).
