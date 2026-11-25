# Phase 4 · Scene mencatat: Voice, Meal, Glucose, Insulin, Activity

## Tujuan

Scene `log` (keyframe 8–14): layar HP berganti dari Home ke Voice log, Meal, Glucose, Insulin, Activity,
dengan latar yang berubah ke navy saat Voice log.

## Prasyarat

- Phase 3 selesai (HP bersama di panggung, `PhoneScreen` bertumpuk).

## Baca dulu

- `docs/02-parallax.md` keyframe 8–14 dan mobile
- `docs/03-content.md` scene `log`

## Tugas

- [x] **Komponen UI:** `DeckIcon` (lingkaran warna `glucose-deck` / `insulin-deck` / `activity-deck`,
      ikon `voice-bottom`, label di bawah).
- [x] **`LogScene`** dengan tiga bagian teks yang bertumpuk di posisi yang sama (kiri):
      `voice-text`, `meal-text`, `quick-text`, masing-masing `SceneLabel` + paragraf.
- [x] Balon Claire `bubble-voice` ("Got it! All saved.") dan `bubble-meal` ("Yum, nasi goreng!") di dekat HP.
- [x] `voice-glow`: lingkaran blur `voice-glow` di belakang HP.
- [x] `ingredient-1..3`: chip bahan di kanan HP (layar < lg dan mobile: menumpuk di tepi kanan HP, karena di bawah HP
      tidak ada ruang). Isi dari screenshot `meal.webp`.
- [x] `deck-glucose`, `deck-insulin`, `deck-activity` di bawah teks `quick-text`.
- [x] Layar HP: `screen-voice`, `screen-meal`, `screen-glucose`, `screen-insulin`, `screen-activity` (crossfade).
- [x] **Timeline:** keyframe 8–14 desktop dan mobile. Keyframe 8: latar `home-background` → `voice-top`,
      `tone: "dark"`. Keyframe 10: latar `voice-top` → `home-cream`, `tone: "light"`.
- [x] Saat `tone: "dark"`, label dan teks scene berwarna `on-dark` (`#FFFDF6`, juga di dark mode), balon tetap `home-card`.

## Selesai jika

- [x] Urutan terasa jelas: Voice → Meal → Glucose → Insulin → Activity, tiap teks sempat dibaca.
- [x] Peralihan latar ke navy dan kembali ke cream halus. (Header belum fixed sampai phase 6, jadi pergantian warna header dicek di phase 6.)
- [x] Chip bahan sama dengan yang terlihat di screenshot meal.
- [x] Tidak ada kalimat yang terdengar seperti saran dosis.
- [x] Mobile dan reduced motion rapi.
- [x] `npm run lint` dan `npm run build` lolos.

## Bukan bagian phase ini

Tips, Dose, History, Connect, CTA.
