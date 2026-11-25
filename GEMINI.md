# Claire Website (instruksi untuk Gemini)

Project ini sebelumnya dikerjakan Claude. Lanjutkan dengan aturan yang sama.

## Urutan baca

1. `PROGRESS.md`: status sekarang, langkah berikutnya, log, jebakan yang sudah diketahui.
2. `docs/README.md`: rencana lengkap dan daftar phase.
3. File phase yang disebut di "Langkah berikutnya" di `PROGRESS.md`.
4. `AGENTS.md`: Next.js di sini versi 16 dan banyak yang berbeda dari versi lama.
   Baca panduan di `node_modules/next/dist/docs/` sebelum menulis kode.

## Wajib

- **Update `PROGRESS.md` sebelum mulai, setiap satu tugas selesai, dan saat berhenti.**
- Hanya frontend, static export (`output: "export"`). Tanpa database, API, form, cookie, analytics.
- Warna hanya hex dari AppColor (`docs/01-design-system.md`). Tidak ada hex lain, tidak ada warna bawaan Tailwind.
  Teks di atas `home-star` (kuning) selalu `voice-bottom` (`navy`/`home-ink` kurang kontras di kuning).
- Website hanya light mode (tidak ada `dark:` atau `prefers-color-scheme`).
- HP = bezel iPhone resmi Apple (`ui/PhoneFrame`). Aturan Apple: jangan beri bayangan, jangan miringkan/putar/potong,
  dan **jangan taruh apa pun di atas HP** (balon, chip, kartu, teks di samping saja). Cek dengan
  `scripts/test/bezel-scan.js` (cara pakai di file itu).
- Parallax: mesin sendiri sesuai `docs/02-parallax.md`, tanpa library animasi (GSAP, Motion, jQuery).
- Teks website bahasa Inggris, hanya di `src/content/`.
- Satu komponen per file.
- Jangan nyalakan `cacheComponents`. Jangan pakai `new Date()` di Server Component.
- Repo app `/Users/aaron/Documents/App/C5-M01-UburUbur` hanya dibaca, jangan diubah.
- Claire tidak pernah menentukan dosis insulin. Jangan tulis kalimat yang terdengar seperti saran dosis.
- Sebelum menyatakan selesai: `npm run lint` dan `npm run build` harus lolos.
- Commit hanya kalau Aaron minta.
- Jawab Aaron dalam bahasa Indonesia.
