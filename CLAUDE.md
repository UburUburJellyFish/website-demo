@AGENTS.md

# Claire Website

**Baca `PROGRESS.md` paling pertama**, lalu `docs/README.md`. Kerjakan satu phase dari `docs/phases/` per sesi,
berurutan.

**Update `PROGRESS.md` sebelum mulai, setiap satu tugas selesai, dan saat berhenti** (aturannya di file itu).
Aaron bisa pindah ke Gemini kapan saja kalau token habis, jadi log harus selalu terkini.

- Hanya frontend, static export. Tanpa database, API, form, cookie, analytics.
- Warna hanya hex dari AppColor (`docs/01-design-system.md`). Teks di atas `home-star` (kuning) = `voice-bottom`.
  Hanya light mode.
- HP = bezel iPhone resmi Apple: tanpa bayangan, tidak miring/diputar/dipotong, tidak ada yang menimpa HP.
- Parallax: mesin sendiri sesuai `docs/02-parallax.md`, tanpa library animasi.
- Teks website bahasa Inggris, hanya di `src/content/`.
- Satu komponen per file.
- Jangan nyalakan `cacheComponents`, jangan pakai `new Date()` di Server Component.
- Repo app `../C5-M01-UburUbur` hanya dibaca.
