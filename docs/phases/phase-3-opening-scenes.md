# Phase 3 · Scene pembuka: Intro, Burden, Meet Claire

## Tujuan

Tiga scene pertama (keyframe 1–7 di `02-parallax.md`) jadi, desktop dan mobile.

## Prasyarat

- Phase 0, 1, 2 selesai.

## Baca dulu

- `docs/02-parallax.md` bagian 5 (keyframe 1–7), 6 (mobile), dan tabel ledakan 16 tile
- `docs/03-content.md` scene `intro`, `burden`, `meet`
- `docs/01-design-system.md` komponen visual dan kontras

## Tugas

- [x] Hapus timeline tes dari `src/timeline/claire.ts` dan hapus `scenes/DemoIntroScene.tsx` + `scenes/DemoBurdenScene.tsx`
      (ganti dengan `IntroScene` dan `BurdenScene` di `page.tsx`). Baca dulu "Seperti yang dibangun di phase 2" di
      `02-parallax.md` (aturan `data-px`, variant `px:`).
- [x] **Komponen UI:** `SceneLabel`, `LogTile`, `PhoneFrame`, `PhoneScreen`, `ClaireBubble`.
  - `PhoneFrame`: CSS saja, badan `voice-bottom`, radius `3rem`, layar radius `2.5rem`, rasio layar 1206:2622,
    lebar desktop `min(22rem, 26vw)`, mobile `62vw`. Slot untuk beberapa `PhoneScreen` bertumpuk (crossfade).
  - `LogTile`: warna dari `card-*`, teks `voice-bottom` (tile meal teks besar karena kontras 3,73).
- [x] **`IntroScene`:** wordmark tengah (top 38%), tagline di bawahnya, `scroll-hint` di bawah layar.
      Wordmark pakai `ThemeImage` (`brand.wordmark` + `brand.wordmarkDark`) dengan `fetchPriority="high"`.
      Jangan pakai `priority` (deprecated di Next 16) atau `preload` (dua gambar ikut terunduh).
- [x] **`BurdenScene`:** label + `burden-text` di kiri (top 63%, max lebar 24rem / 22vw), grid 4×4 di kanan
      (mulai di bawah layar). 16 tile sesuai tabel `03-content.md`, urutan warna diacak tetap.
      `relief-text` di tengah.
- [x] **`MeetScene`:** `star` di tengah, `hello` di bawahnya, `meet-text` di kiri, `phone` di kanan dengan
      `screen-home` (dan sudah menyiapkan `screen-voice`, `screen-meal`, dst. untuk phase 4, op 0).
      HP **dipakai bersama** oleh scene `meet` sampai `connect`, jadi taruh HP di lapisan panggung, bukan di dalam
      satu scene (scene hanya mengatur kapan ia terlihat lewat opacity).
- [x] **Timeline:** keyframe 1–7 desktop + versi mobile, nilai dari `02-parallax.md`. Keyframe 7 punya
      `anchor: "story"`.
- [x] **Latar:** keyframe 5 mengubah latar `home-cream` → `home-background`.
- [x] Setel durasi sampai teks sempat dibaca (lihat Tips menyetel).

## Selesai jika

- [x] Scroll dari atas: wordmark naik dan hilang, teks Burden dan grid naik, 16 tile meledak ke arah berbeda,
      "Claire takes it from here." muncul, bintang Claire muncul berputar, HP naik dengan layar Home.
- [x] Sama baiknya di 1440×900, 1280×800, 768×1024, 375×812.
- [x] Teks di tile terbaca (kontras sesuai `01-design-system.md`).
- [x] Dark mode: wordmark biru muda, kartu dan teks ikut token dark.
- [x] Reduced motion: tiga scene tampil bertumpuk rapi (wordmark, teks + grid tile, teks + HP).
- [x] `npm run lint` dan `npm run build` lolos.

## Bukan bagian phase ini

Scene `log` dan seterusnya, header nav.
